/**
 * Database Optimization Script
 * Creates indexes for better query performance
 * Run with: node scripts/optimize-database.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function optimizeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully!\n');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    console.log('📊 Current Indexes:');
    const existingIndexes = await collection.indexes();
    existingIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n🔨 Creating optimized indexes...\n');

    // Helper function to create index safely
    const createIndexSafely = async (keys, options) => {
      try {
        await collection.createIndex(keys, options);
        console.log(`✅ Created: ${options.name}`);
        return true;
      } catch (error) {
        if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
          console.log(`ℹ️  Already exists: ${options.name}`);
          return false;
        }
        throw error;
      }
    };

    // 1. Compound index for common admin queries (status + deletedAt + createdAt)
    await createIndexSafely(
      { status: 1, deletedAt: 1, createdAt: -1 },
      { name: 'status_deleted_created_idx' }
    );

    // 2. Index for public product queries
    await createIndexSafely(
      { status: 1, deletedAt: 1 },
      { name: 'public_products_idx' }
    );

    // 3. Text index for search functionality
    await createIndexSafely(
      { 
        title: 'text', 
        brand: 'text', 
        model: 'text', 
        location: 'text',
        description: 'text' 
      },
      { 
        name: 'search_idx',
        weights: {
          title: 10,      // Title most important
          brand: 8,
          model: 8,
          location: 5,
          description: 3
        }
      }
    );

    // 4. Index for sorting by creation date
    await createIndexSafely(
      { createdAt: -1 },
      { name: 'created_desc_idx' }
    );

    // 5. Index for year filtering
    await createIndexSafely(
      { year: -1 },
      { name: 'year_idx' }
    );

    console.log('\n📈 Analyzing collection statistics...');
    const stats = await db.command({ collStats: 'products' });
    console.log(`  Total documents: ${stats.count}`);
    console.log(`  Total size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`  Average document size: ${stats.avgObjSize} bytes`);
    console.log(`  Total indexes: ${stats.nindexes}`);
    console.log(`  Total index size: ${(stats.totalIndexSize / 1024).toFixed(2)} KB`);

    console.log('\n✨ Database optimization complete!');
    console.log('\n💡 Performance Tips:');
    console.log('  - Queries will now be faster for pagination');
    console.log('  - Search across multiple fields is optimized');
    console.log('  - Sorting by date uses index');
    console.log('  - Status filtering is indexed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error optimizing database:', error);
    process.exit(1);
  }
}

optimizeDatabase();

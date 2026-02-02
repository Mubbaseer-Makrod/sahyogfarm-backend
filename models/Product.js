const mongoose = require('mongoose');

/**
 * Product Schema
 * Stores tractor product information
 */
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0 && v.length <= 10;
        },
        message: 'Product must have between 1 and 10 images'
      }
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [1950, 'Year must be 1950 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: null
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'sold'],
        message: 'Status must be either available or sold'
      },
      default: 'available',
      index: true // Index for faster filtering
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true // For soft delete queries
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.deletedAt;
        return ret;
      }
    }
  }
);

// Indexes for common queries
productSchema.index({ status: 1, deletedAt: 1 });
productSchema.index({ createdAt: -1 }); // For sorting by newest
productSchema.index({ title: 'text' }); // For text search

/**
 * Query helper to exclude soft-deleted products
 */
productSchema.query.active = function () {
  return this.where({ deletedAt: null });
};

/**
 * Static method to get product statistics
 * @returns {Promise<object>}
 */
productSchema.statics.getStats = async function () {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const stats = await this.aggregate([
    { $match: { deletedAt: null } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        available: [
          { $match: { status: 'available' } },
          { $count: 'count' }
        ],
        sold: [
          { $match: { status: 'sold' } },
          { $count: 'count' }
        ],
        recent: [
          { $match: { createdAt: { $gte: sevenDaysAgo } } },
          { $count: 'count' }
        ]
      }
    }
  ]);

  const result = stats[0];
  return {
    total: result.total[0]?.count || 0,
    available: result.available[0]?.count || 0,
    sold: result.sold[0]?.count || 0,
    recent: result.recent[0]?.count || 0
  };
};

/**
 * Soft delete product
 */
productSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  await this.save();
};

/**
 * Toggle product status
 */
productSchema.methods.toggleStatus = async function () {
  this.status = this.status === 'available' ? 'sold' : 'available';
  await this.save();
  return this;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

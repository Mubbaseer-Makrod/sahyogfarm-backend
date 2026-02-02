/**
 * Seed Script: Insert 15 Dummy Tractor Products
 * Run with: node seed-products.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Existing Cloudinary image URLs from database
const imagePool = [
  "https://res.cloudinary.com/dxbhvlezt/image/upload/v1770007865/sahyogfarm/products/cq1l25hql2mjantnf39i.jpg",
  "https://res.cloudinary.com/dxbhvlezt/image/upload/v1770007871/sahyogfarm/products/cuaboophoxyosqbun5xc.jpg",
  "https://res.cloudinary.com/dxbhvlezt/image/upload/v1770008474/sahyogfarm/products/aalb488vt1wyuq5eyp24.jpg"
];

// Helper to get random images
const getRandomImages = () => {
  const count = Math.floor(Math.random() * 2) + 1; // 1-2 images
  const shuffled = [...imagePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 15 Realistic Tractor Products in Gujarati
const products = [
  {
    title: "મહિન્દ્રા 575 DI શક્તિમાન ટ્રેક્ટર - 2022",
    description: "50 HP શક્તિશાળી ટ્રેક્ટર, ઉત્તમ સ્થિતિમાં. માત્ર 450 કલાક ચાલ્યું. તમામ મેઈન્ટેનન્સ રેકોર્ડ ઉપલબ્ધ. પાવર સ્ટીયરિંગ સાથે.",
    brand: "Mahindra",
    model: "575 DI",
    year: 2022,
    price: 725000,
    location: "રાજકોટ, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "જોન ડીયર 5050 D - 2021 મોડલ",
    description: "55 HP, એસી કેબિન સાથે. સંપૂર્ણ સર્વિસ થયેલ. 600 કલાક વપરાશ. હાઈડ્રોલિક લિફ્ટ ઉત્તમ કામગીરી.",
    brand: "John Deere",
    model: "5050 D",
    year: 2021,
    price: 975000,
    location: "અમદાવાદ, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "સ્વરાજ 855 FE ટ્રેક્ટર - 2020",
    description: "60 HP, 8 ફોરવર્ડ + 2 રિવર્સ ગિયર. નવા ટાયર સાથે. ખેતી માટે શ્રેષ્ઠ. માલિકની સાચવણી.",
    brand: "Swaraj",
    model: "855 FE",
    year: 2020,
    price: 650000,
    location: "સુરત, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "ન્યુ હોલેન્ડ 3630 TX પ્લસ - 2023",
    description: "65 HP, લગભગ નવું. માત્ર 200 કલાક ચાલ્યું. તમામ એસેસરીઝ સાથે. એકદમ ફર્સ્ટ ક્લાસ હાલત.",
    brand: "New Holland",
    model: "3630 TX Plus",
    year: 2023,
    price: 1125000,
    location: "વડોદરા, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "મહિન્દ્રા આરોજન 605 DI - 2019",
    description: "60 HP, એક માલિક. સંપૂર્ણ પેપરવર્ક. નવા બેટરી અને ટાયર. 750 કલાક વપરાશ.",
    brand: "Mahindra",
    model: "Arjun 605 DI",
    year: 2019,
    price: 825000,
    location: "ભાવનગર, ગુજરાત",
    status: "sold",
    images: getRandomImages()
  },
  {
    title: "ટેફે 9502 DI ટ્રેક્ટર - 2022",
    description: "45 HP, કોમ્પેક્ટ સાઈઝ. નાના ખેતરો માટે આદર્શ. બધી સર્વિસ થયેલ. પાવર સ્ટીયરિંગ.",
    brand: "TAFE",
    model: "9502 DI",
    year: 2022,
    price: 595000,
    location: "જામનગર, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "સોનાલિકા DI 60 આરએક્સ - 2021",
    description: "60 HP, ડ્યુઅલ ક્લચ સિસ્ટમ. ઉત્તમ ફ્યુઅલ એફિશિયન્સી. 500 કલાક માત્ર. લોન ઉપલબ્ધ.",
    brand: "Sonalika",
    model: "DI 60 RX",
    year: 2021,
    price: 715000,
    location: "મહેસાણા, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "ઈશર 8504 ટ્રેક્ટર - 2020",
    description: "50 HP, મજબૂત બિલ્ડ. હેવી ડ્યુટી માટે યોગ્ય. તમામ ડોક્યુમેન્ટ્સ ક્લિયર. ઓવરહોલ થયેલ.",
    brand: "Eicher",
    model: "8504",
    year: 2020,
    price: 545000,
    location: "અંકલેશ્વર, ગુજરાત",
    status: "sold",
    images: getRandomImages()
  },
  {
    title: "મહિન્દ્રા યુવો 275 DI - 2023",
    description: "35 HP, નાના ખેતર માટે પરફેક્ટ. બ્રાન્ડ ન્યુ કન્ડીશન. 150 કલાક વપરાશ. ફુલ વોરંટી બાકી.",
    brand: "Mahindra",
    model: "Yuvo 275 DI",
    year: 2023,
    price: 485000,
    location: "નવસારી, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "જોન ડીયર 5075 E - 2022 પ્રીમિયમ",
    description: "75 HP હાઈ પાવર. એડવાન્સ ફીચર્સ સાથે. 400 કલાક. મલ્ટી-પર્પઝ ટ્રેક્ટર. એક્સલન્ટ કન્ડીશન.",
    brand: "John Deere",
    model: "5075 E",
    year: 2022,
    price: 1375000,
    location: "ગાંધીનગર, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "ન્યુ હોલેન્ડ 3037 TX - 2019",
    description: "55 HP, વર્કિંગ કન્ડીશન ઉત્તમ. 850 કલાક ચાલ્યું. નવા પાર્ટ્સ લગાવેલા. તાત્કાલિક વેચાણ.",
    brand: "New Holland",
    model: "3037 TX",
    year: 2019,
    price: 685000,
    location: "જુનાગઢ, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "મહિન્દ્રા 415 DI ટ્રેક્ટર - 2021",
    description: "42 HP, મધ્યમ કદ. સિંગલ ઓનર. બધું પેપરવર્ક તૈયાર. 550 કલાક વપરાશ. ટેસ્ટ ડ્રાઈવ ઉપલબ્ધ.",
    brand: "Mahindra",
    model: "415 DI",
    year: 2021,
    price: 565000,
    location: "પાટણ, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "સ્વરાજ 744 FE ટ્રેક્ટર - 2020",
    description: "50 HP, ફ્યુઅલ એફિશિયન્ટ મોડલ. સારી માઈલેજ. 700 કલાક. કોઈ મેજર રિપેર નહીં.",
    brand: "Swaraj",
    model: "744 FE",
    year: 2020,
    price: 615000,
    location: "મોરબી, ગુજરાત",
    status: "sold",
    images: getRandomImages()
  },
  {
    title: "ટેફે 8515 DI પાવરહાઉસ - 2023",
    description: "75 HP હાઈ પરફોર્મન્સ. હેવી ફાર્મિંગ માટે. લગભગ નવું 180 કલાક. વોરંટી વેલિડ.",
    brand: "TAFE",
    model: "8515 DI",
    year: 2023,
    price: 1095000,
    location: "આણંદ, ગુજરાત",
    status: "available",
    images: getRandomImages()
  },
  {
    title: "સોનાલિકા DI 745 III - 2022",
    description: "50 HP, રિલાયબલ પરફોર્મન્સ. બેસ્ટ બેકઅપ સપોર્ટ. 380 કલાક. ફર્સ્ટ ક્લાસ મેઈન્ટેનન્સ.",
    brand: "Sonalika",
    model: "DI 745 III",
    year: 2022,
    price: 665000,
    location: "રાજકોટ, ગુજરાત",
    status: "available",
    images: getRandomImages()
  }
];

// Connect to MongoDB and insert products
async function seedProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    console.log('Inserting 15 tractor products...');
    const result = await Product.insertMany(products);
    
    console.log(`\n✅ Successfully inserted ${result.length} products!`);
    console.log('\nInserted Product IDs:');
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Status: ${product.status}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

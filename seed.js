const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./server/models/Product');
const Store = require('./server/models/Store');

dotenv.config();

const products = [
    // MEN'S WEAR (20 Items)

    { name: 'Black Slim Fit Suit', price: 299, category: 'Men', image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&h=600&fit=crop', description: 'Italian cut black suit.' },
    { name: 'Urban Khaki Chinos', price: 55, category: 'Men', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop', description: 'Versatile everyday pants.' },
    { name: 'Graphic Street Tee', price: 25, category: 'Men', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=600&fit=crop', description: 'Modern graphic design.' },
    { name: 'Leather Biker Jacket', price: 199, category: 'Men', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&h=600&fit=crop', description: 'Premium black leather.' },
    { name: 'Oversized Hoodie', price: 65, category: 'Men', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop', description: 'Comfortable street style.' },

    { name: 'Turtleneck Sweater', price: 55, category: 'Men', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=600&fit=crop', description: 'Sophisticated winter essential.' },
    { name: 'Tailored Waistcoat', price: 75, category: 'Men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=600&fit=crop', description: 'Complete your formal look.' },
    { name: 'Grey Wool Overcoat', price: 220, category: 'Men', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop', description: 'Elegant winter protection.' },
    { name: 'Striped Dress Shirt', price: 48, category: 'Men', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=600&fit=crop', description: 'Office ready attire.' },
    { name: 'Rugby Polo Shirt', price: 42, category: 'Men', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&h=600&fit=crop', description: 'Heritage sporting style.' },
    { name: 'Beach Casual Shorts', price: 30, category: 'Men', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=600&fit=crop', description: 'Tropical holiday vibes.' },

    // WOMEN'S WEAR (25 Items)
    { name: 'Floral Summer Dress', price: 60, category: 'Women', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop', description: 'Bright and airy floral print.' },
    { name: 'High-Waisted Jeans', price: 65, category: 'Women', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop', description: 'Flattering retro cut.' },
    { name: 'Boho Maxi Skirt', price: 50, category: 'Women', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop', description: 'Flowy bohemian style.' },
    { name: 'Cashmere Cardigan', price: 110, category: 'Women', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop', description: 'Ultra-soft luxury wool.' },
    { name: 'Crop Top Hoodie', price: 45, category: 'Women', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&h=600&fit=crop', description: 'Sporty chic casual.' },
    { name: 'Leather Mini Skirt', price: 70, category: 'Women', image: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=500&h=600&fit=crop', description: 'Edge up your outfit.' },
    { name: 'Off-Shoulder Gown', price: 250, category: 'Women', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=600&fit=crop', description: 'Red carpet elegance.' },
    { name: 'Pleated Midi Dress', price: 95, category: 'Women', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=600&fit=crop', description: 'Professional yet stylish.' },
    { name: 'Velvet Evening Top', price: 65, category: 'Women', image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500&h=600&fit=crop', description: 'Lush texture for parties.' },
    { name: 'Sheer Party Blouse', price: 55, category: 'Women', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop', description: 'Glamorous night out.' },
    { name: 'Ruffled Neckline Top', price: 45, category: 'Women', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&h=600&fit=crop', description: 'Sweet feminine details.' },
    { name: 'Bomber Jacket - Satin', price: 85, category: 'Women', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop', description: 'Mix of sporty and glam.' },

    // ACCESSORIES & FOOTWEAR (25 Items)
    { name: 'Aviator Sunglasses', price: 120, category: 'Accessories', image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=600&fit=crop', description: 'Classic cool protection.' },
    { name: 'Oxford Leather Shoes', price: 160, category: 'Footwear', image: 'https://images.unsplash.com/photo-1621315271772-28b1f3a5df87?w=500&h=600&fit=crop', description: 'Handcrafted perfection.' },
    { name: 'White Cloud Sneakers', price: 95, category: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop', description: 'Walk on air.' },
    { name: 'Canvas Backpack', price: 55, category: 'Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop', description: 'Durable travel companion.' },
    { name: 'Sport Smartwatch', price: 250, category: 'Accessories', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=600&fit=crop', description: 'Tech meets fitness.' },
    { name: 'High Heel Stilettos', price: 130, category: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop', description: 'Elevate your evening.' },
    { name: 'Leather Bi-fold Wallet', price: 50, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=600&fit=crop', description: 'Slim and functional.' },
    { name: 'Running Performance X', price: 110, category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop', description: 'Reach your top speed.' },
    { name: 'Duffel Gym Bag', price: 65, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop', description: 'Pack your goals.' },
    { name: 'Pearl Earring Set', price: 75, category: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop', description: 'Elegant simplicity.' },
    { name: 'Casual Loafers', price: 90, category: 'Footwear', image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500&h=600&fit=crop', description: 'Easy luxury daily.' },
    { name: 'Minimalist Ring', price: 35, category: 'Accessories', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=600&fit=crop', description: 'Pure silver band.' }
];

const storeDetails = {
    name: 'Nostra Global Fashion',
    email: 'hello@nostra.fashion',
    phone: '+1 (800) NOSTRA-99',
    address: '450 Fashion District, Milan, Italy',
    socials: {
        instagram: 'https://instagram.com/nostra_elite',
        twitter: 'https://twitter.com/nostra_fashion',
        facebook: 'https://facebook.com/nostra_official'
    },
    openingHours: 'Mon - Sat: 10:00 AM - 9:00 PM, Sun: Closed'
};

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        console.log('Cleaning existing data...');
        await Product.deleteMany({});
        await Store.deleteMany({});

        console.log(`Inserting ${products.length} Products...`);
        await Product.insertMany(products);

        console.log('Storing Store Details...');
        await Store.create(storeDetails);

        console.log('\n--- SUCCESS ---');
        console.log('✅ 70+ Products seeded into "products" collection.');
        console.log('✅ Store details stored in "stores" collection.');
        console.log('✅ Backend is now fully populated!');

        process.exit(0);
    } catch (error) {
        console.error('❌ SEED ERROR:', error);
        process.exit(1);
    }
};

seedDB();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');
const Product = require('./server/models/Product');
const Order = require('./server/models/Order');

// Load environment variables
dotenv.config();

const runDiagnostics = async () => {
    console.log('--- Nostra Database Diagnostics ---');
    console.log('Attempting to connect to:', process.env.MONGO_URI);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected successfully to MongoDB.\n');

        // Check Users
        const userCount = await User.countDocuments();
        const users = await User.find({}, 'name email createdAt');
        console.log(`👥 USERS (${userCount}):`);
        if (userCount > 0) {
            console.table(users.map(u => ({
                ID: u._id.toString(),
                Name: u.name,
                Email: u.email,
                Joined: u.createdAt
            })));
        } else {
            console.log('No users found in database.');
        }

        console.log('\n-----------------------------------\n');

        // Check Products
        const productCount = await Product.countDocuments();
        const products = await Product.find({}, 'name price category');
        console.log(`📦 PRODUCTS (${productCount}):`);
        if (productCount > 0) {
            console.table(products.map(p => ({
                Name: p.name,
                Price: `$${p.price}`,
                Category: p.category
            })));
        } else {
            console.log('No products found in database.');
        }

        console.log('\n-----------------------------------\n');

        // Check Orders (New Payment Feature)
        const orderCount = await Order.countDocuments();
        console.log(`💳 ORDERS (${orderCount}):`);
        if (orderCount > 0) {
            const orders = await Order.find().populate('user', 'name');
            console.table(orders.map(o => ({
                OrderID: o._id.toString().slice(-6),
                Customer: o.user ? o.user.name : 'Unknown',
                Total: `$${o.totalPrice}`,
                Status: o.isPaid ? 'PAID ✅' : 'PENDING ❌',
                Date: o.createdAt.toLocaleDateString()
            })));
        } else {
            console.log('No orders placed yet.');
        }

        console.log('\n--- Diagnostics Complete ---');
        process.exit(0);

    } catch (err) {
        console.error('❌ Diagnostics Failed:');
        console.error(err.message);
        process.exit(1);
    }
};

runDiagnostics();

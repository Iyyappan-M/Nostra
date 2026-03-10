const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testAtlas = async () => {
    try {
        console.log('Testing Atlas connection...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connection Success!');
        console.log('Using DB:', mongoose.connection.name);
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:');
        console.error(err.message);
        process.exit(1);
    }
};

testAtlas();

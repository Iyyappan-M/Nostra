const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    try {
        console.log('Using URI:', process.env.MONGO_URI);
        console.log('Attempting to connect with Mongoose...');

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        console.log('✅ Success! Mongoose connected to Atlas.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Mongoose Connection Failed:');
        console.error(err);
        process.exit(1);
    }
};

testConnection();

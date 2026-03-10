const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testLonger = async () => {
    try {
        console.log('Testing Atlas with more detail...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
        });
        console.log('✅ Connected!');
        process.exit(0);
    } catch (err) {
        console.log('❌ Connection Error!');
        if (err.reason) {
            console.log('Reason:', JSON.stringify(err.reason, null, 2));
        } else {
            console.log(err);
        }
        process.exit(1);
    }
};

testLonger();

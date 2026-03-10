const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');

dotenv.config();

const createAdmin = async () => {
    const adminEmail = 'admin@nostra.com';
    const adminPassword = 'admin123'; // Password must be at least 6 characters

    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Cleaning old admin if exists...');
        await User.deleteOne({ email: adminEmail });

        console.log('Creating new Admin user...');
        const user = new User({
            name: 'Nostra Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await user.save();

        console.log('\n--- ADMIN CREATED SUCCESSFULLY ---');
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('----------------------------------\n');
        console.log('You can now log in at admin-login.html');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();

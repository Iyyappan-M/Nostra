const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');

dotenv.config();

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.log('Please provide an email. Example: node make_admin.js user@example.com');
        process.exit();
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { returnDocument: 'after' }
        );

        if (user) {
            console.log(`✅ Success! ${email} is now an ADMIN.`);
            console.log(user);
        } else {
            console.log(`❌ User with email ${email} not found.`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

makeAdmin();

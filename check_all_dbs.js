const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const listAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', mongoose.connection.name);

        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('\n--- All Databases ---');
        for (let dbInfo of dbs.databases) {
            console.log(`DB: ${dbInfo.name}`);
            const db = mongoose.connection.client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (let coll of collections) {
                const count = await db.collection(coll.name).countDocuments();
                console.log(`  - ${coll.name}: ${count} docs`);
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listAll();

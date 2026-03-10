const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        console.log("Attempting direct connection with MongoClient...");
        await client.connect();
        console.log("✅ MongoClient: Connected successfully!");

        // List databases
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        console.log("Databases:", dbs.databases.map(db => db.name));

    } catch (err) {
        console.error("❌ MongoClient: Connection failed!");
        console.error(err);
        if (err.message.includes('Authentication failed')) {
            console.log("\n=============================================");
            console.log("CRITICAL: This is an AUTHENTICATION error.");
            console.log("Verify in MongoDB Atlas -> Database Access:");
            console.log("1. Does user 'iyyappan16112001' exist?");
            console.log("2. Is the password EXACTLY 'iyyappan'?");
            console.log("=============================================");
        }
    } finally {
        await client.close();
    }
}

run();


const mongoose = require('mongoose');
const keys = require('../config');


const uri = `mongodb+srv://${keys.dbUser}:${keys.dbPassword}@${keys.dbUser}.xdrsx1s.mongodb.net/?retryWrites=true&w=majority&appName=transyltoonia`

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


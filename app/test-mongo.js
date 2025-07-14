import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'your-mongodb-uri-here';
const dbName = process.env.MONGODB_DB || 'your-db-name-here';

console.time('mongo-connect');
mongoose.connect(uri, { dbName })
  .then(() => {
    console.log('Connected!');
    console.timeEnd('mongo-connect');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
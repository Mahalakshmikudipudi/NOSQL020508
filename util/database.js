const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;


const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://mahalakshmiguthula125:41FkP94zrgTlrbgC@cluster0.5z4dqka.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};


exports.mangoConnect = mongoConnect;
exports.getDb = getDb;
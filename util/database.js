const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://mahalakshmiguthula125:41FkP94zrgTlrbgC@cluster0.5z4dqka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
      console.log('Connected!');
      callback(client);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

module.exports =  mongoConnect;
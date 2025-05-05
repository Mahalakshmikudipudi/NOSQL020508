const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId  = mongodb.ObjectId;
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    // Save user to the database
    const db = getDb();
    return db.collection('users')
      .insertOne(this)
      .then(result => {
        console.log('User Created');
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(userId) {
    // Find user by ID in the database
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })

      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
    
}

module.exports = User;

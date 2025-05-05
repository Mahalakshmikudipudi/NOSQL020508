const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId  = mongodb.ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart ? cart : { items: [] };
    this._id = id ? new ObjectId(id) : null;
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

  addToCart(product) {
    // Add product to user's cart
    // const  cartProduct = this.cart.items.findIndex(cp => {
    //   return cp.productId.toString() === product._id.toString();
    // });

    const updatedCart = { items: [{...product, quantity: 1}] };
    const db = getDb();
    return db.collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
      .then(result => {
        console.log('Product added to cart');
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

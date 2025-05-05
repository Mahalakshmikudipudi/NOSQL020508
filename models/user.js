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
    const  cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items] ;
    if(cartProductIndex >= 0) {
      // Product already exists in the cart
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {  
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }
    
    const updatedCart = { items: updatedCartItems };
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

  getCart() {
    // Get user's cart
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteItemFromCart(productId) {
    // Delete product from user's cart
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db.collection('users')
      .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } })
      .then(result => {
        console.log('Product deleted from cart');
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  addOrder() {
    // Add order to user's orders
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.username,
            email: this.email
          }
        };
        return db.collection('orders')
          .insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db.collection('users')
          .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getOrders() {
    // Get user's orders
    const db = getDb();
    return db.collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray()
      .then(orders => {
        console.log(orders);
        return orders;
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

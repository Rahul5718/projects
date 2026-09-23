const mongodb = require('mongodb');
const { getDb } = require('../util/database');

const ObjectId = mongodb.ObjectId;
const normalizeId = value => (value ? value.toString() : value);

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = id || null;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  // Get cart products with details using native MongoDB $in operator
  getCart() {
    const db = getDb();
    const cartItems = this.cart && this.cart.items ? this.cart.items : [];
    const productIds = cartItems.map(i => i.productId);

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          const cartItem = cartItems.find(i => i.productId.toString() === p._id.toString());
          return {
            ...p,
            quantity: cartItem ? cartItem.quantity : 0
          };
        });
      });
  }

  addToCart(productId) {
    const db = getDb();
    const cartItems = this.cart && this.cart.items ? this.cart.items : [];
    const normalizedProductId = normalizeId(productId);
    const existingItemIndex = cartItems.findIndex(item => normalizeId(item.productId) === normalizedProductId);

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ productId: normalizedProductId, quantity: 1 });
    }

    this.cart = { items: cartItems };

    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: cartItems } } }
      );
  }

  // Delete product from cart using the filter hint
  deleteItemFromCart(productId) {
    const db = getDb();
    const cartItems = this.cart && this.cart.items ? this.cart.items : [];
    const normalizedProductId = normalizeId(productId);
    const updatedCartItems = cartItems.filter(item => normalizeId(item.productId) !== normalizedProductId);

    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  clearCart() {
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: [] } } }
      );
  }

  static findById(userId) {
    const db = getDb();
    const queryId = typeof userId === 'string' ? userId : new ObjectId(userId);

    return db
      .collection('users')
      .findOne({ _id: queryId })
      .then(user => {
        if (user) return user;

        return db
          .collection('products')
          .findOne({ _id: queryId, cart: { $exists: true } })
          .then(productUser => productUser || null);
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: this._id },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  static getOrders(userId) {
    const db = getDb();
    const queryId = typeof userId === 'string' ? userId : new ObjectId(userId);
    return db
      .collection('orders')
      .find({ 'user._id': queryId })
      .toArray();
  }

}

module.exports = User;
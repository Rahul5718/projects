const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id || null;
    this.userId = userId;
  }

  // Save or Update Product
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update existing product
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Insert new product
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Fetch all products
  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Fetch a single product by ID
  static findById(prodId) {
    const db = getDb();
    const queryId = typeof prodId === 'string' ? prodId : new mongodb.ObjectId(prodId);
    return db
      .collection('products')
      .findOne({ _id: queryId })
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Delete product by ID
  static deleteById(prodId) {
    const db = getDb();
    const queryId = typeof prodId === 'string' ? prodId : new mongodb.ObjectId(prodId);
    return db
      .collection('products')
      .deleteOne({ _id: queryId })
      .then(result => {
        console.log('Deleted Product');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
const { MongoClient } = require('mongodb');

const userId = '6ab284f0837dbacfb99a22b1';

MongoClient.connect('mongodb://localhost:27017')
  .then(async (client) => {
    const db = client.db('mydb');
    const product = await db.collection('products').findOne({});

    if (!product) {
      console.log('No product found in products collection.');
      client.close();
      process.exit(1);
    }

    const cartItem = {
      productId: product._id.toString(),
      quantity: 1
    };

    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { cart: { items: [cartItem] } } }
    );

    const updatedUser = await db.collection('users').findOne({ _id: userId });
    console.log(JSON.stringify(updatedUser.cart, null, 2));
    client.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

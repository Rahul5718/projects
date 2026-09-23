const { MongoClient } = require('mongodb');

const userId = '6ab36fea837dbacfb99a22b6';

MongoClient.connect('mongodb://localhost:27017')
  .then(async (client) => {
    const db = client.db('mydb');
    const legacyUser = await db.collection('products').findOne({ _id: userId, cart: { $exists: true } });
    const product = await db.collection('products').findOne({ title: { $exists: true } });

    if (!product) {
      console.log('No product found in the products collection.');
      client.close();
      process.exit(1);
    }

    const cartItem = {
      productId: product._id.toString(),
      quantity: legacyUser?.cart?.items?.[0]?.quantity || 1
    };

    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          _id: userId,
          name: 'Rahul',
          email: 'rahul@gmail.com',
          cart: { items: [cartItem] }
        }
      },
      { upsert: true }
    );

    await db.collection('products').updateOne(
      { _id: userId },
      { $unset: { cart: '' } }
    );

    const updatedUser = await db.collection('users').findOne({ _id: userId });
    console.log(JSON.stringify(updatedUser, null, 2));
    client.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

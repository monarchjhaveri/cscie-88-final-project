const MongoClient = require("mongodb").MongoClient;

const URL = "mongodb://localhost:27017";
const DATABASE = "packages";
const COLLECTION = "packages";

class Dao {
  constructor() {
    MongoClient.connect(URL, function(err, client) {
      if (err) console.error("FAILED TO ENSURE UNIQUE NAME!");

      const db = client.db(DATABASE);
      const collection = db.collection(COLLECTION);
      collection.createIndex( { "name": 1 }, { unique: true } );

      client.close();
    });
  }

  findPackages(names, callback) {
    MongoClient.connect(URL, function(err, client) {
      if (err) return callback(err);
      
      const db = client.db(DATABASE);
      const collection = db.collection(COLLECTION);

      collection
        .find({ name: { $in: names } })
        .toArray(function(err, docs) {
          client.close();
          callback(err, docs);
        });
    });
  }

  upsertPackages(packages, callback) {
    MongoClient.connect(URL, function(err, client) {
      if (err) return callback(err);

      const db = client.db(DATABASE);
      const collection = db.collection(COLLECTION);

      var bulk = collection.initializeUnorderedBulkOp();

      packages.forEach(pkg => {
        bulk
          .find({name: pkg.name})
          .upsert()
          .updateOne(pkg);
      });

      bulk.execute(function(err, result) {
        client.close();
        callback(err, result);
      });
    });
  }
}

module.exports = Dao;
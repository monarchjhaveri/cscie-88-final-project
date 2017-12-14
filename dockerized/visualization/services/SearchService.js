const MongoClient = require("mongodb").MongoClient;
const URL = "mongodb://mongo:27017";
const DATABASE = "packages";
const COLLECTION = "packages";

class SearchService {
  search(query, callback) {
    MongoClient.connect(URL, function(err, client) {
      if (err) return console.error(err);

      const db = client.db(DATABASE);
      const collection = db.collection(COLLECTION);

      collection.find({
        $text: {
          $search: query
        }
      })
      .limit(100)
      .toArray((err, docs) => {
        client.close();
        callback(err, docs);
      })
    });  
  }

  fetch(packageName, callback) {
    MongoClient.connect(URL, function(err, client) {
      if (err) return console.error(err);

      const db = client.db(DATABASE);
      const collection = db.collection(COLLECTION);

      collection.findOne({
        name: packageName
      }, (err, docs) => {
        client.close();
        callback(err, docs);
      });  
    });
  }
}

module.exports = SearchService;
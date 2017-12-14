const fs = require('fs');
const request = require('request');
const path = require('path');
const KafkaConsumerService = require('./service/KafkaConsumerService');
const NpmService = require('./service/NpmService');
const Dao = require('./service/Dao');
const {cargo, waterfall, map, reflect} = require('async');

const kafkaConsumerService = new KafkaConsumerService('changes');
const npmService = new NpmService();
const dao = new Dao();

const cargoJob = cargo(function(changes, callback) {
  waterfall([
    cb => { dao.findPackages(changes.map(c => c.id), cb) },

    (dbResults, cb) => {
      const stalePackages = changes.filter(change => {
        return dbResults.find(
          dbr => dbr.name === change.id
            && dbr._rev !== change.rev
        )
      });
      cb(null, stalePackages);
    },

    (stalePackages, cb) => map(stalePackages, function(change, cb) {
      // get package info for all stale changes
      npmService.getPackage(change.id, (err, data) => {
        cb(null, err || data);
      });
    }, cb),

    (pkgs, cb) => {
      if (pkgs.length === 0) {
        cb(null, []);
      } else {
        pkgs.forEach(pkg => delete pkg._id);
        dao.upsertPackages(pkgs, cb);
      }
    }
  ], function(err, upserts) {
    console.log("Synced packages");
    if (err) return callback(err);
    else callback(null, upserts);
  });
}, 10)

kafkaConsumerService.onMessage(function (message) {
  const value = message.value.split(" ");
  const id = value[0];
  const rev = value[1];

  cargoJob.push({id, rev}, err => {
    if (err) console.error(err);
  });
});

function job() {
  // retrieve package with id from database
    // if package does not exist OR revision is different from local revision:
      // fetch package info from npm
      // insert package info into database
  

}


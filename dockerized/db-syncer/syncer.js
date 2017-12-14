const fs = require('fs');
const request = require('request');
const path = require('path');
const KafkaConsumerService = require('./service/KafkaConsumerService');
const NpmService = require('./service/NpmService');
const Dao = require('./service/Dao');
const {cargo, waterfall, map, reflect} = require('async');

  // retrieve package with id from database
    // if package does not exist OR revision is different from local revision:
      // fetch package info from npm
      // insert package info into database


function sync() {  
  const kafkaConsumerService = new KafkaConsumerService('changes');
  const npmService = new NpmService();
  const dao = new Dao();

  const cargoJob = cargo(function(changes, callback) {
    waterfall([
      cb => { 
        dao.findPackages(changes.map(c => c.id), cb) 
      },

      (dbResults, cb) => {
        console.log("findPackages found " + dbResults.length + " packages");
        const syncableChanges = changes.filter(change => {

          // return dbResults.find(
          //   dbr => dbr.name === change.id
          //     && dbr._rev !== change.rev
          // )
          
          const dbr = dbResults.find(dbr => dbr.name === change.id);
          if (!dbr) return true;
          const revHasChanged = dbr._rev !== change.rev;
          if (revHasChanged) return true;
          return false;
        });
        console.log("Stale Packages length: " + syncableChanges.length);
        cb(null, syncableChanges);
      },

      (syncableChanges, cb) => map(syncableChanges, function(change, cb) {
        // get package info for all stale changes
        npmService.getPackage(change.id, (err, data) => {
          cb(null, err || data);
        });
      }, cb),

      (pkgs, cb) => {
        if (pkgs.length === 0) {
          console.log("PKGS length was 0, returning");
          cb(null, []);
        } else {
          console.log("Pks length was " + pkgs.length);
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
}

// setTimeout(sync, 15 * 1000); // 15 second wait for other containers to come up
sync();
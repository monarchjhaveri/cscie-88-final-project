const fs = require('fs');
const request = require('request');
const path = require('path');
const { performance } = require('perf_hooks');

const url = 'https://replicate.npmjs.com/_changes';
const interval = 30 * 60 * 1000; // 30 minutes

function sync() {
  console.log("Starting sync...");
  const startTime = Date.now();
  const req = request(url, function(err, httpResponse, body) {
    console.log(`Query took ${Date.now() - startTime} milliseconds`);

    if (err) {
      console.log(err);
    } else {
      const json = JSON.parse(body);
      writeCsvFile(json);
    }

    console.log("Sleeping for " + interval + " milliseconds." );
  });
}

function writeCsvFile(json) {
  console.log("Starting writeCsvFile...");
  const startTime = Date.now();
  const fileName = `output/output-${startTime}.csv`;

  const csv = json.results.map(result => {
    return `${result.id} ${result.changes[0].rev}`;
  }).join("\n");

  fs.writeFileSync(fileName, csv);

  console.log(`writeCsvFile took ${Date.now() - startTime} milliseconds`);
}

sync();
setInterval(sync, interval);

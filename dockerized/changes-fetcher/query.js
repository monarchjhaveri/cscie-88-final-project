const fs = require('fs');
const request = require('request');
const path = require('path');
const { performance } = require('perf_hooks');

const fileName = path.join(__dirname, 'output.json');
const url = 'https://replicate.npmjs.com/_changes';

performance.mark('queryStart');
const req = request(url, function(err, httpResponse, body) {
  performance.mark('queryStop');
  performance.measure('QueryTime', 'queryStart', 'queryStop');
  const measure = performance.getEntriesByName('QueryTime')[0];
  console.log(`Query took ${measure.duration} milliseconds`);

  if (err) {
    console.log(err);
  } else {
    const json = JSON.parse(body);
    writeCsvFile(json);
  }
});

function writeCsvFile(json) {
  performance.mark('writeCsvFileStart');
  const timestamp = Date.now();
  const fileName = `output/output-${timestamp}.csv`;

  const csv = json.results.map(result => {
    return `${result.id} ${result.changes[0].rev}`;
  }).join("\n");

  fs.writeFileSync(fileName, csv);

  performance.mark('writeCsvFileStop');
  performance.measure('WriteCsvFileTime', 'writeCsvFileStart', 'writeCsvFileStop');
  const measure = performance.getEntriesByName('WriteCsvFileTime')[0];
  console.log(`writeCsvFile tool ${measure.duration} milliseconds`);
}

// req.pipe(writeStream);
const fs = require('fs-extra');
const path = require('path');

function sync() {
  const time = Date.now();
  const filename = `output/output-${time}.csv`;

  fs.copySync(
    path.resolve(__dirname, '_samples/_changes.csv'),
    path.resolve(__dirname, filename)
  );

  console.log(`wrote ${filename}`);
}

setInterval(sync, 60 * 1000);
sync();
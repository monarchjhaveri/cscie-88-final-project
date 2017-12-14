const { Client } = require('node-rest-client');
const DOMAIN = "http://registry.npmjs.com";

class NpmService {
  constructor() {
    this.client = new Client();
  }

  getPackage(name, callback) {
    this.getCall(`${DOMAIN}/${name}`, callback);
  }

  getCall(url, callback) {
    const req = this.client.get(url, function(data, response) {
      callback(null, data);
    });

    req.on('error', function(err) {
      callback(err);
    });
  }
}



module.exports = NpmService;
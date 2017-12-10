const Backbone = require('backbone');

const PackageCollection = Backbone.Collection.extend({
  url: '/packages'
});

module.exports = PackageCollection;
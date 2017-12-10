const PackageComponent = require('./components/PackageComponent');
const PackageCollection = require('./collections/PackageCollection');

window.Backbone = require('backbone');
window.d3 = require('d3');
window.$ = window.jQuery = require('jquery');

// const css = require('./styles/index.scss');
import './styles/index.scss';

const collection = new PackageCollection();
collection.fetch();

const view = new PackageComponent({
  el: "#out",
  collection: collection
});
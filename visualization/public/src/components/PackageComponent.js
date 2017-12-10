const Backbone = require('backbone');

const PackageComponent = Backbone.View.extend({
  initialize() {
    this.collection.on("all", () => this.render());
    this.render();
  },
  render() {
    const json = JSON.stringify(this.collection.toJSON());
    this.$el.html(json);
  }
});

module.exports = PackageComponent;
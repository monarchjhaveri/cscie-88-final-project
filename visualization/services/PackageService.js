const mock = require('./mock');

class PackageService {
  find(term) {
    return mock;
  }

  get(id) {
    const thePackage = mock.find(x => x.id === id);
    const dependencies = mock.find(x => thePackage.dependencies.indexOf(x.id) >= 0);
    const dependents = mock.find(x => thePackage.dependents.indexOf(x.id) >= 0);

    return { package: thePackage, dependencies, dependents }
  }
};

module.exports = PackageService;


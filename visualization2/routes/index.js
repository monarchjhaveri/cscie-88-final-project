var express = require('express');
var router = express.Router();
var SearchService = require('../services/SearchService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Package Search' });
});

router.get('/package/:name', function(req, res, next) {
  const searchService = new SearchService();
  searchService.fetch(req.params.name, (err, pkg) => {
    if (err) throw (err);
    const latestVersion = getLatestVersion(pkg);
    const dependencies = latestVersion.dependencies || [];
    const bugs = latestVersion.bugs || [];
    const author = latestVersion.author || {};
    const keywords = latestVersion.keywords ? latestVersion.keywords.join(", ") : "";


    res.render('package', 
      {
        searchParam: req.query.searchParam, 
        pkg: pkg,
        latestVersion: latestVersion,
        dependencies: dependencies,
        bugs, author, keywords
      }
    );
  })
})

function getLatestVersion(pkg) {
  const versions = pkg.versions;
  const keys = Object.keys(versions);
  const lastKey = keys[keys.length - 1];
  return versions[lastKey];
}

module.exports = router;

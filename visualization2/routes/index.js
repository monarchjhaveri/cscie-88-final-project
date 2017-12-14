var express = require('express');
var router = express.Router();
var SearchService = require('../services/SearchService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Package Search' });
});

router.get('/package/:name', function(req, res, next) {
  const searchService = new SearchService();
  searchService.fetch(req.params.name, (err, docs) => {
    if (err) throw (err);
    res.render('package', 
      {
        searchParam: req.query.searchParam, 
        json: JSON.stringify(docs)
      }
    );
  })
})

module.exports = router;

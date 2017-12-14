var express = require('express');
var router = express.Router();
const SearchService = require('../services/SearchService');

/* GET users listing. */
router.get('/search', function(req, res, next) {
  const searchService = new SearchService();
  const searchParam = req.query.searchParam;
  searchService.search(searchParam, (err, docs) => {
    if (err) throw (err);
    else res.send(docs);
  });
});

module.exports = router;

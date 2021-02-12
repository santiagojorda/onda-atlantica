var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
  res.render('index', {title: 'Onda Atlantica'});
});

module.exports = router;

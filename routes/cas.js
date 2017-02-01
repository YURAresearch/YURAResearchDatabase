var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var CASticket = req.query.ticket;
  if (CASticket.length!=46){
    res.send("Boo no ticket!");
  }
  else{
    res.redirect('/listings');
  }
});

module.exports = router;

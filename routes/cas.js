var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var CASticket = req.query.ticket;
  if (CASticket.length!=46){
    res.send("Boo no ticket!");
  }
  else{
    console.log(req.query.ticket);
    res.redirect('https://secure.its.yale.edu/cas/validate?service=https://yura-rdb.herokuapp.com/cas&ticket='+req.query.ticket);
  }
});

module.exports = router;

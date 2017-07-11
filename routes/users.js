var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send(cas_user);
    console.log(req.session[auth.session_name]);
    res.redirect('/listings');
});

module.exports = router;

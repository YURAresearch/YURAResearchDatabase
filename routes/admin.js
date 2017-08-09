var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res, next) {

  if (req.session.isAdmin != true) res.redirect('/listings');

  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    hideFooter: true,
  });
});

module.exports = router;

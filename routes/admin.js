var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin/:page', function(req, res, next) {

  if (req.session.isAdmin != true) res.redirect('/listings');

  if (req.params.page) {
    console.log(req.params.page);
    res.render('admin/'+ req.params.page, {
      title: 'Admin Dashboard',
      hideFooter: true,
    });
  } else {
    res.render('admin/database', {
      title: 'Admin Dashboard',
      hideFooter: true,
    });
  }

});

module.exports = router;

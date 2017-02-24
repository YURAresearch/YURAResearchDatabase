var CASAuthentication = require('cas-authentication');


// See https://github.com/kylepixel/cas-authentication
module.exports = function(host, port, casUrl){
  var cas = new CASAuthentication({
      cas_url         : casUrl || 'https://secure.its.yale.edu/cas',
      service_url     : process.env.HEROKU_HOST || 'http://' + host + ':' + port,
      cas_version     : '1.0'
  });
  return cas;
};

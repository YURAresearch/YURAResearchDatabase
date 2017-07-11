var CASAuthentication = require('cas-authentication');


// See https://github.com/kylepixel/cas-authentication
module.exports = function(host, port){
  var cas_user = "";
  var cas = new CASAuthentication({
      cas_url         : 'https://secure.its.yale.edu/cas',
      service_url     : process.env.HEROKU_HOST || 'http://' + host + ':' + port,
      cas_version     : '1.0',
      session_name    : 'cas_user',
  });
  return cas;
};

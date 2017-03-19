var google = require('googleapis');
var googleAuth = require('google-auth-library');
var key = require('./privateSettings.json');

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
              'https://www.googleapis.com/auth/drive'];

function authenticate() {
  return new Promise((resolve, error) => {
    var auth = new googleAuth();
    var jwt = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES);
    jwt.authorize(function(err, result) {
      if (err) {
        console.log(err);
        error(err);
      } else {
        resolve(jwt);
      }
    });
  });
};

var exports = module.exports = {};
exports.authenticate = authenticate;

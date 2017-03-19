var google = require('googleapis');
var googleAuth = require('google-auth-library');
var key = require('./privateSettings.json');

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
              'https://www.googleapis.com/auth/drive'];

function printError(err) {
  console.log('The API returned an error: ' + err);
}

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
        printError(err);
        error(err);
      } else {
        resolve(jwt);
      }
    });
  });
};

function getSpreadsheets() {
  return new Promise((resolve) => {
    authenticate().then((auth) => {
      var service = google.drive('v3');
			service.files.list({
        q: "mimeType='application/vnd.google-apps.spreadsheet'",
        auth: auth,
        pageSize: 1000,
        fields: "files(id, name)"
			}, function(err, response) {
				if (err) {
          printError(err);
					resolve(err);
          return;
				}
				resolve(response.files);
      });
    });
  });
}

function deleteFile(fileId) {
  return new Promise((resolve) => {
    authenticate().then((auth) => {
      var service = google.drive('v3');
			service.files.delete({
				auth: auth,
        fileId: fileId
			}, function(err, response) {
				if (err) {
          printError(err);
					resolve(error);
          return;
				}
				resolve(response);
      });
    });
  });
}

function addPermission(fileId, emailAddress) {
  return new Promise((resolve) => {
    authenticate().then((auth) => {
      var service = google.drive('v3');
      var userPermission = {
          'type': 'user',
          'role': 'writer',
          'emailAddress': emailAddress
      };
			service.permissions.create({
				auth: auth,
        resource: userPermission,
        fileId: fileId
			}, function(err, response) {
				if (err) {
          printError(err);
					resolve(error);
          return;
				}
				resolve(response);
      });
    });
  });
}

function create(title) {
  return new Promise((resolve) => {
    authenticate().then((auth) => {
      var sheets = google.sheets('v4');
      sheets.spreadsheets.create({
        auth: auth,
        resource: {
          properties: {
            title: title
          }
        }
      }, function(err, response) {
        if (err) {
          printError(err);
          resolve({error: err});
        }
        resolve({response: response});
      });
    });
  });
}

var exports = module.exports = {};
exports.deleteFile = deleteFile;
exports.create = create;
exports.addPermission = addPermission;
exports.deleteFile = deleteFile;
exports.getSpreadsheets = getSpreadsheets;

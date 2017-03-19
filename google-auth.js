var fs = require('fs');
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var readline = require('readline');

var client_data = require('./privateSettings.json');

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
              'https://www.googleapis.com/auth/drive'];

function getRows(range, spreadsheetId) {
  return new Promise((resolve) => {
    authenticate().then((oauth2Client) => {
      var sheets = googleapis.sheets('v4');
      sheets.spreadsheets.values.get({
        auth: oauth2Client,
        spreadsheetId: spreadsheetId,
        range: range,
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          resolve({error: err});
        }
        var rows = response.values;
        resolve({rows: rows});
      });
    });
  });
}

function list() {
  return new Promise((resolve) => {
    authenticate().then((auth) => {
      var service = googleapis.drive('v3');
      var userPermission = {
          'type': 'user',
          'role': 'writer',
          'emailAddress': 'victoriakirst@gmail.com'
      };
      console.log('files found.');
			service.permissions.create({
				auth: auth,
        resource: userPermission,
        fileId: '1IhzE4omRVhfOiv9wBjCXQBIIjhfs8wgk800H9X3OIAE'
			}, function(err, response) {
				if (err) {
					console.log('The API returned an error: ' + err);
					resolve(error);
          return;
				}
				resolve(response);
      });
    });
  });
}

function create() {
  return new Promise((resolve) => {
    authenticate().then((oauth2Client) => {
      var sheets = googleapis.sheets('v4');
      sheets.spreadsheets.create({
        auth: oauth2Client,
        resource: {
          properties: {
            title: 'Invite List'
          }
        }
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          resolve({error: err});
        }
        resolve({response: response});
      });
    });
  });
}

function update(row, startRow, endRow, spreadsheetId) {
  var range = startRow + ':' + endRow;
  return getRows(range, spreadsheetId).then((response) => {
    var rowNumber = response.rows.findIndex(rowRow => rowRow[0] == row[0]) + 1;
    var newRange = startRow + rowNumber + ':' + endRow + rowNumber;
    
    return new Promise((resolve) => {
      authenticate().then((oauth2Client) => {
        var sheets = googleapis.sheets('v4');
        sheets.spreadsheets.values.update({
          valueInputOption: 'RAW',
          auth: oauth2Client,
          spreadsheetId: spreadsheetId,
          range: newRange,
          resource: {
            range: newRange,
            values: [row],
            majorDimension: 'ROWS'
          }
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            resolve({error: err});
          }
          resolve({response: 'success'});
        });
      });
    });
  });
}

function create() {
  return new Promise((resolve) => {
    authenticate().then((oauth2Client) => {
      var sheets = googleapis.sheets('v4');
      sheets.spreadsheets.create({
        auth: oauth2Client,
        resource: {
          properties: {
            title: 'Invite List'
          }
        }
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          resolve({error: err});
        }
        resolve({response: response});
      });
    });
  });
}


function append(row, range, spreadsheetId) {
  return new Promise((resolve) => {
    authenticate().then((oauth2Client) => {
      var sheets = googleapis.sheets('v4');
      sheets.spreadsheets.values.append({
        valueInputOption: 'RAW',
        auth: oauth2Client,
        spreadsheetId: spreadsheetId,
        range: range,
        resource: {
          range: range,
          values: [row],
          majorDimension: 'ROWS'
        }
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          resolve({error: err});
        }
        resolve({response: 'success'});
      });
    });
  });
}

function authenticate() {
  return new Promise((resolve, error) => {
    var auth = new googleAuth();
    var key = client_data;
    var jwt = new googleapis.auth.JWT(
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
exports.getRows = getRows;
exports.append = append;
exports.update = update;
exports.create= create;
exports.list = list;
exports.authenticate = authenticate;

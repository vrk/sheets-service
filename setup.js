var readline = require('readline');
var googleapis = require('googleapis');
var googleSheets = require('./google-auth.js');

const SHEETS_URL_PREFIX = 'https://docs.google.com/spreadsheets/d/';

function getFiles() {
  return new Promise((resolve) => {
    googleSheets.authenticate().then((auth) => {
      var service = googleapis.drive('v3');
			service.files.list({
        q: "mimeType='application/vnd.google-apps.spreadsheet'",
        auth: auth,
        pageSize: 1000,
        fields: "files(id, name)"
			}, function(err, response) {
				if (err) {
					console.log('The API returned an error: ' + err);
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
    googleSheets.authenticate().then((auth) => {
      var service = googleapis.drive('v3');
			service.files.delete({
				auth: auth,
        fileId: fileId
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

function addPermission(fileId, emailAddress) {
  return new Promise((resolve) => {
    googleSheets.authenticate().then((auth) => {
      var service = googleapis.drive('v3');
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
					console.log('The API returned an error: ' + err);
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
    googleSheets.authenticate().then((oauth2Client) => {
      var sheets = googleapis.sheets('v4');
      sheets.spreadsheets.create({
        auth: oauth2Client,
        resource: {
          properties: {
            title: title
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

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu(rl, callback) {
  console.log();
  console.log('What would you like to do?');
  console.log('  (c)reate new spreadsheet');
  console.log('  (v)iew existing spreadsheets');
  console.log('  (s)hare spreadsheet with email');
  console.log('  (d)elete a spreadsheet');
  console.log('  (e)xit');
  console.log();

  rl.question('Enter your choice here: ', (choice) => {
    callback(rl, choice);
  });
}

function processChoice(rl, choice) {
  var onComplete = () => {
    menu(rl, processChoice);
  }
  if (choice == 'c') {
    createSpreadsheet(rl, onComplete);
  } else if (choice == 'v') {
    viewSpreadsheets(onComplete);
  } else if (choice == 's') {
    onShareMenu(rl, onComplete);
  } else if (choice == 'd') {
    onDeleteMenu(rl, onComplete);
  } else if (choice == 'e') {
    rl.close();
  } else {
    console.log('Invalid selection; please try again.');
    onComplete();
  }
}

function shareSpreadsheet(rl, fileId, onComplete) {
  rl.question('Share with (@gmail): ', (choice) => {
    if (!choice) {
      onComplete();
    } else {
      addPermission(fileId, choice).then(() => {
        console.log('Spreadsheet shared: ' + SHEETS_URL_PREFIX + fileId);
        onComplete();
      });
    }
  });
}

function createSpreadsheet(rl, onComplete) {
  rl.question('Title of spreadsheet: ', (choice) => {
    var title = choice;
    create(title).then((raw) => {
      shareSpreadsheet(rl, raw.response.spreadsheetId, onComplete);
    });
  });
}

function onShareMenu(rl, onComplete) {
  rl.question('Spreadsheet Id: ', (choice) => {
    if (!choice) {
      onComplete();
      return;
    }
    shareSpreadsheet(rl, choice, onComplete);
  });
}

function onDeleteMenu(rl, onComplete) {
  rl.question('Spreadsheet Id: ', (choice) => {
    if (!choice) {
      onComplete();
      return;
    }
    deleteFile(choice).then(onComplete);
  });
}

function viewSpreadsheets(onComplete) {
  getFiles().then((files) => {
    for (var file of files) {
      console.log('File:', file.id, file.name);
    }
    onComplete();
  });
}

menu(rl, processChoice);

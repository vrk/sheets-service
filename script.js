var readline = require('readline');
var google = require('./google-wrappers.js');

const SHEETS_URL_PREFIX = 'https://docs.google.com/spreadsheets/d/';



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
      google.addPermission(fileId, choice).then(() => {
        console.log('Spreadsheet shared: ' + SHEETS_URL_PREFIX + fileId);
        onComplete();
      });
    }
  });
}

function createSpreadsheet(rl, onComplete) {
  rl.question('Title of spreadsheet: ', (choice) => {
    var title = choice;
    google.create(title).then((raw) => {
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
    google.deleteFile(choice).then(onComplete);
  });
}

function viewSpreadsheets(onComplete) {
  google.getSpreadsheets().then((files) => {
    for (var file of files) {
      console.log('File:', file.id, file.name);
    }
    onComplete();
  });
}

menu(rl, processChoice);

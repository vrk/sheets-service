var readline = require('readline');
var google = require('./google-wrappers.js');

const SHEETS_URL_PREFIX = 'https://docs.google.com/spreadsheets/d/';

function askQuestion(prompt) {
  return new Promise((resolve, error) => {
    rl.question(prompt, (choice) => {
      resolve(choice);
    });
  });
}

async function processChoice(choice) {
  if (choice == 'c') {
    await createSpreadsheet();
  } else if (choice == 'v') {
    await viewSpreadsheets();
  } else if (choice == 's') {
    await onShareMenu();
  } else if (choice == 'd') {
    await onDeleteMenu();
  } else if (choice == 'e') {
    return;
  } else {
    console.log('Invalid selection; please try again.');
  }
}

async function shareSpreadsheet(fileId) {
  var choice = await askQuestion('Share with: (@gmail): ');
  if (choice) {
    await google.addPermission(fileId, choice);
  }
}

async function createSpreadsheet() {
  var choice = await askQuestion('Title of spreadsheet: ');
  var raw = await google.create(choice);
  const fileId = raw.response.spreadsheetId;
  await shareSpreadsheet(fileId);
  console.log('Spreadsheet created: ' + SHEETS_URL_PREFIX + fileId);
}

async function onShareMenu() {
  var choice = await askQuestion('Spreadsheet id: ');
  if (choice) {
    await shareSpreadsheet(choice);
    console.log('Spreadsheet shared: ' + SHEETS_URL_PREFIX + choice);
  }
}

async function onDeleteMenu() {
  var choice = await askQuestion('Spreadsheet id: ');
  if (choice) {
    await google.deleteFile(choice);
  }
}

async function viewSpreadsheets() {
  var files = await google.getSpreadsheets();
  for (var file of files) {
    console.log('File:', file.id, file.name);
  }
}

async function menu(rl, callback) {
  let choice = 'e';
  do {
    console.log();
    console.log('What would you like to do?');
    console.log('  (c)reate new spreadsheet');
    console.log('  (v)iew existing spreadsheets');
    console.log('  (s)hare spreadsheet with email');
    console.log('  (d)elete a spreadsheet');
    console.log('  (e)xit');
    console.log();
    choice = await askQuestion('Enter your choice here: ');
    await processChoice(choice);
  } while (choice != 'e');
  rl.close();
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
(async () => {
  await menu(rl, processChoice);
})();

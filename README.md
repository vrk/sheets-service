# Google Sheets Service Account CLI (sheets-service)
Create, view, share and delete Google Sheets owned by your [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) through this command-line tool

## The Problem
The [Google Sheets API](https://developers.google.com/sheets/api/reference/rest/) is a little silly. It is designed so that it is easy to do the following:
- User goes to your website
- User logs in with Google OAuth2
- User updates  *a spreadsheet that the user owns*

But it's pretty unusual that you'd want this behavior.

More likely is the case where you want to create a NodeJS backend whose data saves to one single Google Sheets spreadsheet, such as a sign-up form, i.e. something like this:
- User goes to your website
- User fills out form and submits it
- *Your* spreadsheet is populated with their submitted information

In order to do this, you have the following choices:
- **Option 1.** Use [sheetsu.com](http://sheetsu.com), which is easy-to-use but kind of [alarmingly expensive](https://sheetsu.com/pricing) *(Not a criticism! Kudos to the maker of Sheetsu; you get that money!)*
- **Option 2.** Create a [Google Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount) (GSA), which is like a new, invisible user that's tied to your application, whose data you can maniuplate without requiring user login.

To elaborate on **Option 2**, 
1. You would create your sign-up spreadsheet using your Google Service Account (GSA). Note that the spreadsheet will be owned by this invisible user, not by a "real" Gmail account.
2. Share the spreadsheet made by your GSA with your Gmail account (or with whatever account(s) you want to control your spreadsheet)
3. In your NodeJS server, use the Google Sheets API to read and write to this spreadsheet without needing to generate an OAuth2 token for your user.

Success, right?!

**EXCEPT** there is no UI to create spreadsheets via your Google Service Account account, lol. You have to create them programmatically.

And finally, that's what this command line script helps you to do! Via **sheets-service**, you can create, view, share and delete Google Sheets owned by your Google Service Account.

## Installation

1. Clone this repository
```
git clone https://github.com/vrk/sheets-service.git
```

2. Install dependencies
```
npm install
```

3. Create a Google Service Account
You can skip this if you have one already. Otherwise, go to the [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts/serviceaccounts-zero) section of the Google Developer Console and follow the wizard to create your new Google Service Account. You may need to create a new project to associate with this account.

4. Download your private key JSON file
You should see your new Google Service Account in the [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts/serviceaccounts-zero) menu for your project. Under "Options" on the right side of the table, click the 3-dot menu for your GSA account, and click "Create key". Create your private key in JSON format.

5. Move your private key to `./lib/privateSettings.json`
The **sheets-service** script will look for your private key JSON file in `./lib/privateSettings.json`, so move your private key .json file to the `lib/` directory of your cloned repo, and rename it to `privateSettings.json`

Now you should be ready to use the script!

## Usage
Once you have finished installation, you can run the script via:
```
npm start
```

or

```
node sheets-service.js
```

From there, the tool should be pretty self-explanitory.

## Questions, bugs, etc?
[File an issue](https://github.com/vrk/sheets-service/issues) in the tracker. 

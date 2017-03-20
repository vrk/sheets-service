# Google Sheets Service Account CLI (sheets-service)
Create, view, share and delete Google Sheets owned by your [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) through this command-line tool

## The Problem
There is no UI to create spreadsheets (or any Drive documents) via your [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) account. If you want to do this, you have to create them programmatically. In other words, you have to write a script... *or*... You can also you the **sheets-service** tool in this repo!

## The Solution
**sheets-service** is a command-line script that lets you create, view, share and delete Google Sheets owned by your Google Service Account.

## Why would I ever want this?
The [Google Sheets API](https://developers.google.com/sheets/api/reference/rest/) is a little silly. It is designed so that it is easy to do the following:
- User goes to your website
- User logs into your website using Google OAuth2
- User is now authenticated to update  a spreadsheet that the *user* owns

But it's pretty unusual that you'd want this behavior.

If you want your backend to interact with a spreadsheet, it's far your likely that you'd want your data to save to one single Google Sheets spreadsheet that *you* own, such as a sign-up form. In other words, you'd want something like this:
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

**EXCEPT:** See original problem statement. There's no UI for creating spreadsheets using your GSA account... that is, until now! Use the **sheets-service** script for a command-line interface to your GSA account's spreadsheets.

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

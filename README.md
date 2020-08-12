# JOSPSIS: Job Ordering Process, Scheduling and Inventory System

## OVERVIEW
A Quasar Framework Web System, developed as the automation process of job orders for the CDMO (CAMPUS DEVELOPMENT OFFICE) at the University of the Philippines.

## PREREQUISITES
Before you continue, ensure you have met the following requirements:
* You have installed Node >=10 and NPM >=5 on your machine.
* You are using a Windows or Mac OS machine.
* You have installed quasar cli. npm install -g @quasar/cli

## INSTALLATION
### Install the dependencies inside the folder
```bash
npm install
```

## LAUNCHING THE APP
### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

## FIREBASE SET UP (for authentication, cloud firestore database, cloud functions, etc.)
* See [Add Firebase to your Web App](https://softauthor.com/add-firebase-to-your-web-app/)
* See [Firebase Web Setup](https://firebase.google.com/docs/web/setup)

### Install firebase to JOPSIS
```bash
npm install firebase --save
```

### Change the Config Object
* after copying your config object from firebase
* go to the JOPSIS folder
* find the "src folder" then expand
* find the "boot folder" then expand
* open firebase.js file
* replace firebaseConfig with your own web app config object

## INSTALL REQUIRED DEV DEPENDENCIES
```bash
npm install firebase-admin –save
npm i @quasar/quasar-ui-qcalendar
npm install --save pluralize
```

## SET AN ADMIN ACCOUNT
* go to firebase authentication (make sure Email/Password under "Sign-in method tab" is ENABLED)
* under "Users tab" click add user then provide an email and password
* copy the User UID of your newly created account
* go to the JOPSIS folder then find the "functions folder"
* expand it then open index.js file
* scroll down then find the "userIsAdmin function"
* replace the existing UID with your copied UID

## DEPLOY FIREBASE FUNCTIONS (for admin account)
```bash
firebase deploy -functions only
```

### Sign in with the ADMIN ACCOUNT and start creating accounts for other usertypes
* other usertypes password: "default123"

## OTHER USEFUL COMMANDS
### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Useful links for documentation, guides, downloads, etc.
* See [Quasar Framework](https://quasar.dev/introduction-to-quasar).
* See [Firebase guides](https://firebase.google.com/docs/guides).
* See [Download npm and Node.js](https://www.npmjs.com/get-npm).

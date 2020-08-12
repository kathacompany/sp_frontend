const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;

admin.initializeApp();

exports.deleteUser = functions.auth.user().onDelete( user => {
	const doc = admin.firestore().collection('account').doc(user.uid);
	return doc.delete();
});

exports.onDelete = functions.https.onCall(async (ref, context) => {
    try {

        //User should be authenticated
        if (!context.auth) {
            throw new UnauthenticatedError('The user is not authenticated. Only authenticated Admin user can delete account.');
        }

        //User calling the Cloud Function is an Admin user
        const callerUid = context.auth.uid;
        const callerUserRecord = await admin.auth().getUser(callerUid);


        if (!callerUserRecord.customClaims.admin) {
            throw new NotAnAdminError('Only Admin user can delete account.');
        }

        return admin.auth().deleteUser(ref);

    } catch (error) {

        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidUsertypeError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }

    }
    
});
class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.type = 'UnauthenticatedError';
    }
}

class NotAnAdminError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.type = 'NotAnAdminError';
    }
}

class InvalidUsertypeError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.type = 'FileNotFound';
    }
}

function usertypeIsValid(usertype) {
    const validUsertypes = ['requestor', 'unit_head', 'cdmo_head', 'inventory', 'foreman', 'worker'];
    return validUsertypes.includes(usertype);
}

function userIsAdmin(callerUid) {
    const claims = {};
    claims['admin'] = true;
    claims['JOPSIS_user'] = true;

    //Just Change the userId '5IJW135UOEhYBMkt1wqcpRfSlJQ2' for the new Admin
    return admin.auth().setCustomUserClaims('5IJW135UOEhYBMkt1wqcpRfSlJQ2', claims);
}

exports.onCreate = functions.https.onCall(async (data, context) => {

    try {

        //User should be authenticated
        if (!context.auth) {
            throw new UnauthenticatedError('The user is not authenticated. Only authenticated Admin user can add account.');
        }

        //User calling the Cloud Function is an Admin user
        const callerUid = context.auth.uid;
        const callerUserRecord = await admin.auth().getUser(callerUid);


        if (!callerUserRecord.customClaims.admin) {
            throw new NotAnAdminError('Only Admin user can add account.');
        }

        //Checking that the new usertype is valid
        const usertype = data.usertype;
        if (!usertypeIsValid(usertype)) {
            throw new InvalidUsertypeError('The "' + usertype + '" usertype is not a valid usertype');
        }

        const newUser = {
            email: data.email,
            emailVerified: false,
            password: data.password,
            displayName: data.fullname,
            disabled: false
        }

        const userRecord = await admin.auth().createUser(newUser);

        const userId = userRecord.uid;

        const claims = {};
        claims[usertype] = true;
        claims['JOPSIS_user'] = true;

        await admin.auth().setCustomUserClaims(userId, claims);

        const accountDetails = {
        	usertype: data.usertype,
        	email: data.email,
        	userId: userId,
      		fullname: data.fullname,
      		telephone: data.telephone,
      		position: data.position,
      		unit: data.unit,
      		location: data.location,
      		area: data.area,
            remarks: data.remarks,
        	createdBy: callerUid,
        	createdOn: FieldValue.serverTimestamp()
        }

        await admin.firestore().collection('account').doc(userId).set(accountDetails);

    } catch (error) {

        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidUsertypeError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }

    }

});

exports.onUpdate = functions.https.onCall(async (data, context) => {

    try {

        //User should be authenticated
        if (!context.auth) {
            throw new UnauthenticatedError('The user is not authenticated. Only authenticated Admin user can update account.');
        }

        //User calling the Cloud Function is an Admin user
        const callerUid = context.auth.uid;  //uid of the user calling the Cloud Function
        const callerUserRecord = await admin.auth().getUser(callerUid);


        if (!callerUserRecord.customClaims.admin) {
            throw new NotAnAdminError('Only Admin user can update account.');
        }

        //Checking that the new usertype is valid
        const usertype = data.usertype;
        if (!usertypeIsValid(usertype)) {
            throw new InvalidUsertypeError('The "' + usertype + '" usertype is not a valid usertype');
        }

        const userId = data.userId;

        const updateUser = {
            displayName: data.fullname
        }

        await admin.auth().updateUser(userId, updateUser);
        
        const claims = {};
        claims[usertype] = true;
        claims['JOPSIS_user'] = true;

        await admin.auth().setCustomUserClaims(userId, claims);

        await admin.firestore().collection('account').doc(userId).update(data);

    } catch (error) {

        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidUsertypeError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }

    }

});
import * as firebaseAdmin from "firebase-admin";

const params = {
  type: process.env.FIREBASE_TYPE.replace(/\\n/gm, '\n'),
  projectId: process.env.FIREBASE_PROJECT_ID.replace(/\\n/gm, '\n'),
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID.replace(/\\n/gm, '\n'),
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/\\n/gm, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL.replace(/\\n/gm, '\n'),
  clientId: process.env.FIREBASE_CLIENT_ID.replace(/\\n/gm, '\n'),
  authUri: process.env.FIREBASE_AUTH_URI.replace(/\\n/gm, '\n'),
  tokenUri: process.env.FIREBASE_TOKEN_URI.replace(/\\n/gm, '\n'),
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_x509_CERT_URL.replace(/\\n/gm, '\n'),
  clientC509CertUrl: process.env.FIREBASE_CLIENT_x509_CERT_URL.replace(/\\n/gm, '\n'),
};

if (!firebaseAdmin.apps.length) {
  console.log(params);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(params),
    databaseURL: "https://quesdom-5bf6a-default-rtdb.firebaseio.com/",
  });
  console.log("Firebase initialized");
  console.log(firebaseAdmin);
}

const adminDB = firebaseAdmin.firestore();

export { firebaseAdmin, adminDB };

import * as firebaseAdmin from "firebase-admin";

const params = {
  type: process.env.FIREBASE_TYPE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_x509_CERT_URL,
  clientC509CertUrl: process.env.FIREBASE_CLIENT_x509_CERT_URL,
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

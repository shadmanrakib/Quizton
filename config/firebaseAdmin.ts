import * as firebaseAdmin from 'firebase-admin';
import * as serviceAccount from '../serviceAccountKey.json'

const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
}

if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(params),
        databaseURL: "https://quesdom-5bf6a-default-rtdb.firebaseio.com/"
    });
}

const adminDB = firebaseAdmin.firestore();

export { firebaseAdmin, adminDB }
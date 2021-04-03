const { parseCookies } = require('nookies');

import { firebaseAdmin } from '../../config/firebaseAdmin';

export default async (req, res) => {
    try {
        const parsedCookies = parseCookies({ req });
        const token = await firebaseAdmin.auth().verifyIdToken(parsedCookies["token"]);
        const { uid, email } = token;

        // console.log(req);

        // console.log(uid, req.qid);

        await firebaseAdmin.firestore()
            .collection('users')
            .doc(uid)
            .collection("questionsAnswered")
            .doc(req.body.qid)
            .set({
                isCorrect: req.body.isCorrect,
                timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp()
            }, { merge: true })

        res.status(200).send(req.body.isCorrect);
    }
    catch(err) {
        console.log(err);
        res.status(200)
    }
}
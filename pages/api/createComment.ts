import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";

import * as quesdom from "../../types/quesdom";
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    const parsedCookies = parseCookies({ req });
    const token = await firebaseAdmin.auth().verifyIdToken(parsedCookies["token"]);
    const { uid, email } = token;


    const userDoc = await adminDB.collection("users").doc(uid).get();
    const userData = userDoc.data();
    const username = userData.username;

    const { comment, qid } = JSON.parse(req.body);
    const timestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp();

    const commentDoc: quesdom.Comment = {
        uid,
        username,
        comment,
        timestamp,
        hasReply: false
    }

    await adminDB
        .collection('questions')
        .doc(qid)
        .collection('comments')
        .add(commentDoc)


    res.status(200).send({
        success: true,
        message: "Comment created successfully"
    })

}
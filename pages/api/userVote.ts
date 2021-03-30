import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs: quesdom.voteRequest = JSON.parse(req.body);
  try {
    const { kind, qid } = inputs;
    console.log(kind, qid);
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);

    const voteCollection = firebaseAdmin.firestore().collection("/votes");

    //Get all user votes for that particular question
    const snapshot = await voteCollection
      .where("uid", "==", token.uid)
      .where("qid", "==", qid)
      .get();

    //If user wanted to unvote
    if (kind === "unvote") {
      let upvoteDocCount = 0;
      let downvoteDocCount = 0;
      snapshot.forEach((doc) => {
        const voteDocument = doc.data() as quesdom.voteDocument;
        if (voteDocument.kind === "upvote") upvoteDocCount++;
        else if (voteDocument.kind === "downvote") downvoteDocCount++;
      });
      for (let i = 0; i < snapshot.docs.length; i++) {
        await snapshot.docs[i].ref.delete();
      }
      await firebaseAdmin
        .firestore()
        .doc(`/questions/${qid}`)
        .update({
          upvotes: firebaseAdmin.firestore.FieldValue.increment(
            -upvoteDocCount
          ),
          downvotes: firebaseAdmin.firestore.FieldValue.increment(
            -downvoteDocCount
          ),
        });
      res.status(200).send({ success: true, message: "Successfully unvoted" });
      return;
    }

    //if upvoting or downvoting
    if (kind === "upvote" || kind === "downvote") {
      const newVoteDoc: quesdom.voteDocument = {
        kind: kind,
        qid: qid,
        uid: token.uid,
      };
      if (snapshot.empty) {
        await voteCollection.add(newVoteDoc);
        await firebaseAdmin
          .firestore()
          .doc(`/questions/${qid}`)
          .update({
            upvotes: firebaseAdmin.firestore.FieldValue.increment(
              kind === "upvote" ? 1 : 0
            ),
            downvotes: firebaseAdmin.firestore.FieldValue.increment(
              kind === "downvote" ? 1 : 0
            ),
          });
        res.status(200).send({ success: true, message: "Successfully voted" });
        return;
      }
      //Assumes that there is only one vote document per question for each user
      const oldVoteDoc = snapshot.docs[0];
      const oldDocData = oldVoteDoc.data() as quesdom.voteDocument;
      if (kind === "upvote" && oldDocData.kind === "downvote") {
        await oldVoteDoc.ref.update(newVoteDoc);
        await firebaseAdmin
          .firestore()
          .doc(`/questions/${qid}`)
          .update({
            upvotes: firebaseAdmin.firestore.FieldValue.increment(1),
            downvotes: firebaseAdmin.firestore.FieldValue.increment(-1),
          });
      }
      if (kind === "downvote" && oldDocData.kind === "upvote") {
        await oldVoteDoc.ref.update(newVoteDoc);
        await firebaseAdmin
          .firestore()
          .doc(`/questions/${qid}`)
          .update({
            upvotes: firebaseAdmin.firestore.FieldValue.increment(-1),
            downvotes: firebaseAdmin.firestore.FieldValue.increment(1),
          });
      }
      if (kind === oldDocData.kind) {
        throw Error("User already voted this kind of vote");
      }
      res.status(200).send({ success: true, message: "Successfully voted" });
      return;
    }
    throw Error("'kind' field did not match the fields defined in voteRequest");
  } catch (e) {
    console.log(e);
    res.status(200).send({ success: false, message: e.message });
  }
};

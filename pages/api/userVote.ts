import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs: quesdom.voteRequest = JSON.parse(req.body);
  try {
    const { kind, qid } = inputs;
    // console.log(kind, qid);
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);
    //Delete all user's upvotes/downvotes on question, but keep track of what they voted for.
    const voteCollection = firebaseAdmin.firestore().collection("votes");
    const snapshot = await voteCollection
      .where("uid", "==", token.uid)
      .where("qid", "==", qid)
      .get();

    // let upvoteDocsDeleted = 0;
    // let downvoteDocsDeleted = 0;
    // for (let i = 0; i < snapshot.docs.length; i++) {
    //   const voteDoc = snapshot.docs[i].data() as quesdom.voteDocument;
    //   // console.log(voteDoc);
    //   if (voteDoc.kind === "downvote") downvoteDocsDeleted++;
    //   else if (voteDoc.kind === "upvote") upvoteDocsDeleted++;
    //   await snapshot.docs[i].ref.delete();
    // }

    const voteDocKind: string | null = snapshot.docs.length > 0 ? snapshot.docs[0].data().kind : null;
    //Update question upvote/downvote fields.
    const questionDoc = firebaseAdmin.firestore().doc(`questions/${qid}`);
    const questionData = (await questionDoc.get()).data() as quesdom.Question;
    // console.log(questionData);
    if (kind === "downvote" && voteDocKind !== "downvote") {
      console.log("downvoting")
      await questionDoc.update({
        downvotes: questionData.downvotes + 1,
        upvotes: questionData.upvotes,
      });
    }
    else if (kind === "upvote" && voteDocKind !== "upvote") {
      console.log("upvoting")
      await questionDoc.update({
        downvotes: questionData.downvotes,
        upvotes: questionData.upvotes + 1,
      });
    }
    else if (kind === "downvote" && voteDocKind !== "downvote") {
      await questionDoc.update({
        upvotes: questionData.upvotes,
        downvote: questionData.upvotes,
      });
      res.status(200).send({ success: true, message: "Successfully unvoted" });
    }

    //if upvoting or downvoting, then create a document to reflect that
    if (kind === "upvote" || kind === "downvote") {
      const userDocument = (
        await firebaseAdmin.firestore().doc(`/users/${token.uid}`).get()
      ).data() as quesdom.authorMetaData;
      const newVoteDoc: quesdom.voteDocument = {
        kind: kind,
        qid: qid,
        uid: token.uid,
        username: userDocument.username,
      };
      await voteCollection.add(newVoteDoc);

      res.status(200).send({ success: true, message: "Successfully voted" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).send({ success: false, message: e.message });
  }
};

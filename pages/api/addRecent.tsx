import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Request and Cookies
  const { qid, kind } = JSON.parse(req.body) as quesdom.AddRecentRequest;
  const parsedCookies = parseCookies({ req });
  //Firebase
  const fs = firebaseAdmin.firestore();
  const userCollection = fs.collection("/users");
  const quizCollection = fs.collection("/quizzes");
  const questionCollection = fs.collection("/questions");

  try {
    //Verification
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);
    const userRecentCollection = userCollection
      .doc(token.uid)
      .collection("recent");

    //Sort by most recent, and get the first document
    const mostRecentDocArray = await userRecentCollection
      .orderBy("date", "desc")
      .limit(1)
      .get();

    let objectToAppend: quesdom.QuestionRecentData | quesdom.QuizRecentData;
    if (kind === "question") {
      const question = (
        await questionCollection.doc(qid).get()
      ).data() as quesdom.Question;
      const data: quesdom.QuestionRecentData = {
        author: question.author,
        date: new Date().getTime(),
        kind: "multipleChoice",
        qid: qid,
        question: question,
      };
      objectToAppend = data;
    }
    if (kind === "quiz") {
      const quiz = (await quizCollection.doc(qid).get()).data() as quesdom.Quiz;
      const data: quesdom.QuizRecentData = {
        author: quiz.author,
        date: new Date().getTime(),
        kind: "quiz",
        qid: qid,
        title: quiz.title,
      };
    }
    if (kind === undefined) throw { message: "Invalid kind", success: false };
    if (mostRecentDocArray.empty) {
      //Since it was empty, that means this is the first recentQuestion being added
      //Create the document and return early

      await userRecentCollection.doc().create({
        date: new Date().getTime(),
        dataArray: [objectToAppend],
      });
      res.status(200).send({
        message: "Wrote to recent collection successfully",
        success: true,
      });
      return;
    }

    const mostRecentDocData = mostRecentDocArray.docs[0].data() as quesdom.RecentThingsBatch;
    //Limit each document dataArray to 15 elements. Create new document with present time if adding would exceed 500
    if (mostRecentDocData.dataArray.length < 15) {
      console.log(mostRecentDocData.dataArray.length);
      await mostRecentDocArray.docs[0].ref.update({
        dataArray: firebaseAdmin.firestore.FieldValue.arrayUnion(
          objectToAppend
        ),
      });
    } else {
      await userRecentCollection.doc().create({
        date: new Date().getTime(),
        dataArray: [objectToAppend],
      });
    }

    res.status(200).send({
      message: "Wrote to recent collection successfully",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(200).send(e);
  }
};

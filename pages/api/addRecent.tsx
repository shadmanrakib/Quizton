import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";

//User Doc (qid)
//  - recentQuizzes (collection)
//    - chunks less than 1mb each containing 0 or more quizzes
//  - recentQuestions (collection)
//    - chunks less than 1mb each containing 0 or more questions
//  - recentSearches (collection)
//    - chunsk less than 1mb each containing 0 or more strings

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
    const userDoc = fs.doc("/users/" + token.uid);
    const recentQuizzes = userDoc.collection("recentQuizzes");
    const recentQuestions = userDoc.collection("recentQuestions");
    const recentSearches = userDoc.collection("recentSearches");

    if (kind === "search") {
      const element: quesdom.SearchRecentData = {
        timestamp: new Date().getTime(),
        kind: "search",
        query: qid,
      };
      const latestQuery = await recentSearches
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();
      if (latestQuery.empty) {
        const schema: quesdom.RecentThingsBatch = {
          timestamp: new Date().getTime(),
          dataArray: [element],
        };
        await recentSearches.add(schema);
        res.status(200).send({
          message: "Data successfully added to recent",
          success: true,
        });
      }
      const latestDocSnap = latestQuery.docs[0];
      const latestDocData = latestDocSnap.data() as quesdom.RecentThingsBatch;
      if (
        roughSizeOfObject(latestDocData) + roughSizeOfObject(element) <
        800 * 1000
      ) {
        //Limits to 800kb
        await latestDocSnap.ref.update({
          dataArray: firebaseAdmin.firestore.FieldValue.arrayUnion(element),
        });
      } else {
        //Document too big!
        const schema: quesdom.RecentThingsBatch = {
          timestamp: new Date().getTime(),
          dataArray: [element],
        };
        await recentSearches.add(schema);
      }
    } else if (kind === "multipleChoice") {
      const questionData = await questionCollection.doc(qid).get();
      const element: quesdom.QuestionRecentData = {
        timestamp: new Date().getTime(),
        kind: "multipleChoice",
        qid: qid,
        question: questionData.data() as quesdom.multipleChoice,
      };
      const latestQuery = await recentQuestions
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();
      if (latestQuery.empty) {
        const schema: quesdom.RecentThingsBatch = {
          timestamp: new Date().getTime(),
          dataArray: [element],
        };
        await recentQuestions.add(schema);
        res.status(200).send({
          message: "Data successfully added to recent",
          success: true,
        });
      }
      const latestDocSnap = latestQuery.docs[0];
      const latestDocData = latestDocSnap.data() as quesdom.RecentThingsBatch;
      if (
        roughSizeOfObject(latestDocData) + roughSizeOfObject(element) <
        800 * 1000
      ) {
        //Limits to 800kb
        await latestDocSnap.ref.update({
          dataArray: firebaseAdmin.firestore.FieldValue.arrayUnion(element),
        });
      } else {
        //Document too big!
        const schema: quesdom.RecentThingsBatch = {
          timestamp: new Date().getTime(),
          dataArray: [element],
        };
        await recentQuestions.add(schema);
      }
    } else if (kind === "quiz") {
      const quizData = await quizCollection.doc(qid).get();
      const element: quesdom.QuizRecentData = {
        timestamp: new Date().getTime(),
        kind: "quiz",
        qid: qid,
        quiz: quizData.data() as quesdom.Quiz,
      };
      const latestQuery = await recentQuizzes
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();
      console.log(latestQuery.docs);
      if (latestQuery.empty) {
        const schema: quesdom.RecentThingsBatch = {
          timestamp: new Date().getTime(),
          dataArray: [element],
        };
        await recentQuizzes.add(schema);
        res.status(200).send({
          message: "Data successfully added to recent",
          success: true,
        });
        return;
      }
      const latestDocSnap = latestQuery.docs[0];
      const latestDocData = latestDocSnap.data() as quesdom.RecentThingsBatch;

      if (
        roughSizeOfObject(latestDocData) + roughSizeOfObject(element) <
        800 * 1000
      ) {
        //Limits to 800kb
        await latestDocSnap.ref.update({
          dataArray: firebaseAdmin.firestore.FieldValue.arrayUnion(element),
        });
      } else {
        //Document too big!
        const schema: quesdom.RecentThingsBatch = {
          timestamp: new Date().getTime(),
          dataArray: [element],
        };
        await recentQuizzes.add(schema);
      }
    } else {
      throw { message: "'kind' did not match", success: false };
    }
    res
      .status(200)
      .send({ message: "Data successfully added to recent", success: true });
    //Sort by most recent, and get the first document
  } catch (e) {
    console.log(e);
    res.status(200).send(e);
  }
};

function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}

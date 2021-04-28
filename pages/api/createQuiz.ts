import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { questions, title } = JSON.parse(req.body) as quesdom.QuizRequest;
  const cookies = parseCookies({ req });
  const fs = firebaseAdmin.firestore();
  const userCollection = fs.collection("/users");
  const quizCollection = fs.collection("/quizzes");

  try {
    const user = await firebaseAdmin.auth().verifyIdToken(cookies["token"]);
    const userDocument = await userCollection.doc("/" + user.uid).get();
    if (!userDocument.exists)
      throw { message: "User document does not exist", success: false };
    const userData = userDocument.data() as quesdom.authorMetaData;
    const authorObject: quesdom.authorMetaData = {
      uid: user.uid,
      username: userData.username,
    };
    //Quizzes currently are only multiple chocie

    const newQuizDocument: quesdom.Quiz = {
      date: JSON.stringify(new Date()),
      author: authorObject,
      title: title,
      questions: questions.map((val) => {
        const MCQuestion: quesdom.Question = {
          kind: "multipleChoice",
          answerChoices: val.answerChoices,
          author: userData,
          correctAnswer: val.correctAnswer,
          date: JSON.stringify(new Date()),
          downvotes: 0,
          upvotes: 0,
          votes: 0,
          explanation: val.explanation,
          question: val.question,
          tags: val.tags,
        };
        return MCQuestion;
      }),
    };
    await quizCollection.add(newQuizDocument);
    res
      .status(200)
      .send({ message: "Quiz created successfully", success: true });
  } catch (e) {
    res.status(200).send("Failed");
  }
};

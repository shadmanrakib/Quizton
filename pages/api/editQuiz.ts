import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";
import sanitizeHtml from "sanitize-html";

import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ELASTIC_URL,
});

function sanitize(html: string) {
  const tags = sanitizeHtml.defaults.allowedTags.concat([
    "math",
    "maction",
    "maligngroup",
    "malignmark",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mi",
    "mlongdiv",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mscarries",
    "mscarry",
    "msgroup",
    "msline",
    "mspace",
    "msqrt",
    "msrow",
    "mstack",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "semantics",
    "annotation",
    "annotation-xml",
  ]);

  const options = {
    allowedTags: tags,
    allowedAttributes: {
      span: ["class", "contentEditable", "style", "aria-hidden", "data-value"],
      annotation: ["encoding"],
      math: [
        {
          name: "xmlns",
          multiple: true,
          values: ["http://www.w3.org/1998/Math/MathML"],
        },
      ],
    },
  };
  //Separate function in case we want to do more processing or use extra features
  return sanitizeHtml(html, options);
}

function elasticSearchIndexPreprocessing(questions: quesdom.QuizQuestion[]): {
  allTags: string[];
  allQuestions: string[];
} {
  var allTags = new Set<string>();

  questions.forEach((val) => {
    val.tags.forEach((tag) => {
      allTags.add(tag);
    }
    )
  });

  const allQuestions: string[] = questions.map((val) => {
    return val.question;
  });

  return { allTags: Array.from(allTags), allQuestions: allQuestions };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    quiz: { questions, title },
    qid,
  } = JSON.parse(req.body) as quesdom.EditQuizRequest;
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

    const newQuizDocument = {
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
          explanation: sanitize(val.explanation),
          question: sanitize(val.question),
          tags: val.tags,
          organization: {
            subject: val.tags[0] === undefined ? null : val.tags[0],
            topic: val.tags[1] === undefined ? null : val.tags[1],
            subtopic: val.tags[2] === undefined ? null : val.tags[2],
          },
        };
        return MCQuestion;
      }),
    };
    await quizCollection.doc(qid).update(newQuizDocument);

    const { allQuestions, allTags } = elasticSearchIndexPreprocessing(
      newQuizDocument.questions
    );

    await client.update({
      id: qid,
      index: "index-quizzes",
      body: {
        votes: 0,
        author: authorObject,
        title: title,
        allTags: allTags,
        allQuestions: allQuestions,
        date: new Date().toISOString(),
      },
    });

    res
      .status(200)
      .send({ message: "Quiz edited successfully", success: true });
  } catch (e) {
    console.log(e);
    res.status(200).send("Failed");
  }
};

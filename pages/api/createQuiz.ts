import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";
import sanitizeHtml from "sanitize-html";

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTIC_URL
})

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

function elasticSearchIndexPreprocessing(questions: quesdom.QuizQuestion[]): { allTags: string[], allQuestions: string[] } {
  var allTags = new Set<string>();

  questions.forEach((val) => {
    for (const tag in val.tags) {
      allTags.add(tag);
    }
  })

  const allQuestions: string[] = questions.map((val) => {
    return val.question;
  })

  return { allTags: Array.from(allTags), allQuestions: allQuestions };
}

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
    //Quizzes currently are only multiple choice

    const createDate = firebaseAdmin.firestore.FieldValue.serverTimestamp();

    const newQuizDocument: quesdom.Quiz = {
      date: createDate,
      author: authorObject,
      title: title,
      upvotes: 0,
      downvotes: 0,
      votes: 0,
      questions: questions.map((val) => {
        const QuizQuestion: quesdom.QuizQuestion = {
          kind: "multipleChoice",
          answerChoices: val.answerChoices,
          author: userData,
          correctAnswer: val.correctAnswer,
          date: new Date(),
          explanation: sanitize(val.explanation),
          question: sanitize(val.question),
          tags: val.tags,
        };
        return QuizQuestion;
      }),
    };

    const { id } = await quizCollection.add(newQuizDocument);

    const { allQuestions, allTags } = elasticSearchIndexPreprocessing(newQuizDocument.questions);

    await client.index({
      id: id,
      index: "index-quizzes",
      body: {
        votes: 0,
        author: authorObject,
        title: title,
        allTags: allTags,
        allQuestions: allQuestions,
        date: (new Date()).toISOString()
      }
    })

    res
      .status(200)
      .send({ message: "Quiz created successfully", success: true });
  } catch (e) {
    console.log(e);
    res.status(200).send({message: e});
  }
};

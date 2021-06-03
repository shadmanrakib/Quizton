// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies } from "nookies"; //, setCookie, destroyCookie
import type { NextApiRequest, NextApiResponse } from "next";
import sanitizeHtml from "sanitize-html";
import * as quesdom from "../../types/quesdom";
import Timestamp from "firebase/firestore/";

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


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs = JSON.parse(req.body);

  if (!parsedCookies["token"])
    return res.status(200).send({ success: false, message: `No User Token` });
  try {
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);
    // the user is authenticated!

    const { uid, email } = token;
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const userData = userDoc.data();

    const createDate = firebaseAdmin.firestore.FieldValue.serverTimestamp();

    if (!inputs.tags) inputs.tags = [];
    const tags = inputs.tags.map((value) => {
      return value.value;
    });

    const sanitizedQuestion = sanitize(inputs.question);

    var choicesString = "";
    const sanitizedChoices = inputs.answerChoices.map((value) => {
      const sanitizedChoice = sanitize(value.value);
      if (sanitizedChoice) {
        choicesString += " " + sanitizedChoice;
      }
      return sanitizedChoice;
    });
    const sanitizedExplanation = sanitize(inputs.explanation);
    const author = {
      uid: uid,
      username: userData.username,
      hasProfilePicture: userData.hasProfilePicture,
    };

    const multipleChoiceQuestion: quesdom.multipleChoice = {
      kind: "multipleChoice",
      answerChoices: sanitizedChoices,
      correctAnswer: Number.parseInt(inputs.correctAnswer),
      question: sanitizedQuestion,
      tags: tags,
      votes: 0,
      upvotes: 0,
      downvotes: 0,
      explanation: sanitizedExplanation,
      date: createDate,
      author: author,
      organization: {
        subject: tags[0] === undefined ? null : tags[0],
        topic: tags[1] === undefined ? null : tags[1],
        subtopic: tags[2] === undefined ? null : tags[2],
      },
    };

    const { id } = await adminDB
      .collection("questions")
      .add(multipleChoiceQuestion); // Convert Inputs to multipleChoice

    await client.index({
      id: id,
      index: "index-questions",
      body: {
        kind: "multipleChoice",
        votes: 0,
        tags: tags,
        question: sanitizedQuestion,
        date: new Date().toISOString(),
        author: author,
      },
    });

    return res.status(200).send({
      success: true,
      message: `Question added successfully.`,
    });
  } catch (err) {
    // Return undefined if there is no user. You may also send a different status or handle the error in any way that you wish.
    console.log(err);
    return res.status(200).send({ success: false, message: err });
  }
};

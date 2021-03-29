// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import type { NextApiRequest, NextApiResponse } from "next";
import sanitizeHtml from 'sanitize-html';
import * as quesdom from "../../types/quesdom";

function sanitize(html: string) {
  const tags = sanitizeHtml.defaults.allowedTags.concat([ 'math', 'maction', 'maligngroup', 'malignmark', 'menclose', 'merror', 'mfenced', 'mfrac', 'mi', 'mlongdiv', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mscarries', 'mscarry', 'msgroup', 'msline', 'mspace', 'msqrt', 'msrow', 'mstack', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'semantics', 'annotation', 'annotation-xml' ]);
  console.log(tags)

  const options = {
    allowedTags: tags,
    allowedAttributes: {
      'span': [ 'class', 'contentEditable' ]
    },
    allowedIframeHostnames: ['www.youtube.com']
  }
  //Separate function in case we want to do more processing or use extra features 
  return sanitizeHtml(html, options);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs = JSON.parse(req.body);

  //console.log(inputs.question, inputs.explanation);

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
    const multipleChoiceQuestion: quesdom.multipleChoice = {
      kind: "multipleChoice",
      answerChoices: inputs.choices.map((value) => {
        return sanitize(value.value);
      }),
      correctAnswer: sanitize(inputs.answer),
      question: sanitize(inputs.question),
      tag: inputs.tags.map((value) => {
        return value.value;
      }),
      upvotes: 0,
      downvotes: 0,
      explanation: sanitize(inputs.explanation),
      date: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      author: {
        uid: uid,
        username: userData.username,
        hasProfilePicture: userData.hasProfilePicture,
      },
    };
    await adminDB.collection("questions").add(multipleChoiceQuestion);

    // Convert Inputs to multipleChoice

    return res.status(200).send({
      success: true,
      message: `Question added successfully.`,
    });
  } catch (err) {
    // Return undefined if there is no user. You may also send a different status or handle the error in any way that you wish.
    console.log(err);
    const result = undefined;
    return res.status(200).send({ success: false, message: err });
  }
};

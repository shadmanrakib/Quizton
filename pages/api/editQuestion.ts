import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { Question, EditRequest, multipleChoice } from "../../types/quesdom";
import sanitizeHtml from "sanitize-html";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ELASTIC_URL,
});

//Todo: Question validation

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


export default async function editQuestion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = nookies.get({ req });
  const parsed: EditRequest = JSON.parse(req.body);
  if (!cookies || !cookies["token"]) {
    res.status(200).send({ success: false, message: "No user token" });
  }
  try {
    const fs = firebaseAdmin.firestore();
    const user = await firebaseAdmin.auth().verifyIdToken(cookies["token"]);
    const { uid } = user;
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const userData = userDoc.data();


    //Update will fail if document does not exist
    //Todo: make sure that documnet is updated only with fields found in Question interface (type validation needed)
    //Todo: search index the edited question with new stuff
    const doc = await fs.doc("/questions/" + parsed.qid).get();
    if (doc.exists === false)
      throw { success: false, message: "Document to edit does not exist" };
    const question = doc.data() as Question;
    if (question.author.uid !== user.uid)
      throw { success: false, message: "Author does not match" };
    console.log(parsed.question, parsed.qid);
    if (
      question.kind === "multipleChoice" &&
      parsed.question.kind === "multipleChoice"
    ) {
      const editDate = firebaseAdmin.firestore.FieldValue.serverTimestamp();

      const sanitizedQuestion = sanitize(parsed.question.question);

      var choicesString = "";

      const sanitizedChoices = parsed.question.answerChoices.map((value) => {
        const sanitizedChoice = sanitize(value);
        if (sanitizedChoice) {
          choicesString += " " + sanitizedChoice;
        }
        return sanitizedChoice;
      });
      const sanitizedAnswer = parsed.question.correctAnswer;
      const sanitizedExplanation = sanitize(parsed.question.explanation);
      console.log(sanitizedExplanation);


      const finalTags = parsed.question.tags;
      const question = {
        kind: "multipleChoice",
        answerChoices: sanitizedChoices,
        correctAnswer: parsed.question.correctAnswer,
        question: sanitizedQuestion,
        tags: parsed.question.tags,
        explanation: sanitizedExplanation,
        date: editDate,
        organization: {
          subject: finalTags[0] === undefined ? null : finalTags[0],
          topic: finalTags[1] === undefined ? null : finalTags[1],
          subtopic: finalTags[2] === undefined ? null : finalTags[2],
        },
      };

      const author = {
        uid: uid,
        username: userData.username,
        hasProfilePicture: userData.hasProfilePicture,
      };

      await fs.doc("/questions/" + parsed.qid).update(question);

      await client.update({
        id: parsed.qid,
        index: "index-questions",
        body: {
          kind: "multipleChoice",
          votes: 0,
          tags: parsed.question.tags,
          question: sanitizedQuestion,
          date: new Date().toISOString(),
          author: author,
        },
      });

      res.status(200).send({
        success: true,
        message: "Multiple choice question successfully edited",
      });
    }
    //Todo: short answer edits
  } catch (e) {
    console.log(e);
    res.status(200).send(e);
  }
}

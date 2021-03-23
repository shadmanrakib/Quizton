// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import * as quesdom from "../../types/quesdom";

type Delta = {
  ops: any[];
};
interface Inputs {
  question: Delta;
  explanation: Delta;
  answer: number;
  choices: { value: Delta }[];
  tags: { value: string }[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs: Inputs = JSON.parse(req.body);
  console.log(
    new QuillDeltaToHtmlConverter(inputs.question.ops).convert(),
    new QuillDeltaToHtmlConverter(inputs.explanation.ops).convert()
  );
  if (!parsedCookies["token"])
    return res.status(200).send({ success: false, message: `No User Token` });
  try {
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);
    // the user is authenticated!
    const { uid, email } = token;
    const multipleChoiceQuestion: quesdom.multipleChoice = {
      kind: "multipleChoice",
      answerChoices: inputs.choices.map((value) => {
        return new QuillDeltaToHtmlConverter(value.value.ops).convert();
      }),
      correctAnswer: inputs.answer,
      question: new QuillDeltaToHtmlConverter(inputs.question.ops).convert(),
      tag: inputs.tags.map((value) => {
        return value.value;
      }),
      explanation: new QuillDeltaToHtmlConverter(
        inputs.explanation.ops
      ).convert(),
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
    return res
      .status(200)
      .send({ success: false, message: `Something went wrong` });
  }
};

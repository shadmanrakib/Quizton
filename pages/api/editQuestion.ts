import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import { Question, EditRequest } from "../../types/quesdom";

//Todo: Question validation

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
      await fs.doc("/questions/" + parsed.qid).update({
        ...parsed.question,
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

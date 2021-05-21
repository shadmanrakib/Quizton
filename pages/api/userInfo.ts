import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import * as quesdom from "../../types/quesdom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = JSON.parse(req.body) as quesdom.UserInfoRequest;
  const cookies = parseCookies({ req });
  const fs = firebaseAdmin.firestore();
  const userCollection = fs.collection("/users");
  const quizCollection = fs.collection("/quizzes");

  try {
    const user = await firebaseAdmin.auth().verifyIdToken(cookies["token"]);
    const fbUserData = await firebaseAdmin.auth().getUser(uid);
    const fbClaims = fbUserData.customClaims as quesdom.CustomClaims;
    const userData: quesdom.UserInfoResponse = {
      displayName: fbUserData.displayName,
      photoURL: fbUserData.photoURL,
      username: fbClaims.username,
    };
    res.status(200).send(userData);
  } catch (e) {
    console.log(e);
    res
      .status(200)
      .send({ message: "Failed to get user info", success: false });
  }
};

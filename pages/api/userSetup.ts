import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import type { NextApiRequest, NextApiResponse } from "next";

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
          return false;
      }
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs = JSON.parse(req.body);
  if (!inputs.username)
    return res
      .status(200)
      .send({ success: false, message: `Username required` });
  if (!isAlphaNumeric(inputs.username))
    return res
      .status(200)
      .send({ success: false, message: `Username must be alphanumeric` });
  if (!parsedCookies["token"])
    return res.status(200).send({ success: false, message: `No User Token` });

  try {
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);
    const { uid, email } = token;
    const usersCollection = adminDB.collection("users");

    const uidSnapshot = await usersCollection.doc(uid).get();
    //Possible Error: Check if the user is already registered (aka already has a user document)
    if (uidSnapshot.exists)
      return res
        .status(200)
        .send({ success: false, message: `User document exists` });

    const usernameSnapshot = await usersCollection
      .where("username", "==", inputs.username)
      .get();

    //Possible Error: Check if the username the user wants is already taken
    if (!usernameSnapshot.empty)
      return res
        .status(200)
        .send({ success: false, message: `Username not available` });

    //Success: Create user document and set user's custom claim to reflect registered status
    await usersCollection.doc(uid).set({
      username: inputs.username,
      startDate: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      hasProfilePicture: false,
    });

    await firebaseAdmin.auth().setCustomUserClaims(uid, { registered: true });

    return res.status(200).send({
      success: true,
      message: "Successfully setup user",
    });
  } catch (e) {
    //Catch errors thrown by Firebase
    res.status(200).send({ success: false, message: e.message });
  }
};

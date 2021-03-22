// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin } from "../../config/firebaseAdmin";
const { parseCookies, setCookie, destroyCookie } = require('nookies');


export default async (req, res) => {
  const parsedCookies = parseCookies({ req });

  if (parsedCookies["token"]) {

    try {
      const token = await firebaseAdmin.auth().verifyIdToken(parsedCookies["token"]);

      // the user is authenticated!
      const { uid, email } = token;

      // TODO: Processing

      return res.status(200).send({ success: true, message: `Your email is ${email} and your UID is ${uid}.` });
    } catch (err) {
      // Return undefined if there is no user. You may also send a different status or handle the error in any way that you wish.
      console.log(err);
      const result = undefined;
      return res.status(200).send({ success: false, message: `User Authentication`});
    }

  } else {

    return res.status(200).send({ success: false, message: `No User Token` });

  }

};
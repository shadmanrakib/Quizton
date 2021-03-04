// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin } from "../../config/firebaseAdmin";
const { parseCookies, setCookie, destroyCookie } = require('nookies');


export default async (req, res) => {
  try {
    // Check if there is a token and if not return undefined.
    const parsedCookies = parseCookies({ req });
    const token = await firebaseAdmin.auth().verifyIdToken(parsedCookies["token"]);

    // the user is authenticated!
    const { uid, email } = token;

    return res.status(200).send({message: `Your email is ${email} and your UID is ${uid}.`});
  } catch (err) {
    // Return undefined if there is no user. You may also send a different status or handle the error in any way that you wish.
    console.log(err);
    const result = undefined;
    return res.status(200).send(result);
  }
};
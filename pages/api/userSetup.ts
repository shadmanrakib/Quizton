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
        return res.status(200).send({ success: false, message: `Username required` });
    if (!isAlphaNumeric(inputs.username))
        return res.status(200).send({ success: false, message: `Username must be alphanumeric` });
    if (!parsedCookies["token"])
        return res.status(200).send({ success: false, message: `No User Token` });
    try {
        const token = await firebaseAdmin
            .auth()
            .verifyIdToken(parsedCookies["token"]);

        // the user is authenticated!
        const { uid, email } = token;

        const usersRef = adminDB.collection('users');

        try {
            const uidSnapshot = await usersRef.doc(uid).get();
            console.log(!uidSnapshot.exists) //Check if any docs with uid exist
            if (!uidSnapshot.exists) {
                const usernameSnapshot = await usersRef.where('username', '==', inputs.username).get()
                console.log(usernameSnapshot.empty) //Check if any docs with username exist

                if (usernameSnapshot.empty) {
                    usersRef.doc(uid).set({
                        username: inputs.username,
                        startDate: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
                        hasProfilePicture: false
                    })
                } else {
                    return res.status(200).send({ success: false, message: `Username not available` });
                }
            } else {
                return res.status(200).send({ success: false, message: `User document exists` });
            }
        } catch (error) {
            console.log(error)
        }

        return res.status(200).send({
            success: true,
            message: "Complete user setup",
        });
    } catch (err) {
        return res
            .status(200)
            .send({ success: false, message: err });
    }
};

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies } from "nookies"; //, setCookie, destroyCookie
import type { NextApiRequest, NextApiResponse } from "next";
import sanitizeHtml from "sanitize-html";
import * as quesdom from "../../types/quesdom";
import striptags from "striptags";
import Timestamp from "firebase/firestore/";

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTIC_URL
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
 try {
    const results = await client.search(

    );
    
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

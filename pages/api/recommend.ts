// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from '@elastic/elasticsearch';
import { parseCookies } from "nookies";


const client = new Client({
    node: process.env.ELASTIC_URL
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const cookies = parseCookies({ req });
        const fs = firebaseAdmin.firestore();

        const user = await firebaseAdmin.auth().verifyIdToken(cookies["token"]);

        const recentQuizzesSnapshot = await fs.collection("/users").doc("/" + user.uid).collection("/recentQuizzes").orderBy("timestamp", "desc").limit(1).get();

        var recent = [];

        recentQuizzesSnapshot.forEach((doc) => {
            const {dataArray} = doc.data();

            console.log(dataArray);

            for (let i = dataArray.length - 1; i >= 0 && i > dataArray.length - 5; i--) {
                recent.push(dataArray[i].qid);
            }
        })

        const like = recent.map(id => {
            return { _index: "index-quizzes", _id: id };
        })

        console.log(like);

        if (like.length > 0) {

            const results = await client.search({
                index: "index-quizzes",
                body: {
                    query: {
                        more_like_this: {
                            "fields": ["allQuestions", "allTags", "title"],
                            "like": like,
                            "min_term_freq": 1,
                            "max_query_terms": 12
                        },
                    }
                }
            })

            return res.status(200).send({
                success: true,
                message: { results: results.body.hits}
            });

        } else {
            return res.status(200).send({
                success: false,
                message: "User has not done any quizzes yet"
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(200).send({ success: false, message: err });
    }
};

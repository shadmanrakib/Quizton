// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";


import { Client } from '@elastic/elasticsearch';

const client = new Client({
    node: process.env.ELASTIC_URL
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const inputs = JSON.parse(req.body);
        var index;
        var searchBody;

        const offsetBy = inputs.offsetBy ? inputs.offsetBy : 0;

        if (inputs.type === "question") {
            index = "index-questions";
            searchBody = {
                query: {
                    multi_match: {
                        "query": inputs.query,
                        "fields": ["question", "tags"],
                        "type": "most_fields",
                        "fuzziness": "AUTO"
                    }
                },
                //from: offsetBy
            }
        }
        if (inputs.type === "quiz") {
            index = "index-quizzes";
            searchBody = {
                query: {
                    multi_match: {
                        "query": inputs.query,
                        "fields": ["allQuestions", "allTags^3", "title^6"],
                        "type": "most_fields",
                        "fuzziness": "AUTO"
                    }
                },
                from: offsetBy
            }
        }

        const results = await client.search({
            index: index,
            body: searchBody
        })

        return res.status(200).send({
            success: true,
            message: {results: results.body.hits}
        });
    } catch (err) {
        console.log(err);
        return res.status(200).send({ success: false, message: err });
    }
};

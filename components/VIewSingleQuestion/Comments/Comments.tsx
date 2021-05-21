import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { db, auth } from "../../../config/firebaseClient";
import { useUser } from "../../../hooks/useUser";
import * as quesdom from "../../../types/quesdom";
import Button from "../../UI/Button/Button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";


interface CommentsProps {
    qid: string;
}

const getComments = async (qid: string) => {
    const data = await db.collection('questions').doc(qid).collection("comments").orderBy('timestamp', 'desc').get();
    return data;
}

const Comments: React.FC<CommentsProps> = ({ qid }) => {
    
    const [commentsList, setCommentsList] = useState<quesdom.Comment[]>([]);

    const updateComments = async () => {
        setCommentsList([]);
        const snapshot = await getComments(qid);
        let tmp: quesdom.Comment[] = [];
        snapshot.forEach(doc => {
            let data: quesdom.Comment = doc.data() as quesdom.Comment;
            data.docId = doc.id;
            tmp.push(data);
        })
        setCommentsList(tmp);
    }


    useEffect(() => {
        updateComments();
    }, []);

    // useEffect(() => {
    //     console.log(commentsList);
    // }, [commentsList])

    // const onSubmit = async (data) => {
    //     data.qid = qid;

    //     const response = await fetch("/api/createComment", {
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         mode: "no-cors", // no-cors, *cors, same-origin
    //         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: "include", // include, *same-origin, omit
    //         headers: {
    //             "Content-Type": "application/json",
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         redirect: "follow", // manual, *follow, error
    //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify(data), // body data type must match "Content-Type" header
    //     });

    //     // return response.json(); // parses JSON response into native JavaScript objects

    //     reset();
    //     updateComments();
    // }

    return (
        <div className="max-w-6xl my-3 p-6 mx-auto bg-white rounded-md border border-gray-300 mb-96">
            <p>{commentsList && commentsList.length} Comments</p>
            <div className="w-full">
                <div className="">
                    <CommentInput type="base" qid={ qid } updateComments={updateComments} />
                    <div>
                        {commentsList && commentsList.map((comment, idx) => {
                            return <div key={idx}>
                                <Comment parent={ comment } qid={ qid }/>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comments;
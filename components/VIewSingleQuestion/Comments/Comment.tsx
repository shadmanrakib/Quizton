import { useEffect, useState } from "react";

import { useUser } from "../../../hooks/useUser";
import { db } from "../../../config/firebaseClient";
import CommentInput from "./CommentInput";
import * as quesdom from "../../../types/quesdom";


interface CommentProps {
    qid: string;
    parent: quesdom.Comment;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Comment: React.FC<CommentProps> = ({ parent, qid }) => {
    const time = parent.timestamp.toDate();
    const month: string = monthNames[time.getMonth()];
    const day: number = time.getDay();
    const year: number = time.getFullYear();

    const [showReplies, setShowReplies] = useState(false);
    const [hasOpenedReplies, setHasOpenedReplies] = useState(false);
    const [replies, setReplies] = useState<quesdom.Reply[] | null>(null);
    const [replying, setReplying] = useState(false);

    const getReplies = async () => {
        return await db
            .collection("questions")
            .doc(qid)
            .collection("comments")
            .doc(parent.docId)
            .collection("replies")
            .orderBy('timestamp', 'desc')
            .get();
    }

    const updateReplies = async () => {
        const repliesSnapshot = await getReplies();
        let tmp: quesdom.Reply[] = [];
        repliesSnapshot.forEach(doc => {
            let data = doc.data();
            data.parentComment = parent.docId;
            tmp.push(data as quesdom.Reply);
        });
        setReplies(tmp);
    }

    useEffect(() => {
        if (hasOpenedReplies) {
            updateReplies();
        }
    }, [hasOpenedReplies])

    const handleReplyClick = () => {
        if (!hasOpenedReplies) {
            setHasOpenedReplies(true);
        }
        setShowReplies(!showReplies);
    }

    return (
        <div className="my-6">
            <div> <span className="font-semibold">{parent.username}</span> | <span className="text-sm font-gray"> {`${month} ${day}, ${year}`} </span></div>
            {parent.comment}
            <div>
                <p className="font-bold text-blue-500 inline-block cursor-pointer" onClick={() => { setReplying(!replying) }}>Reply</p>
            </div>
            { replying && <CommentInput type="reply" parentCommentId={parent.docId} qid={qid} updateComments={updateReplies} />}
            { <p className="text-gray-500 cursor-pointer" onClick={handleReplyClick}>{showReplies ? "Hide Replies" : "Show Replies"}</p>}
            { replies && showReplies && replies.map((reply, idx) => {
                const time = reply.timestamp.toDate();
                const month: string = monthNames[time.getMonth()];
                const day: number = time.getDay();
                const year: number = time.getFullYear();
                return (<div className="my-3 ml-10">
                    <div> <span className="font-semibold">{reply.username}</span> | <span className="text-sm font-gray"> {`${month} ${day}, ${year}`} </span></div>
                    { reply.comment }
                </div>)
            })}
        </div>
    );
}

export default Comment;
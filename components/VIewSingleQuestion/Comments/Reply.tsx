import { useEffect, useState } from "react";

import { useUser } from "../../../hooks/useUser";
import { db } from "../../../config/firebaseClient";
import CommentInput from "./CommentInput";
import * as quesdom from "../../../types/quesdom";


interface CommentProps {
    qid: string;
    parent?: quesdom.Comment;
    comment: quesdom.Comment;
    replyingTo?: string;
    isReply: boolean;
    updateReplies: () => void;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Comment: React.FC<CommentProps> = ({ parent, comment, qid, updateReplies }) => {
    const time = comment.timestamp.toDate();
    const month: string = monthNames[time.getMonth()];
    const day: number = time.getDay();
    const year: number = time.getFullYear();

    const [replying, setReplying] = useState(false);

    return (
        <div className="my-6">
            <div> <span className="font-semibold">{comment.username}</span> | <span className="text-sm font-gray"> {`${month} ${day}, ${year}`} </span></div>
            {comment.comment}
            <div>
                <p className="font-bold text-blue-500 inline-block cursor-pointer" onClick={() => { setReplying(!replying) }}>Reply</p>
            </div>
            { replying && <CommentInput type="reply" parentCommentId={parent.docId} qid={qid} updateComments={updateReplies} replyingTo={comment.username} />}
        </div>
    );
}

export default Comment;
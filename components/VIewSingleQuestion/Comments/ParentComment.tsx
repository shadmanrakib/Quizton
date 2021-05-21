import { useEffect, useState } from "react";

import { useUser } from "../../../hooks/useUser";
import { db } from "../../../config/firebaseClient";
import CommentInput from "./CommentInput";
import Reply from "./Reply";
import * as quesdom from "../../../types/quesdom";


interface CommentProps {
    qid: string;
    // parent?: quesdom.Comment;
    comment: quesdom.Comment;
    replyingTo?: string;
    isReply: boolean;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ParentComment: React.FC<CommentProps> = ({ comment, qid, isReply }) => {
    const time = comment.timestamp.toDate();
    const month: string = monthNames[time.getMonth()];
    const day: number = time.getDate();
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
            .doc(comment.docId)
            .collection("replies")
            .orderBy('timestamp')
            .get();
    }

    const updateReplies = async () => {
        const repliesSnapshot = await getReplies();
        let tmp: quesdom.Reply[] = [];
        repliesSnapshot.forEach(doc => {
            let data = doc.data();
            data.parentComment = comment.docId;
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
            <div> <span className="font-semibold">{comment.username}</span> | <span className="text-sm font-gray"> {`${month} ${day}, ${year}`} </span></div>
            {comment.comment}
            <div>
                <p className="font-bold text-blue-500 inline-block cursor-pointer" onClick={() => { setReplying(!replying) }}>Reply</p>
            </div>
            { replying && <CommentInput type="reply" parentCommentId={comment.docId} qid={qid} updateComments={updateReplies} replyingTo={comment.username} />}
            { !isReply && <p className="text-gray-500 cursor-pointer" onClick={handleReplyClick}>{showReplies ? "Hide Replies" : "Show Replies"}</p>}
            { replies && showReplies && replies.map((reply, idx) => {
                return <div className="ml-10">
                    <Reply parent={comment} comment={reply} qid={qid} replyingTo={reply.username} isReply={true} updateReplies={() => { updateReplies() }} />
                </div>
            })}
        </div>
    );
}

export default ParentComment;
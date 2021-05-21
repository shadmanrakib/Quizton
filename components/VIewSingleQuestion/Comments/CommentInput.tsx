import { useState } from "react";
import { useForm } from "react-hook-form";

interface CommentInputProps {
    type: "reply" | "base";
    parentCommentId?: string;
    qid: string;
    updateComments: () => void;
    replyingTo?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({ type, parentCommentId, qid, updateComments, replyingTo }) => {

    const { register, handleSubmit, reset } = useForm();
    const [ submitDisabled, setSubmitDisabled ] = useState(false);

    const onSubmit = async (data) => {

        data.qid = qid;

        let endpoint = "/api/createComment";
        if (type === "reply" && parentCommentId) {
            endpoint = "/api/createReply";
            data.parentComment = parentCommentId;
        }


        const response = await fetch(endpoint, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "no-cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });

        // return response.json(); // parses JSON response into native JavaScript objects

        reset();
        setSubmitDisabled(true);
        await setTimeout(() => {
            setSubmitDisabled(false);
        }, 1000);
        updateComments();
    }

    return (
        <form className="flex justify-between" onSubmit={handleSubmit(onSubmit)}>
            <input
                type="text"
                id="comment"
                className="w-5/6 my-3 border-b-2 border-gray outline-none focus:border-blue-500"
                autoComplete="off"
                placeholder="Add a comment or explanation..."
                defaultValue={`${replyingTo ? `+${replyingTo} \t` : ""}`}
                {...register("comment")}
            ></input>
            <button
                className={`px-3 py-1.5 rounded-md bg-blue-500 text-white outline-none ${submitDisabled && "cursor-not-allowed opacity-50"}`}
                type="submit"
                disabled={ submitDisabled }
            >
                { type==="base" ? "Comment" : "Reply" }
            </button>
        </form>
    )
}

export default CommentInput;
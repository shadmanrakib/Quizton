import React, { useEffect } from "react";
import * as quesdom from "../types/quesdom";
import "katex/dist/katex.min.css";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useRef } from "react";
import { db, auth } from "../config/firebaseClient";
import { useUser } from "../hooks/useUser";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

interface QuestionComponentProps {
  onSubmit?: (any) => any;
  data: quesdom.multipleChoice;
  qid: string;
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
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
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getUserVoteKind(
  props: QuestionComponentProps
): Promise<"upvote" | "downvote" | "none" | null> {
  const user = auth.currentUser;
  if (!auth.currentUser) {
    return null;
  }
  const voteCollection = db.collection("/votes");
  const voteDocs = await voteCollection
    .where("qid", "==", props.qid)
    .where("uid", "==", user.uid)
    .get();
  console.log(voteDocs);
  if (voteDocs.empty) {
    return "none";
  }
  return (voteDocs.docs[0].data() as quesdom.voteDocument).kind;
}

const Question = (props: QuestionComponentProps) => {
  const user = useUser();
  const [vote, setVote] = useState<null | "upvote" | "downvote" | "none">(null);
  const { register, handleSubmit, errors, control } = useForm();
  const [voteCount, setVoteCount] = useState(
    props.data.upvotes - props.data.downvotes
  );
  useEffect(() => {
    let stillMounted = true;
    getUserVoteKind(props).then((kind) => {
      if (stillMounted) setVote(kind);
    });
    return () => {
      stillMounted = false;
    };
  }, [user]);

  function onUpvote() {
    console.log(vote);
    if (vote === null) return; //since firebase vote document didn't load in yet
    if (vote === "none") {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      setVote("upvote");
    }
    if (vote === "upvote") {
      const data: quesdom.voteRequest = { kind: "unvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 1);
      setVote("none");
    }
    if (vote === "downvote") {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 2);
      setVote("upvote");
    }
  }
  function onDownvote() {
    if (vote === null) return; //since firebase vote document didn't load in yet
    if (vote === "none") {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 1);
      setVote("downvote");
    }
    if (vote === "downvote") {
      const data: quesdom.voteRequest = { kind: "unvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      setVote("none");
    }
    if (vote === "upvote") {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount - 2);
      setVote("downvote");
    }
  }
  return (
    <div>
      <div className="flex flex-row rounded-md container mx-auto">
        <div className="flex flex-col w-6 bg-gray-100 flex-wrap content-center justify-center self-start">
          <ArrowUpwardIcon
            onClick={() => onUpvote()}
            className={`${
              vote === "upvote" ? "text-green-500" : ""
            } hover:text-green-500 hover:bg-gray-200`}
          />
          <p className="text-center">{voteCount}</p>
          <ArrowDownwardIcon
            onClick={() => onDownvote()}
            className={`${
              vote === "downvote" ? "text-red-500" : ""
            } hover:text-red-500 hover:bg-gray-200`}
          />
        </div>
        {/* Question Section */}
        <div className="ml-3">
          <div className="my-3">
            Tags:
            {props.data.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-2 m-2 border rounded-md bg-light-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            Question:
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: props.data.question }}
            ></div>
          </div>
          <form className="my-3" onSubmit={handleSubmit(props.onSubmit)}>
            {props.data.answerChoices.map((choice, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={"choice" + index}
                  name="answer"
                  ref={register}
                  value={index}
                ></input>
                <label
                  htmlFor={"choice" + index}
                  dangerouslySetInnerHTML={{ __html: choice }}
                  className="inline-block text-md ml-3"
                ></label>
              </div>
            ))}
            <button className="my-3 p-3 bg-primary text-white" type="submit">
              Check Answer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Question;

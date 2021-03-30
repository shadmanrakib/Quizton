import React from "react";
import * as quesdom from "../types/quesdom";
import "katex/dist/katex.min.css";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useRef } from "react";

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

interface VotedAlready { 
  upvote: boolean;
  downvote: boolean;
}

const Question = (props: QuestionComponentProps) => {
  const { register, handleSubmit, errors, control } = useForm();
  const [voteCount, setVoteCount] = useState(
    props.data.upvotes - props.data.downvotes
  );
  const votedAlready = useRef({upvote: false, downvote: false} as VotedAlready);

  function onUpvote() {
    if (!votedAlready.current.upvote) {
      const data: quesdom.voteRequest = { kind: "upvote", qid: props.qid };
      postData("/api/userVote", data).then((s) => console.log(s));
      setVoteCount(voteCount + 1);
      votedAlready.current.upvote = true;
      votedAlready.current.downvote = false;
    }
  }
  function onDownvote() {
    if (!votedAlready.current.downvote) {
      const data: quesdom.voteRequest = { kind: "downvote", qid: props.qid };
      postData("/api/userVote", data);
      setVoteCount(voteCount - 1);
      votedAlready.current.downvote = true;
      votedAlready.current.upvote = false;
    }
  }
  return (
    <div>
      <div>{voteCount}</div>
      <button onClick={() => onUpvote()}>Upvote</button>
      <button onClick={() => onDownvote()}>Downvote</button>
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
            ></label>
          </div>
        ))}
        <button className="my-3 p-3 bg-primary text-white" type="submit">
          Check Answer
        </button>
      </form>
    </div>
  );
};

export default Question;

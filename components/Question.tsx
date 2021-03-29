import React from "react";
import * as quesdom from "../types/quesdom";
import "katex/dist/katex.min.css";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";

interface QuestionComponentProps {
  onSubmit?: (any) => any;
  data: quesdom.multipleChoice;
  qid: string;
}

const Question = (props: QuestionComponentProps) => {
  const { register, handleSubmit, errors, control } = useForm();
  const [voteCount, setVoteCount] = useState(
    props.data.upvote - props.data.downvote
  );

  return (
    <div>
      <div>{voteCount}</div>
      <button onClick={() => setVoteCount(voteCount + 1)}>Upvote</button>
      <button onClick={() => setVoteCount(voteCount - 1)}>Downvote</button>
      <div className="my-3">
        Tags:
        {props.data.tag.map((tag, index) => (
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
      <form className="my-3" onSubmit={handleSubmit(onSubmit)}>
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

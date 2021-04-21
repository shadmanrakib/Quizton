import React, { useEffect } from "react";
import * as quesdom from "../types/quesdom";
import "katex/dist/katex.min.css";
import { useForm, useFieldArray, useFormState } from "react-hook-form";
import { useState, useRef } from "react";
import { db, auth } from "../config/firebaseClient";
import { useUser } from "../hooks/useUser";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

interface QuestionComponentProps {
  onSubmit?: (any) => void;
  data: quesdom.multipleChoice;
  qid: string;
  onEditButtonClicked: () => void;
}

async function postData(url = "", data = {}) {
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

const Question = (props: QuestionComponentProps) => {
  const user = useUser();
  const [vote, setVote] = useState<null | "upvote" | "downvote" | "none">(null);
  const { register, handleSubmit, control } = useForm();
  const { errors } = useFormState({ control });
  const [voteCount, setVoteCount] = useState(
    props.data.upvotes - props.data.downvotes
  );

  return (
    <div className="bg-cool-gray-100">
      <div className="flex max-w-6xl my-3 p-6 mx-auto bg-white rounded-md border border-gray-300">
        <div className="">
          <div>
            <div
              className="my-6 font-serif md:text-lg"
              dangerouslySetInnerHTML={{ __html: props.data.question }}
            ></div>
          </div>
          <form onSubmit={handleSubmit(props.onSubmit)}>
            {props.data.answerChoices.map((choice, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={"choice" + index}
                  {...register("answer")}
                  value={index}
                ></input>
                <label
                  htmlFor={"choice" + index}
                  dangerouslySetInnerHTML={{ __html: choice }}
                  className="inline-block ml-3 text-lg font-light"
                ></label>
              </div>
            ))}
            <div className="flex items-center">
              <button
                className="my-6 px-3 py-1.5 rounded-md bg-blue-500 text-white"
                type="submit"
              >
                Check
              </button>
              <p className="underline ml-5 cursor-pointer">Show answer</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Question;

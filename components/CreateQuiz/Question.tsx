import { OutlinedInput } from "@material-ui/core";
import React from "react";
import { MultipleChoiceRequest } from "../../types/quesdom";

interface props {
  question: MultipleChoiceRequest;
  onEdit: () => void;
}

function Question(props: props) {
  return (
    <div className="flex max-w-6xl my-4 p-6 mx-auto bg-white rounded-md border border-gray-300">
      <div className="">
        <div>
          <div
            className="my-6 font-serif md:text-lg"
            dangerouslySetInnerHTML={{ __html: props.question.question }}
          ></div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.onEdit();
          }}
        >
          {props.question.answerChoices.map((choice, index) => (
            <div key={index}>
              <input
                type="radio"
                id={"choice" + index}
                name="answer"
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
              className="my-6 px-3 py-1.5 rounded-md bg-pink-800 text-white"
              type="submit"
            >
              Edit
            </button>
            <p className="underline ml-5 cursor-pointer">Show answer</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Question;

import { OutlinedInput } from "@material-ui/core";
import React from "react";
import { MultipleChoiceRequest } from "../../types/quesdom";

interface props {
  question: MultipleChoiceRequest;
  onEdit?: () => void;
}

function Question(props: props) {
  return (
    <div className="flex w-auto my-4 mx-auto">
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
                className={"inline-block ml-3 text-lg" + (index === props.question.correctAnswer ? " font-bold" : "")}
              ></label>
              {index === props.question.correctAnswer && <span className="text-green-600"> {" "} (Correct Answer)</span>}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default Question;

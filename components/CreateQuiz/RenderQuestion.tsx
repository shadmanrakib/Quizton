import React from "react";

export default function RenderQuestion({ field, index }) {
  function choicesFilled() {
    field.answerChoices.forEach((choice) => {
      if (choice.value == "") {
        return false;
      }
    });
    return true;
  }

  return (
    <React.Fragment>
      <div>
        {field.question != "" && choicesFilled() ? (
          <div
            className="my-6 font-serif md:text-lg"
            dangerouslySetInnerHTML={{ __html: field.question }}
          ></div>
        ) : (
          <div className="my-6 font-serif md:text-lg">Incomplete! Please click here and fill all fields.</div>
        )}
      </div>
      {field.question != "" && choicesFilled() && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {field.answerChoices.map((choice, index) => (
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
                className={
                  "inline-block ml-3 text-lg" +
                  (index === field.correctAnswer ? " font-bold" : "")
                }
              ></label>
              {index === field.correctAnswer && (
                <span className="text-green-600"> (Correct Answer)</span>
              )}
            </div>
          ))}
        </form>
      )}
    </React.Fragment>
  );
}

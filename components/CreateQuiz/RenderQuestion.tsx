import React, { useMemo } from "react";
import striptags from "striptags";

function RenderQuestion({ question, choices, answer }) {

  return (
    <div>
      {/* Ask how to check if question is completed. */}
      {striptags(question) != "" ? (
        <>
          <div
            className="my-6 font-serif md:text-lg"
            dangerouslySetInnerHTML={{ __html: question }}
          ></div>
          <div>
            {choices.map((choice, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={"choice" + index}
                  name="answer"
                  value={index}
                ></input>
                <label
                  htmlFor={"choice" + index}
                  dangerouslySetInnerHTML={{ __html: choice.value }}
                  className={
                    "inline-block ml-3 text-lg" +
                    (index == answer ? "" : " text-gray-500")
                  }
                ></label>
                {index == answer && (
                  <span className="text-green-600"> (Answer)</span>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="my-6 font-serif md:text-lg">Incomplete!</div>
      )}
    </div>
  );
}

export default React.memo(RenderQuestion);
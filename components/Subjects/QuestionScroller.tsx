import { QueryDocumentSnapshot } from "@firebase/firestore-types";
import React, { useState } from "react";
import { Question } from "../../types/quesdom";
import QuestionMini from "./QuestionMini";
interface props {
  questions: QueryDocumentSnapshot<Question>[];
  questionClicked: (index: number) => void;
}
function QuestionScroller({ questions, questionClicked }: props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  return (
    <div>
      {questions.map((value, index) => {
        const question = value.data();
        if (question.kind === "multipleChoice") {
          return (
            <div
              onClick={() => {
                questionClicked(index);
                setActiveIndex(index);
              }}
            >
              <QuestionMini
                qid={value.id}
                val={question}
                key={value.id}
                active={index === activeIndex}
              ></QuestionMini>
            </div>
          );
        }
      })}
    </div>
  );
}

export default QuestionScroller;

import React from "react";
import Link from "next/link";
import { Chip } from "@material-ui/core";

const QuestionCard = ({question}) => {
  return (
    <div key={question.id} className="bg-white p-6 border">
      {question.tags.map((tag) => (
        <Chip label={tag} />
      ))}
      <div className="h-16 mt-6 overflow-hidden relative">
        <div className="bg-gradient-to-t from-white to-transparent h-full w-full absolute top-0"></div>
        <div
          dangerouslySetInnerHTML={{
            __html: question.question,
          }}
        ></div>
      </div>

      <Link href={`/question/${question.qid}`}>
        <button className="bg-light-blue-500 px-3 py-2 text-white rounded-md">
          View
        </button>
      </Link>
    </div>
  );
};

export default QuestionCard;

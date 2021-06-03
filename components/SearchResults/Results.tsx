import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "katex/dist/katex.min.css";
import QuestionCard from "./QuestionCard";
import QuizCard from "./QuizCard";
import postData from "../../utility/postData";
import { AddRecentRequest } from "../../types/quesdom";

interface ElasticHits {
  _id: string;
  _type: string;
  _index: string;
  _score: number;
  _source: any[];
}

interface ElasticResults {
  total: { value: number; relation: string };
  max_score: number | null;
  hits: ElasticHits[];
}

const Results = () => {
  const router = useRouter();
  const { q, type } = router.query;
  const [searchResult, setSearchResult] = useState<ElasticResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (q !== "" && q !== undefined && q) {
      const t = type && type != "" ? type : "quiz";
      postData("/api/search", { query: q, type: t }).then((response) => {
        setSearchResult(response.message.results);
        console.log(response);
      });
      postData("/api/addRecent", {
        qid: q,
        kind: "search",
      } as AddRecentRequest);
    }
    console.log(searchResult);
    setLoading(false);
  }, [q]);

  if (!q) return null;

  return (
    <div className="p-4 w-auto max-w-6xl">
      {loading ? (
        <div>{"Loading..."}</div>
      ) : (
        <div className="">
          {(type === "question") &&
            searchResult &&
            searchResult.hits &&
            searchResult.hits.map((question) => (
              <QuestionCard key={question._id} id={question._id} question={question._source} />
            
          ))
          }
          {type === "quiz" &&
            searchResult &&
            searchResult.hits &&
            searchResult.hits.map((quiz) => (
              <QuizCard key={quiz._id} id={quiz._id} quiz={quiz._source} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Results;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "katex/dist/katex.min.css";
import QuestionCard from "./QuestionCard";
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
  const { q } = router.query;
  const [searchResult, setSearchResult] = useState<ElasticResults | null>(null);
  const [searchTotal, setSearchTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q !== "" && q !== undefined && q) {
      postData("/api/search", { query: q, type: "questions" }).then(
        (response) => {
          setSearchResult(response.message.results);
        }
      );
      postData("/api/addRecent", {
        qid: q,
        kind: "search",
      } as AddRecentRequest);
    }
  }, [q]);

  if (!q) return null;

  return (
    <div className="p-4 w-auto max-w-6xl">
      {loading ? (
        <div>{"Loading..."}</div>
      ) : (
        <div className="">
          {searchResult &&
            searchResult.hits.map((question) => (
              <QuestionCard key={question._id} question={question._source} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Results;

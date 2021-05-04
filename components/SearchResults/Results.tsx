import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "katex/dist/katex.min.css";
import QuestionCard from "./QuestionCard";

async function postData(url = "", data = {}) {
  // Default options are marked with *
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

interface ElasticResults {
  total: { value: number; relation: string };
  max_score: number | null;
  hits: object[];
}

const Results = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchResult, setSearchResult] = useState<ElasticResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      postData("/api/search", { query: q, type: "questions" }).then(
        (response) => {
          setSearchResult(response.message.results);
        }
      );
    }
  }, [q]);

  if (!q) return null;

  return (
    <div className="p-4 w-auto max-w-6xl">
      {loading ? (
        <div>{"Loading..."}</div>
      ) : (
        <div className="">
          {JSON.stringify(searchResult.hits)}
        </div>
      )}
    </div>
  );
};

export default Results;

import React, { useState, useEffect } from "react";
import Dropdown from "../SearchResults/Dropdown";
import { useForm } from "react-hook-form";
import { db } from "../../config/firebaseClient";
import { useRouter } from "next/router";
import stemmer from "lancaster-stemmer";
import "katex/dist/katex.min.css";
import QuestionCard from "./QuestionCard";

const stopwords: Set<string> = new Set([
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
]);

function extractKeyTokens(string) {
  var words = string
    .toLowerCase()
    .replace(/[.,&'?:;#@*\/!]/g, "")
    .replace(/[()\-"{}\[\]]/g, " ")
    .split(/\s/);
  var freqMap = {};
  var contains = {};
  words.forEach((w) => {
    if (w != "" && !stopwords.has(w)) {
      const processedWord = stemmer(w);
      if (!freqMap[processedWord]) {
        contains[processedWord] = true;
      }
    }
  });
  return Object.keys(contains);
}

const Results = () => {
  const router = useRouter();
  const { search } = router.query;
  const [kind, setKind] = useState<"votes" | "relevance">("relevance");
  const [resultArray, setResultsArray] = useState([]);
  const [resultDict, setResultsDict] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search) {
      const keywords = extractKeyTokens(search);
      let reference = db.collection("questions");
      const docsArray = [];
      const docsDict = {};

      if (keywords.length > 0) {
        setLoading(true);

        keywords.forEach((element) => {
          // @ts-ignore
          reference = reference.where(`index.${element}`, "!=", 0);
        });

        reference.get().then((snapshot) => {
          if (snapshot.empty) {
            setResultsArray([]);
            setResultsDict({});
            setLoading(false);
            console.log("No matching documents.");
            console.log(docsDict);
            console.log(docsArray);
          } else {
            snapshot.forEach((doc) => {
              docsArray.push({ qid: doc.id, ...doc.data() });
              docsDict[doc.id] = doc.data();
            });

            setResultsArray(
              docsArray.sort(function (a, b) {
                return b.votes - a.votes;
              })
            );
            setResultsDict(docsDict);
            setLoading(false);
            console.log(docsDict);
            console.log(docsArray);
          }
        });
      } else {
        setResultsArray([]);
        setResultsDict({});
        setLoading(false);
        console.log(docsDict);
        console.log(docsArray);
      }
    }
  }, [search]);

  if (!search) return null;
  return (
    <div className="p-4 w-auto max-w-6xl">
      {loading ? (
        <div>{"Loading..."}</div>
      ) : (
        <div className="">
          <div className="flex items-center w-auto justify-between flex-wrap">
            <div className="flex-none">{`${resultArray.length} result(s)`}</div>
            <div className="flex-none">
              <Dropdown
                onChange={(kind) => {
                  setKind(kind);
                }}
              ></Dropdown>
            </div>
          </div>
          <div className="mt-2 result-cards">
            {resultArray.length > 0
              ? resultArray.map((question) => (
                  <QuestionCard question={question} />
                ))
              : "No results"}
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default Results;

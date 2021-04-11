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
  const [isVotesSorted, setIsVotesSorted] = useState(false);
  const [isRelevanceSorted, setIsRelevanceSorted] = useState(false);
  const [votesSorted, setVotesSorted] = useState([]);
  const [relevanceSorted, setRelevanceSorted] = useState([]);
  const [resultsDict, setResultsDict] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search) {
      const keywords = extractKeyTokens(search);
      let reference = db.collection("questions");
      const docsArray = [];
      const docsDict = {};

      setIsVotesSorted(false);
      setIsRelevanceSorted(false);

      if (keywords.length > 0) {
        setLoading(true);

        keywords.forEach((element) => {
          // @ts-ignore
          reference = reference.where(`index.${element}`, "!=", 0);
        });

        reference.get().then((snapshot) => {
          if (snapshot.empty) {
            setVotesSorted([]);
            setRelevanceSorted([]);
            setResultsDict({});
            setLoading(false);
            console.log("No matching documents.");
            console.log(docsDict);
            console.log(docsArray);
          } else {
            snapshot.forEach((doc) => {
              const data = doc.data();
              var score = 0;
              keywords.forEach((word) => {
                if (data.index[word]) {
                  score += Math.abs(data.index[word]) / data.totalWords;
                }
              });
              docsDict[doc.id] = { qid:doc.id, score: score, ...data };
            });

            setResultsDict(docsDict);
            setVotesSorted(
              Object.keys(docsDict).sort((a, b) => {
                return docsDict[b].votes - docsDict[a].votes;
              })
            );
            setRelevanceSorted(
              Object.keys(docsDict).sort((a, b) => {
                return docsDict[b].score - docsDict[a].score;
              })
            );
            setLoading(false);

            console.log(votesSorted);
            console.log(relevanceSorted);
          }
        });
      } else {
        setVotesSorted([]);
        setRelevanceSorted([]);
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
            <div className="flex-none">{`${
              Object.keys(resultsDict).length
            } result(s)`}</div>
            <div className="flex-none">
              <Dropdown
                onChange={(kind) => {
                  setKind(kind);
                }}
              ></Dropdown>
            </div>
          </div>
          {kind === "relevance" ? (
            <div className="mt-2 result-cards">
              {relevanceSorted.length > 0
                ? relevanceSorted.map((qid) => (
                    <QuestionCard key={qid} question={resultsDict[qid]} />
                  ))
                : "No results"}
            </div>
          ) : (
            <div className="mt-2 result-cards">
              {votesSorted.length > 0
                ? votesSorted.map((qid) => (
                    <QuestionCard  key={qid} question={resultsDict[qid]} />
                  ))
                : "No results"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;

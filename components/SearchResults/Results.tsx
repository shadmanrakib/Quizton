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
    .replace(/[.,&'?()\/!]/g, "")
    .replace(/[\-]/g, " ")
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
  const [resultArray, setResultsArray] = useState([
    {
        "qid": "TTLMi0Hhs3orZwqq173b",
        "downvotes": 0,
        "tags": [
            "Hmm"
        ],
        "answerChoices": [
            "<p>Apples</p>",
            "<p>Bananas</p>"
        ],
        "question": "<p>The warm light scorched my skin.</p>",
        "contains": {
            "swoon": true,
            "unstress": true,
            "wel": true,
            "deficy": true,
            "light": true,
            "tend": true,
            "soft": true,
            "parch": true,
            "lit": true,
            "uncloud": true,
            "than": true,
            "wanton": true,
            "lightsom": true,
            "incandesc": true,
            "airy": true,
            "loo": true,
            "fluoresc": true,
            "slut": true,
            "clo": true,
            "nigh": true,
            "sick": true,
            "powdery": true,
            "destroy": true,
            "liv": true,
            "skin": true,
            "col": true,
            "lamplit": true,
            "near": true,
            "up": true,
            "shallow": true,
            "unimport": true,
            "den": true,
            "unacc": true,
            "livid": true,
            "cle": true,
            "fatless": true,
            "illumin": true,
            "lov": true,
            "temp": true,
            "sunlit": true,
            "pastel": true,
            "bioluminesc": true,
            "floodlit": true,
            "fre": true,
            "foot": true,
            "undemand": true,
            "red": true,
            "strong": true,
            "duty": true,
            "candesc": true,
            "abstemy": true,
            "whit": true,
            "promiscu": true,
            "cord": true,
            "enthusiast": true,
            "fool": true,
            "fond": true,
            "warm": true,
            "easy": true,
            "frivol": true,
            "low": true,
            "autofluoresc": true,
            "floodlight": true,
            "arm": true,
            "digest": true,
            "trip": true,
            "sunbak": true,
            "fat": true,
            "sunstruck": true,
            "head": true,
            "buoy": true,
            "floaty": true,
            "unchast": true,
            "thin": true,
            "fresh": true,
            "lovesom": true,
            "excit": true,
            "idl": true,
            "pur": true,
            "pal": true,
            "quick": true,
            "uncomfort": true,
            "weak": true,
            "cas": true,
            "lighthead": true,
            "cal": true,
            "clear": true,
            "ablaz": true,
            "hmm": true,
            "gentl": true,
            "affect": true,
            "dry": true,
            "hot": true,
            "insign": true,
            "bright": true,
            "adust": true,
            "inflam": true,
            "ard": true,
            "cand": true,
            "luminesc": true,
            "scorch": true,
            "tepid": true,
            "nonf": true,
            "hearty": true,
            "air": true,
            "lightweight": true,
            "insufficy": true,
            "il": true,
            "scant": true,
            "phosphoresc": true,
            "faint": true,
            "bak": true,
            "short": true,
            "wak": true,
            "lukewarm": true
        },
        "author": {
            "username": "apples",
            "uid": "QsRkY26lEoVcAazCW5MF4SmRyuz1",
            "hasProfilePicture": false
        },
        "freq": {
            "skin": 1,
            "light": 1,
            "warm": 1,
            "scorch": 1
        },
        "totalWords": 4,
        "correctAnswer": "0",
        "upvotes": 0,
        "explanation": "<p>Testing. 1. 2. 3.</p>",
        "kind": "multipleChoice",
        "votes": 0,
        "date": {
            "seconds": 1617572301,
            "nanoseconds": 328000000
        }
    }
]);
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
          reference = reference.where(`contains.${element}`, "==", true);
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
  }, [search]); //search

  return (
    <div className="max-w-4xl p-6">
      {search && (
        <>
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
              <div className="py-6 result-cards">
                {resultArray.length > 0
                  ? resultArray.map((question) => (
                      <QuestionCard question={question}/>
                    ))
                  : "No results"}
              </div>
            </div>
          )}{" "}
        </>
      )}
    </div>
  );
};

export default Results;

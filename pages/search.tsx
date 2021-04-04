import { useForm } from "react-hook-form";
import { db } from "../config/firebaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import stemmer from "lancaster-stemmer";
import "katex/dist/katex.min.css";
import Link from "next/link";

interface SearchQuery {
  query: string;
}

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
  var words = string.toLowerCase().replace(/[.,&'?()\/!]/g, '').replace(/[\-]/g, ' ').split(/\s/);
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

const Search: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<SearchQuery>();
  const user = useUser();
  const router = useRouter();
  const [resultArray, setResultsArray] = useState([]);
  const [resultDict, setResultsDict] = useState({});
  const [loading, setLoading] = useState(false);

  async function search(query) {
    const keywords = extractKeyTokens(query);
    let reference = db.collection("questions");
    const docsArray = [];
    const docsDict = {};

    if (keywords.length > 0) {
      // const snapshot = await questionsRef
      //   .where("keywords", "array-contains-any", keywords)
      //   .get();
      
      keywords.forEach(element => {
        // @ts-ignore
        reference = reference.where(`contains.${element}`,"==",true);
      });
     
      const snapshot = await reference.get(); 
      
      if (snapshot.empty) {
        setResultsArray([]);
        setResultsDict({});
        console.log("No matching documents.");
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
      }
    } else {
      setResultsArray([]);
      setResultsDict({});
    }
    setLoading(false);
    console.log(docsDict);
    console.log(docsArray);
  }

  const onSubmit = (data: SearchQuery) => {
    setLoading(true);
    search(data.query).then().catch((error) => console.log(error));
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center p-4 bg-gray-100">
      <form className="w-full mb-6" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="border p-2 bg-blueGray-100"
          name="query"
          ref={register({ required: true, minLength: 1 })}
        />
        <button type="submit" className="p-2 text-white bg-light-blue-500">
          Search
        </button>
        {errors.query && <p className="text-red-500 mt-1">You need to query</p>}
      </form>
      {loading && <div>Loading...</div>}
      {!loading && resultArray.length > 0 ? (
        resultArray.map((question) => (
          <div key={question.id} className="bg-white p-6 border">
            {question.tags.map((tag) => (
              <span className="px-3 py-2 mr-2 border rounded-md text-sm bg-light-blue-300">
                {tag}
              </span>
            ))}
            <div className="h-16 mt-6 overflow-hidden relative">
              <div className="bg-gradient-to-t from-white to-transparent h-full w-full absolute top-0"></div>
              <div
                dangerouslySetInnerHTML={{ __html: question.question }}
              ></div>
            </div>

            <Link href={`/question/${question.qid}`}>
              <button className="bg-light-blue-500 px-3 py-2 text-white rounded-md">
                View
              </button>
            </Link>
          </div>
        ))
      ) 
      : (
        <></>
      )}
    </div>
  );
};

export default Search;

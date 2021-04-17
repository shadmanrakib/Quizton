// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies } from "nookies"; //, setCookie, destroyCookie
import type { NextApiRequest, NextApiResponse } from "next";
import sanitizeHtml from "sanitize-html";
import * as quesdom from "../../types/quesdom";
import striptags from "striptags";
import stemmer from "lancaster-stemmer";
import thesaurus from "thesaurus";

function sanitize(html: string) {
  const tags = sanitizeHtml.defaults.allowedTags.concat([
    "math",
    "maction",
    "maligngroup",
    "malignmark",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mi",
    "mlongdiv",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mscarries",
    "mscarry",
    "msgroup",
    "msline",
    "mspace",
    "msqrt",
    "msrow",
    "mstack",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "semantics",
    "annotation",
    "annotation-xml",
  ]);

  const options = {
    allowedTags: tags,
    allowedAttributes: {
      span: ["class", "contentEditable", "style", "aria-hidden", "data-value"],
      annotation: ["encoding"],
      math: [
        {
          name: "xmlns",
          multiple: true,
          values: ["http://www.w3.org/1998/Math/MathML"],
        },
      ],
    },
  };
  //Separate function in case we want to do more processing or use extra features
  return sanitizeHtml(html, options);
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

/**
 * Generates an index which includes stemmed words from the
 * question, tags, and synonyms
 * @param {string} question - Question without any html tags.
 * @param {string[]} tags - Tags to add to the index
 */
function createIndex(question: string, tags: string[]) {
  var words = question
    .toLowerCase()
    .replace(/[.,&'?:;#@*\/!()\-"{}\[\]]/g, " ")
    .split(/\s/);

  var wordsAdded: Set<string> = new Set();
  var contains = {};

  var index: Object = {};
  var total = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];

    //Initial processing (Adds to index and creates set of words)
    if (w != "" && !stopwords.has(w)) {
      total += 1;

      const stemmedWord = stemmer(w);

      // //Add to set so for synonyms later
      wordsAdded.add(w);

      //Add stemmed word to index
      if (!index[stemmedWord]) {
        index[stemmedWord] = 0;
        contains[stemmedWord] = true;
      }
      index[stemmedWord] += 1;
    }
  }

  //Add synonyms to index
  wordsAdded.forEach((word) => {
    try {
      const synonyms: string[] = thesaurus.find(word);

      synonyms.forEach((syn) => {
        const synTokens = syn.replace(/[-]/g, " ").split(/\s/);
        synTokens.forEach((synToken) => {
          if (synToken != "" && !wordsAdded.has(synToken)) {
            const stemmedSyn = stemmer(syn);
            if (!index[stemmedSyn]) {
              index[stemmedSyn] = -1;
              contains[stemmedSyn] = true;
            } else if (index[stemmedSyn] < 0) {
              index[stemmedSyn] -= 1;
            }
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  });

  //Add tags to index
  tags.forEach((tag) => {
    tag
      .toLowerCase()
      .replace(/[\-]/g, " ")
      .split(/\s/)
      .forEach((t) => {
        const stemmedTagWord = stemmer(t);
        if (!index[stemmedTagWord]) {
          index[stemmedTagWord] = 0;
          contains[stemmedTagWord] = true;
        }
        index[stemmedTagWord] += 1;
      });
  });

  return { index: index, total: total, contains: contains };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const parsedCookies = parseCookies({ req });
  const inputs = JSON.parse(req.body);

  //console.log(inputs.question, inputs.explanation);

  if (!parsedCookies["token"])
    return res.status(200).send({ success: false, message: `No User Token` });
  try {
    const token = await firebaseAdmin
      .auth()
      .verifyIdToken(parsedCookies["token"]);
    // the user is authenticated!

    const { uid, email } = token;
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const userData = userDoc.data();

    const createDate = firebaseAdmin.firestore.FieldValue.serverTimestamp();

    if (!inputs.tags) inputs.tags = [];
    const tags = inputs.tags.map((value) => {
      return value.value;
    });

    const sanitizedQuestion = sanitize(inputs.question);

    var choicesString = "";
    const sanitizedChoices = inputs.choices.map((value) => {
      const sanitizedChoice = sanitize(value.value);
      if (sanitizedChoice) {
        choicesString += " " + sanitizedChoice;
      }
      return sanitizedChoice;
    });
    const sanitizedExplanation = sanitize(inputs.explanation);
    const author = {
      uid: uid,
      username: userData.username,
      hasProfilePicture: userData.hasProfilePicture,
    };

    const { index, total, contains } = createIndex(
      striptags(sanitizedQuestion + " " + choicesString),
      tags
    );

    const multipleChoiceQuestion: quesdom.multipleChoice = {
      kind: "multipleChoice",
      answerChoices: sanitizedChoices,
      correctAnswer: inputs.answer,
      question: sanitizedQuestion,
      tags: tags,
      votes: 0,
      upvotes: 0,
      downvotes: 0,
      index: index,
      contains: contains,
      totalWords: total,
      explanation: sanitizedExplanation,
      date: createDate,
      author: author,
    };
    const { id } = await adminDB
      .collection("questions")
      .add(multipleChoiceQuestion); // Convert Inputs to multipleChoice

    return res.status(200).send({
      success: true,
      message: `Question added successfully.`,
    });
  } catch (err) {
    // Return undefined if there is no user. You may also send a different status or handle the error in any way that you wish.
    console.log(err);
    return res.status(200).send({ success: false, message: err });
  }
};

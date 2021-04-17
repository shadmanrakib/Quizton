import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "../../config/firebaseAdmin";
import { Question, EditRequest } from "../../types/quesdom";
import striptags from "striptags";
import stemmer from "lancaster-stemmer";
import thesaurus from "thesaurus";
import sanitizeHtml from "sanitize-html";

//Todo: Question validation

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
        if (!wordsAdded.has(syn)) {
          const stemmedSyn = stemmer(syn);
          if (!index[stemmedSyn]) {
            index[stemmedSyn] = -1;
            contains[stemmedSyn] = true;
          } else if (index[stemmedSyn] < 0) {
            index[stemmedSyn] -= 1;
          }
        }
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

export default async function editQuestion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = nookies.get({ req });
  const parsed: EditRequest = JSON.parse(req.body);
  if (!cookies || !cookies["token"]) {
    res.status(200).send({ success: false, message: "No user token" });
  }
  try {
    const fs = firebaseAdmin.firestore();
    const user = await firebaseAdmin.auth().verifyIdToken(cookies["token"]);
    //Update will fail if document does not exist
    //Todo: make sure that documnet is updated only with fields found in Question interface (type validation needed)
    //Todo: search index the edited question with new stuff
    const doc = await fs.doc("/questions/" + parsed.qid).get();
    if (doc.exists === false)
      throw { success: false, message: "Document to edit does not exist" };
    const question = doc.data() as Question;
    if (question.author.uid !== user.uid)
      throw { success: false, message: "Author does not match" };
    console.log(parsed.question, parsed.qid);
    if (
      question.kind === "multipleChoice" &&
      parsed.question.kind === "multipleChoice"
    ) {

      const editDate = firebaseAdmin.firestore.FieldValue.serverTimestamp();


    


      const sanitizedQuestion = sanitize(parsed.question.question);

      var choicesString = "";


      const sanitizedChoices = parsed.question.answerChoices.map((value) => {
        const sanitizedChoice = sanitize(value);
        if (sanitizedChoice) {
          choicesString += " " + sanitizedChoice;
        }
        return sanitizedChoice;
      });
      const sanitizedAnswer = parsed.question.correctAnswer;
      const sanitizedExplanation = sanitize(parsed.question.explanation);
      console.log(sanitizedExplanation);
   


      const { index, total, contains } = createIndex(
        striptags(sanitizedQuestion + " " + choicesString),
        parsed.question.tags
      );

      const question = {
        kind: "multipleChoice",
        answerChoices: sanitizedChoices,
        correctAnswer: parsed.question.correctAnswer,
        question: sanitizedQuestion,
        tags: parsed.question.tags,
        index: index,
        contains: contains,
        totalWords: total,
        explanation: sanitizedExplanation,
        date: editDate,
      };

      await fs.doc("/questions/" + parsed.qid).update(question);
      res.status(200).send({
        success: true,
        message: "Multiple choice question successfully edited",
      });
    }
    //Todo: short answer edits
  } catch (e) {
    console.log(e);
    res.status(200).send(e);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firebaseAdmin, adminDB } from "../../config/firebaseAdmin";
import { parseCookies } from "nookies"; //, setCookie, destroyCookie
import type { NextApiRequest, NextApiResponse } from "next";
import sanitizeHtml from "sanitize-html";
import * as quesdom from "../../types/quesdom";
import striptags from 'striptags';
import stemmer from 'lancaster-stemmer';
import wn from "wordnetjs";

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
          name: 'xmlns',
          multiple: true,
          values: ["http://www.w3.org/1998/Math/MathML"]
        }
      ]
    },
  };
  //Separate function in case we want to do more processing or use extra features
  return sanitizeHtml(html, options);
}

const stopwords: Set<string> = new Set(["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]);

function preprocessing(string) {
  var words = string.toLowerCase().replace(/[.,&'?()\/!]/g, '').replace(/[\-]/g, ' ').split(/\s/);
  // var tags = new Tag(words)
  //   .initial() // initial dictionary and pattern based tagging (Add .smooth() for further context based smoothing and accuracy
  //   .tags;

  var freqMap = {};
  var contains = {}
  var total = 0;

  for (let index = 0; index < words.length; index++) {
    const w = words[index];
    if (w != '' && !stopwords.has(w)) {
      const processedWord = stemmer(w);
      if (!freqMap[processedWord]) {
        freqMap[processedWord] = 0;
        contains[processedWord] = true;
      }
      freqMap[processedWord] += 1;
      total += 1;

      try {
        wn.synonyms(w).forEach(synset => {
          synset.close.forEach(e => {
            e.replace(/[\-]/g, ' ').split(/\s/).forEach(t => {
              contains[stemmer(t)] = true;
            });
          });

          synset.far.forEach(e => {
            e.replace(/[\-]/g, ' ').split(/\s/).forEach(t => {
              contains[stemmer(t)] = true;
            });
          });
        });

        // More precise but costly
        // if (tags[index]) {
        //   var pos = tags[index].charAt(0).toLowerCase();
        //   var synsets;
        //   switch (pos) {
        //     case "j":
        //       synsets = wn.adjective(w);
        //       break;
        //     case "n":
        //       synsets = wn.noun(w);
        //       break;
        //     case "r":
        //       synsets = wn.adverb(w);
        //       break;
        //     case "v":
        //       synsets = wn.verb(w);
        //   }

        // synsets.forEach(synset => {
        //   synset.words.forEach(e => {
        //     e.split(/\s/).forEach(t => {
        //       contains[stemmer(t)] = true;
        //     });
        //   });
        // });
        // }
      } catch (err) { console.log(err) }
    }
  }

  return { freq: freqMap, contains: contains, total: total };
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

    const tags = inputs.tags.map((value) => {
      return value.value;
    })

    const sanitizedQuestion = sanitize(inputs.question);
    const sanitizedChoices = inputs.choices.map((value) => {
      return sanitize(value.value);
    })
    const sanitizedAnswer = sanitize(inputs.answer);
    const sanitizedExplanation = sanitize(inputs.explanation);
    const author = {
      uid: uid,
      username: userData.username,
      hasProfilePicture: userData.hasProfilePicture,
    }

    const processedMetadata = preprocessing(striptags(sanitizedQuestion));

    tags.forEach(tag => {
      tag.toLowerCase().replace(/[\-]/g, ' ').split(/\s/).forEach(t => {
        processedMetadata.contains[stemmer(t)] = true;
      });
    });

    const multipleChoiceQuestion: quesdom.multipleChoice = {
      kind: "multipleChoice",
      answerChoices: sanitizedChoices,
      correctAnswer: sanitizedAnswer,
      question: sanitizedQuestion,
      tags: tags,
      votes: 0,
      upvotes: 0,
      downvotes: 0,
      contains: processedMetadata.contains,
      freq: processedMetadata.freq,
      totalWords: processedMetadata.total,
      explanation: sanitizedExplanation,
      date: createDate,
      author: author,
    };
    const { id } = await adminDB.collection("questions").add(multipleChoiceQuestion); // Convert Inputs to multipleChoice

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

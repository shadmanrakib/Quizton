import React from "react";
import * as quesdom from "../../types/quesdom";
import "katex/dist/katex.min.css";
import { useForm, useFieldArray, useFormState } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import stripTags from "striptags";

import { QAPage, Question as QuestionSchema } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import Head from "next/head";

interface QuestionComponentProps {
  onSubmit?: (any) => void;
  data: quesdom.multipleChoice;
  qid: string;
  onEditButtonClicked: () => void;
}

const Question = (props: QuestionComponentProps) => {
  const user = useUser();
  console.log(user && user.uid);
  const { register, handleSubmit, control } = useForm();
  const { errors } = useFormState({ control });

  const strippedQuestion = stripTags(props.data.question);
  return (
    <div className="bg-cool-gray-100">
      <Head>
      <meta property="og:title" content={props.data.question} key="ogtitle"/>
      <meta property="og:description" content={"A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions."} key="ogdesc"/>
      <meta property="og:type" content="website" key="ogtype"/>
      <meta property="og:site_name" content="Quizton" key="ogsitename" />
      <meta property="og:url" content={"https://www.quizton.com/question/" + props.qid} key="ogurl" />
      <meta property="og:image" content="/opengraphImage.png" key="ogimg"/>
      <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <script
          {...jsonLdScriptProps<QAPage>({
            "@context": "https://schema.org",
            "@type": "QAPage",
            mainEntity: {
              "@type": "Question",
              name: strippedQuestion,
              text: strippedQuestion,
              acceptedAnswer: {
                "@type": "Answer",
                name: "answer",
                text: stripTags(
                  props.data.answerChoices[props.data.correctAnswer]
                ),
                upvoteCount: props.data.upvotes,
                downvoteCount: props.data.downvotes,
                url: "https://www.quizton.com/question/" + props.qid,
                dateCreated: new Date(props.data.date.nanoseconds).toISOString(),
                answerExplanation: {
                  "@type": "WebContent",
                  text: props.data.explanation,
                },
                author: {
                  "@type": "Person",
                  name: props.data.author.username,
                  givenName: props.data.author.username,
                  url:
                    "http://quizton.com/profile?uid=" + props.data.author.uid,
                },
                creator: {
                  "@type": "Person",
                  name: props.data.author.username,
                  givenName: props.data.author.username,
                  url:
                    "http://quizton.com/profile?uid=" + props.data.author.uid,
                },
              },
              isFamilyFriendly: true,
              eduQuestionType: "Multiple choice",
              audience: {
                "@type": "Audience",
                audienceType: "students",
              },
              author: {
                "@type": "Person",
                name: props.data.author.username,
                givenName: props.data.author.username,
                url:
                  "http://www.quizton.com/profile?uid=" + props.data.author.uid,
              },
              creator: {
                "@type": "Person",
                name: props.data.author.username,
                givenName: props.data.author.username,
                url:
                  "http://www.quizton.com/profile?uid=" + props.data.author.uid,
              },
              educationalUse: ["practice question", "practice", "assignment"],
              interactivityType: "active",
              keywords: props.data.tags,
              url: "https://www.quizton.com/question/" + props.qid,
              answerCount: 1,
            },
          })}
        ></script>
      </Head>

      <div className="flex max-w-6xl my-3 p-6 mx-auto bg-white rounded-md border border-gray-300">
        <div className="">
          <div>
            <div
              className="my-6 font-serif md:text-lg"
              dangerouslySetInnerHTML={{ __html: props.data.question }}
            ></div>
          </div>
          <form onSubmit={handleSubmit(props.onSubmit)}>
            {props.data.answerChoices.map((choice, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={"choice" + index}
                  {...register("answer")}
                  value={index}
                ></input>
                <label
                  htmlFor={"choice" + index}
                  dangerouslySetInnerHTML={{ __html: choice }}
                  className="inline-block ml-3 text-lg font-light"
                ></label>
              </div>
            ))}
            <div className="flex items-center">
              <button
                className="my-6 px-3 py-1.5 rounded-md bg-blue-500 text-white"
                type="submit"
              >
                Check
              </button>
              <p className="underline ml-5 cursor-pointer">Show answer</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Question;

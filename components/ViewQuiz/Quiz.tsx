import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as quesdom from "../../types/quesdom";
import postData from "../../utility/postData";
import RenderQuestion from "./RenderQuestion";
import stripTags from "striptags";

import { Product, Question as QuestionSchema } from "schema-dts";
import { jsonLdScriptProps } from "react-schemaorg";
import Head from "next/head";

interface props {
  quiz: quesdom.Quiz;
  qid: string;
}

interface Inputs {
  userAnswers: string[];
}

function Quiz({ quiz, qid }: props) {
  const methods = useForm<Inputs>({
    //User responses. Example: [1, 2, 0, null, 1, 2]. Null is for no response
    defaultValues: {
      userAnswers: quiz.questions.map(() => null),
    },
  });
  const [check, setCheck] = useState<boolean>(false);
  const onSubmit = (data) => {
    console.log(data);
    postData("/api/addRecent", { qid: qid, kind: "quiz" });
  };

  return (
    <div>
      <Head>
        <meta
          name="description"
          content="A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions."
        />

        <meta
          property="og:url"
          content={"https://quizton.vercel.app/quiz/" + qid}
          key="ogurl"
        />
        <meta property="og:site_name" content="Quizton" key="ogsitename" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:title" content={quiz.title} key="ogtitle" />
        <meta
          property="og:description"
          content="A collaborative test bank. A website where users can create, share, rate, and do quizzes and questions."
          key="ogdesc"
        />
        <meta
          property="og:image"
          content="https://quizton.vercel.app/ogImage.png"
          key="ogimg"
        />

        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta property="twitter:domain" content="" key="twdomain" />
        <meta
          property="twitter:url"
          content={"https://quizton.vercel.app/quiz/" + qid}
          key="twurl"
        />
        <meta name="twitter:title" content={quiz.title} key="twtitle" />
        <meta
          name="twitter:description"
          content="A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions."
          key="twdesc"
        />
        <meta
          name="twitter:image"
          content="https://quizton.vercel.app/ogImage.png"
          key="twimg"
        />

        <script
          {...jsonLdScriptProps<Product>({
            "@context": "https://schema.org",
            "@type": "Product",
            name: quiz.title,
            brand: {
              "@type": "Brand",
              logo: "https://quizton.vercel.app/logo.svg",
              image: "https://quizton.vercel.app/logo.svg",
              slogan: "Tons of practice",
              name: "Quizton",
              url: "https://quizton.vercel.app",
              description:
                "A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions.",
            },
            mainEntityOfPage: {
              "@type": "Quiz",
              educationalUse: ["practice", "assignment", "quiz", "test"],
              learningResourceType: [
                "practice",
                "assignment",
                "quiz",
                "test",
                "practice quiz",
                "practice test",
              ],
              audience: {
                "@type": "Audience",
                audienceType: "students",
              },
              author: {
                "@type": "Person",
                name: quiz.author.username,
                givenName: quiz.author.username,
                url: "http://quizton.vercel.app/profile?uid=" + quiz.author.uid,
              },
              url: "https://quizton.vercel.app/quiz/" + qid,
            },
          })}
        ></script>
      </Head>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col max-w-3xl p-4 mx-auto">
            {quiz.questions.map((question, index) => {
              if (question.kind === "multipleChoice") {
                return (
                  <RenderQuestion
                    answer={question.correctAnswer}
                    choices={question.answerChoices}
                    question={question.question}
                    questionIndex={index}
                    key={index}
                    check={check}
                  ></RenderQuestion>
                );
              }
            })}
            <button
              className="w-auto bg-blue-500 text-white p-3 rounded-lg focus:outline-none"
              type="submit"
              onClick={() => {
                setCheck(true);
              }}
            >
              Check Quiz
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default Quiz;

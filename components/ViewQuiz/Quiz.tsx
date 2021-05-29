import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as quesdom from "../../types/quesdom";
import postData from "../../utility/postData";
import RenderQuestion from "./RenderQuestion";
import stripTags from "striptags";

import { Product, Question as QuestionSchema, } from "schema-dts";
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
  const onSubmit = (data) => {
    console.log(data);
    postData("/api/addRecent", { qid: qid, kind: "quiz" });
  };

  return (
    <div>

  <Head>
    <meta property="og:title" content={quiz.title} key="ogtitle"/>
    <meta property="og:description" content={"A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions."} key="ogdesc"/>
    <meta property="og:type" content="website" key="ogtype"/>
    <meta property="og:site_name" content="Quizton" key="ogsitename" />
    <meta property="og:url" content={"https://www.quizton.com/quiz/" + qid} key="ogurl" />
    <meta property="og:image" content="/opengraphImage.png" key="ogimg"/>
    <meta name="twitter:card" content="summary_large_image" key="twcard" />

        <script
          {...jsonLdScriptProps<Product>({
            "@context": "https://schema.org",
            "@type": "Product",
            name: quiz.title,
            brand: {
              "@type": "Brand",
              logo: "https://www.quizton.com/logo.svg",
              image: "https://www.quizton.com/logo.svg",
              slogan: "Tons of practice",
              name: "Quizton",
              url: "https://www.quizton.com",
              description : "A collaborative test bank / question library. A website where users can create, share, rate, and do quizzes and questions." 
            },
            mainEntityOfPage: {
              "@type": "Quiz",
              educationalUse: ["practice", "assignment", "quiz", "test"],
              learningResourceType: ["practice", "assignment", "quiz", "test", "practice quiz", "practice test"],
              audience: {
                "@type": "Audience",
                audienceType: "students",
              },
              author: {
                "@type": "Person",
                name: quiz.author.username,
                givenName: quiz.author.username,
                url:
                  "http://www.quizton.com/profile?uid=" + quiz.author.uid,
              },
              url: "https://www.quizton.com/quiz/" + qid,
            }
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
                    index={index}
                    key={index}
                  ></RenderQuestion>
                );
              }
            })}
            <button
              className="w-auto bg-blue-500 text-white p-3 rounded-lg focus:outline-none"
              type="submit"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default Quiz;

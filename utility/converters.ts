import * as quesdom from "../types/quesdom";

//Multiple choice question to form-friendly MC question
//Input: quesdom.multipleChoice
//Output quesdom.multipleChoice but the tags and answerChoice fields are {value: string}[]
export function convert_mc(
  question: quesdom.multipleChoice | quesdom.QuizMultipleChoice
): any {
  let returnVal = { ...question } as any;
  returnVal.tags = returnVal.tags.map((val) => {
    return { value: val };
  });
  returnVal.answerChoices = returnVal.answerChoices.map((val) => {
    return { value: val };
  });
  return returnVal;
}

//Quiz to form-friendly quiz
export function convert_quiz(quiz: quesdom.Quiz): any {
  let returnVal = { ...quiz };
  returnVal.questions = returnVal.questions.map((question) => {
    if (question.kind === "multipleChoice") {
      return convert_mc(question);
    }
  });
  return returnVal;
}

//Form-friendly question to database-friendly question
export function convert_formQuestion(
  mc_question: any
): quesdom.QuizMultipleChoice | quesdom.multipleChoice {
  if (mc_question.kind !== "multipleChoice") throw "Not a MC question!";
  let returnVal = { ...mc_question } as any;
  returnVal.tags = returnVal.tags.map((val) => {
    return val.value;
  });
  returnVal.answerChoices = returnVal.answerChoices.map((val) => {
    return val.value;
  });
  return returnVal;
}

//Form-friendly quiz to database-friendly quiz
export function convert_formQuiz(quiz: any): quesdom.Quiz {
  let returnVal = { ...quiz };
  returnVal.questions = returnVal.questions.map((question) => {
    if (question.kind === "multipleChoice") {
      return convert_formQuestion(question);
    }
  });
  return returnVal;
}

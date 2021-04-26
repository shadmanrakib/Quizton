export interface authorMetaData {
  uid: string;
  username: string;
  hasProfilePicture: boolean;
}
export interface EditRequest {
  qid: string;
  question: MultipleChoiceRequest;
}

//Quizzes only support multiple choice for now
export interface QuizRequest {
  questions: MultipleChoiceRequest[];
  title: string;
}

export interface MultipleChoiceRequest {
  kind: "multipleChoice";
  answerChoices: string[];
  correctAnswer: number;
  question: string;
  explanation: string;
  tags: string[];
}

export interface questionMetaData {
  kind: string;
  question: string; //HTML
  tags: string[];
  //date: any; // TODO: Change to firebase timestamp type
  author: authorMetaData;
  explanation: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  date: any;
}

export interface EditQuizRequest {
  quiz: QuizRequest;
  qid: string;
}

export interface voteDocument {
  uid: string;
  kind: "upvote" | "downvote";
  qid: string;
}

export interface voteRequest {
  kind: "upvote" | "downvote" | "unvote";
  qid: string;
}

export interface shortAnswer extends questionMetaData {
  kind: "shortAnswer";
  answer: string;
}

export interface multipleChoice extends questionMetaData {
  kind: "multipleChoice";
  answerChoices: string[];
  correctAnswer: number;
}
//Refer to typescript discriminated unions
export type Question = shortAnswer | multipleChoice;

export type Quiz = {
  questions: Question[];
  author: authorMetaData;
  title: string;
  date: string; //String returned by new Date().toString()
};

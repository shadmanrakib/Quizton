export interface authorMetaData {
  uid: string;
  username: string;
  hasProfilePicture: boolean;
}

export interface questionMetaData {
  kind: string;
  question: string; //HTML
  tags: string[];
  //date: any; // TODO: Change to firebase timestamp type
  author: authorMetaData;
  explanation: string;
  upvotes: number;
  downvotes: number;
  date: any;
}

export interface voteDocument {
  uid: string;
  username: string;
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
  date: Date;
};

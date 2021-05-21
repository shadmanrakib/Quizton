export interface authorMetaData {
  uid: string;
  username: string;
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

export interface UserInfoRequest {
  uid: string;
}
export interface UserInfoResponse {
  photoURL: string;
  username: string;
  displayName: string;
}

export interface AddRecentRequest {
  qid: string;
  kind: "quiz" | "multipleChoice" | "search";
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

export interface QuizMultipleChoice {
  kind: "multipleChoice";
  answerChoices: string[];
  correctAnswer: number;
  author: authorMetaData;
  date: any;
  explanation: string;
  question: string;
  tags: string[];
}

export interface QuizShortAnswer {
  kind: "shortAnswer";
  answer: string;
  author: authorMetaData;
  date: any;
  explanation: string;
  question: string;
  tags: string[];
}

export type QuizQuestion = QuizShortAnswer | QuizMultipleChoice;

export type Quiz = {
  questions: QuizQuestion[];
  author: authorMetaData;
  title: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  date: any; //Firebase timestamp for now
};

export interface RecentThingsBatch {
  timestamp: number; //Milliseconds since unix epoch
  dataArray: (QuizRecentData | QuestionRecentData | SearchRecentData)[];
}

export interface SearchRecentData {
  timestamp: number;
  query: string;
  kind: "search";
}

export interface QuizRecentData {
  timestamp: number;
  qid: string;
  kind: "quiz";
  quiz: Quiz;
}

export interface QuestionRecentData {
  timestamp: number;
  qid: string;
  kind: "multipleChoice";
  question: Question;
}

export interface CustomClaims {
  username: string;
  registered: boolean;
}

export interface Comment {
  uid: string;
  username: string;
  comment: string;
  timestamp: any;
  hasReply: false;
  docId?: string;
}

export interface Reply extends Comment {
  parentComment: string;
}

export interface PageData {
  subject: string;
  title: string;
  topics: Topic[];
}

export interface Topic {
  title: string;
  subtopics: string[];
}

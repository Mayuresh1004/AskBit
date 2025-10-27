import { Models } from "node-appwrite";

// Base Row type from Appwrite
export type BaseRow = Models.Document;

// Question type
export interface Question extends BaseRow {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId?: string;
    author?: User;
    totalVotes?: number;
    totalAnswers?: number;
    upvotesRows?: Vote[];
    downvotesRows?: Vote[];
}

// Answer type
export interface Answer extends BaseRow {
    content: string;
    questionId: string;
    authorId: string;
    author?: User;
    upvotesRows?: Vote[];
    downvotesRows?: Vote[];
    comments?: Comment[];
}

// Comment type
export interface Comment extends BaseRow {
    content: string;
    authorId: string;
    author?: User;
}

// Vote type
export interface Vote extends BaseRow {
    type: "question" | "answer";
    typeId: string;
    authorId: string;
    voteStatus: "upvoted" | "downvoted";
}

// User type
export interface User extends BaseRow {
    name: string;
    email: string;
    reputation: number;
}

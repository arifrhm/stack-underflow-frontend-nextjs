export type QuestionStatus = 'open' | 'answered' | 'closed';

export interface User {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  status: QuestionStatus;
  authorId: string;
  authorName: string;
  createdAt: Date;
  comments: Comment[];
}

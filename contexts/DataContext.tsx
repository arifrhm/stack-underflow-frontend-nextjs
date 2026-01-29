'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Question, Comment, QuestionStatus } from '@/types';

interface DataContextType {
  questions: Question[];
  addQuestion: (title: string, description: string, authorId: string, authorName: string) => void;
  updateQuestion: (id: string, title: string, description: string, status: QuestionStatus) => void;
  getQuestion: (id: string) => Question | undefined;
  addComment: (questionId: string, content: string, authorId: string, authorName: string) => void;
  updateComment: (questionId: string, commentId: string, content: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialQuestions: Question[] = [
  {
    id: '1',
    title: 'How to center a div in CSS?',
    description: 'I\'ve been trying to center a div both horizontally and vertically. What\'s the best approach in 2024?',
    status: 'answered',
    authorId: 'user1',
    authorName: 'webdev123',
    createdAt: new Date('2024-01-15T10:30:00'),
    comments: [
      {
        id: 'c1',
        questionId: '1',
        authorId: 'user2',
        authorName: 'css_expert',
        content: 'The easiest way is using Flexbox: display: flex; justify-content: center; align-items: center;',
        createdAt: new Date('2024-01-15T11:00:00'),
      },
    ],
  },
  {
    id: '2',
    title: 'React useEffect dependency warning',
    description: 'I\'m getting a warning about missing dependencies in my useEffect. Should I include all dependencies or disable the warning?',
    status: 'open',
    authorId: 'user3',
    authorName: 'react_newbie',
    createdAt: new Date('2024-01-16T14:20:00'),
    comments: [],
  },
  {
    id: '3',
    title: 'TypeScript generic type inference',
    description: 'How do I get TypeScript to properly infer generic types from function arguments?',
    status: 'closed',
    authorId: 'user4',
    authorName: 'typescript_fan',
    createdAt: new Date('2024-01-17T09:15:00'),
    comments: [
      {
        id: 'c2',
        questionId: '3',
        authorId: 'user5',
        authorName: 'senior_dev',
        content: 'Type inference can be tricky. Make sure your type constraints are properly defined.',
        createdAt: new Date('2024-01-17T10:00:00'),
      },
    ],
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const addQuestion = useCallback((
    title: string,
    description: string,
    authorId: string,
    authorName: string
  ) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      status: 'open',
      authorId,
      authorName,
      createdAt: new Date(),
      comments: [],
    };
    setQuestions(prev => [newQuestion, ...prev]);
  }, []);

  const updateQuestion = useCallback((
    id: string,
    title: string,
    description: string,
    status: QuestionStatus
  ) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, title, description, status } : q
      )
    );
  }, []);

  const getQuestion = useCallback((id: string): Question | undefined => {
    return questions.find(q => q.id === id);
  }, [questions]);

  const addComment = useCallback((
    questionId: string,
    content: string,
    authorId: string,
    authorName: string
  ) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(7),
      questionId,
      authorId,
      authorName,
      content,
      createdAt: new Date(),
    };
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, comments: [...q.comments, newComment] }
          : q
      )
    );
  }, []);

  const updateComment = useCallback((
    questionId: string,
    commentId: string,
    content: string
  ) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              comments: q.comments.map(c =>
                c.id === commentId ? { ...c, content } : c
              ),
            }
          : q
      )
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        questions,
        addQuestion,
        updateQuestion,
        getQuestion,
        addComment,
        updateComment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

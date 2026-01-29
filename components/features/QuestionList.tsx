'use client';

import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionStatus } from '@/types';
import { MessageSquare, Clock, User } from 'lucide-react';

const statusColors: Record<QuestionStatus, string> = {
  open: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20',
  answered: 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20',
  closed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20',
};

const statusLabels: Record<QuestionStatus, string> = {
  open: 'Open',
  answered: 'Answered',
  closed: 'Closed',
};

export function QuestionList() {
  const { questions } = useData();
  const { user } = useAuth();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Questions</h1>
        <Button asChild>
          <Link href="/questions/new">Ask Question</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {questions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    <Link
                      href={`/questions/${question.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {question.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {question.description}
                  </CardDescription>
                </div>
                <Badge className={statusColors[question.status]}>
                  {statusLabels[question.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{question.authorName}</span>
                  {user?.id === question.authorId && (
                    <span className="text-xs text-gray-400">(you)</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(question.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.comments.length} comment{question.comments.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

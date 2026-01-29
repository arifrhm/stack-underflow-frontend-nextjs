'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { QuestionStatus as QuestionStatusType } from '@/types';

interface QuestionFormProps {
  questionId?: string;
}

const statusOptions: { value: QuestionStatusType; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'answered', label: 'Answered' },
  { value: 'closed', label: 'Closed' },
];

export function QuestionForm({ questionId }: QuestionFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getQuestion, addQuestion, updateQuestion } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<QuestionStatusType>('open');

  const isEditing = !!questionId;
  const question = questionId ? getQuestion(questionId) : undefined;

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setDescription(question.description);
      setStatus(question.status);
    }
  }, [question]);

  useEffect(() => {
    if (isEditing && question && user?.id !== question.authorId) {
      router.push('/');
    }
  }, [isEditing, question, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/');
      return;
    }

    if (!title.trim() || !description.trim()) {
      return;
    }

    if (isEditing && questionId) {
      updateQuestion(questionId, title, description, status);
      router.push(`/questions/${questionId}`);
    } else {
      addQuestion(title, description, user.id, user.username);
      router.push('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={isEditing && questionId ? `/questions/${questionId}` : '/'}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Question' : 'Ask a Question'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Your Question' : 'Create a New Question'}</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update your question details and status.'
              : 'Fill in the details below to post your question.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., How do I center a div in CSS?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about your question..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32"
                required
              />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as QuestionStatusType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Question' : 'Post Question'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

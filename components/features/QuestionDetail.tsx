'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Clock, User, Edit2, Check, X } from 'lucide-react';
import { QuestionStatus } from '@/types';

const statusColors: Record<QuestionStatus, string> = {
  open: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  answered: 'bg-green-500/10 text-green-700 dark:text-green-400',
  closed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

const statusLabels: Record<QuestionStatus, string> = {
  open: 'Open',
  answered: 'Answered',
  closed: 'Closed',
};

export function QuestionDetail({ questionId }: { questionId: string }) {
  const { getQuestion, updateComment, addComment } = useData();
  const { user } = useAuth();
  const question = getQuestion(questionId);

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  if (!question) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Question not found</h1>
        <Button asChild>
          <Link href="/">Back to Questions</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleAddComment = () => {
    if (user && newComment.trim()) {
      addComment(question.id, newComment, user.id, user.username);
      setNewComment('');
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    if (content.trim()) {
      updateComment(question.id, commentId, content);
      setEditingCommentId(null);
      setEditCommentContent('');
    }
  };

  const startEditing = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const isOwner = user?.id === question.authorId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Question Details</h1>
        {isOwner && (
          <Button variant="outline" asChild className="ml-auto">
            <Link href={`/questions/${question.id}/edit`}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Question
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">{question.title}</CardTitle>
              <CardDescription className="mt-3 text-base leading-relaxed">
                {question.description}
              </CardDescription>
            </div>
            <Badge className={statusColors[question.status]}>
              {statusLabels[question.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{question.authorName}</span>
              {isOwner && <span className="text-xs text-gray-400">(you)</span>}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-3">
              {question.comments.map((comment) => {
                const isCommentOwner = user?.id === comment.authorId;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.authorName}</span>
                      {isCommentOwner && <span className="text-xs text-gray-400">(you)</span>}
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          className="min-h-20"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment.id, editCommentContent)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    )}

                    {isCommentOwner && !isEditing && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(comment.id, comment.content)}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {user && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Add a Comment</h3>
              <Textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-24 mb-2"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <p className="text-sm text-gray-500 text-center">
              Please <Link href="/" className="text-blue-600 hover:underline">log in</Link> to comment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

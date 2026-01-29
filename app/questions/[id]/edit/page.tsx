'use client';

import { useState, useEffect } from 'react';
import { QuestionForm } from '@/components/features/QuestionForm';
import { LoginForm } from '@/components/features/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuth();
  const [questionId, setQuestionId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setQuestionId(p.id));
  }, [params]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (!questionId) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return <QuestionForm questionId={questionId} />;
}

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { QuestionDetail } from '@/components/features/QuestionDetail';
import { LoginForm } from '@/components/features/LoginForm';
import { useEffect, useState } from 'react';

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <QuestionDetail questionId={questionId} />
    </div>
  );
}

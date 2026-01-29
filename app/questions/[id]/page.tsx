'use client';

import { useAuth } from '@/contexts/AuthContext';
import { QuestionDetail } from '@/components/features/QuestionDetail';
import { LoginForm } from '@/components/features/LoginForm';

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <QuestionDetail questionId={(params as { id: string }).id} />
    </div>
  );
}

'use client';

import { QuestionForm } from '@/components/features/QuestionForm';
import { LoginForm } from '@/components/features/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <QuestionForm questionId={(params as { id: string }).id} />;
}

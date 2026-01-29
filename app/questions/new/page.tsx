'use client';

import { QuestionForm } from '@/components/features/QuestionForm';
import { LoginForm } from '@/components/features/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function NewQuestionPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <QuestionForm />;
}

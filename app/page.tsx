'use client';

import { LoginForm } from '@/components/features/LoginForm';
import { QuestionList } from '@/components/features/QuestionList';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <QuestionList />;
}

'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Login from '@/components/auth/Login';
import ChatRoom from '@/components/chat/ChatRoom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm p-8 flex flex-col items-center shadow-2xl">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-12 w-full max-w-xs" />
        </Card>
      </div>
    );
  }

  if (user) {
    return <ChatRoom user={user} />;
  }

  return <Login />;
}

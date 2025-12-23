'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Login from '@/components/auth/Login';
import ChatRoom from '@/components/chat/ChatRoom';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import FriendsSidebar from '@/components/chat/FriendsSidebar';
import { useState } from 'react';
import type { User } from 'firebase/auth';

export type ChatPartner = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

function ChatLayout({ user }: { user: User }) {
  const [selectedChat, setSelectedChat] = useState<ChatPartner | null>(null);

  return (
    <SidebarProvider>
      <Sidebar>
        <FriendsSidebar user={user} onSelectChat={setSelectedChat} />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <header className="flex items-center p-2 md:hidden border-b">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold ml-2">Messages</h2>
          </header>
          {selectedChat ? (
            <ChatRoom currentUser={user} chatPartner={selectedChat} />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">Select a chat to start messaging</h2>
                <p className="text-muted-foreground">You can find friends using the search bar in the sidebar.</p>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function Home() {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm p-8 flex flex-col items-center">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-12 w-full max-w-xs" />
        </div>
      </div>
    );
  }

  if (user) {
    return <ChatLayout user={user} />;
  }

  return <Login />;
}

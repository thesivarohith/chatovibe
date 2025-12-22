'use client';

import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Header() {
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-md z-10">
      <h1 className="text-xl font-bold tracking-wider">Realtime Relay</h1>
      <Button variant="ghost" className="hover:bg-primary/80" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </header>
  );
}

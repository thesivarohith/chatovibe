'use client';

import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MoreVertical, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import type { ChatPartner } from '@/app/page';

interface FriendsSidebarProps {
  user: User;
  onSelectChat: (user: ChatPartner) => void;
}

// Hardcoded user data for direct connection
const hardcodedUsers: ChatPartner[] = [
  {
    uid: 'T25m9gAivYc1Y2a9Zqg2Z0g6xQx1',
    displayName: 'User One',
    email: 'user.one@example.com',
    photoURL: `https://i.pravatar.cc/150?u=T25m9gAivYc1Y2a9Zqg2Z0g6xQx1`,
  },
  {
    uid: 'R7p0o3XyZkE5sNlJk3hG8dF2jVb2',
    displayName: 'User Two',
    email: 'user.two@example.com',
    photoURL: `https://i.pravatar.cc/150?u=R7p0o3XyZkE5sNlJk3hG8dF2jVb2`,
  },
];

export default function FriendsSidebar({ user, onSelectChat }: FriendsSidebarProps) {
  // Find the other user to display
  const friendToDisplay = useMemo(() => 
    hardcodedUsers.find(u => u.uid !== user.uid),
    [user.uid]
  );
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm text-gray-500">@{user.email?.split('@')[0]}</p>
            </div>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search friends..." 
            className="pl-10"
            disabled
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            {friendToDisplay ? (
                <button
                    key={friendToDisplay.uid}
                    type="button"
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => onSelectChat(friendToDisplay)}
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={friendToDisplay.photoURL!} alt={friendToDisplay.displayName!} />
                        <AvatarFallback>{getInitials(friendToDisplay.displayName!)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                         <p className="font-semibold truncate">{friendToDisplay.displayName}</p>
                        <p className="text-sm text-gray-500 truncate">{friendToDisplay.email}</p>
                    </div>
                </button>
            ) : (
              <div className="text-center text-gray-500 p-4">
                No other user found to connect with. Please ensure both test users are configured.
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
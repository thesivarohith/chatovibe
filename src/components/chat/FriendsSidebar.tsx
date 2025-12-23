
'use client';

import type { User } from 'firebase/auth';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FriendsSidebarProps {
  user: User;
  onSelectChat: (user: User) => void;
}

// Mock user data for display purposes
const mockUsers: Partial<User>[] = [];


export default function FriendsSidebar({ user, onSelectChat }: FriendsSidebarProps) {
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
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
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search friends..." className="pl-10" />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xl font-semibold">Messages (0)</h2>
        <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            {mockUsers.length === 0 && (
                <div className="text-center text-gray-500 p-4">No friends to show.</div>
            )}
            {mockUsers.map((friend) => (
                <button
                    key={friend.email}
                    className="w-full text-left p-2 rounded-lg hover:bg-accent flex items-center gap-3"
                    onClick={() => onSelectChat(friend as User)}
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.photoURL!} alt={friend.displayName!} />
                        <AvatarFallback>{getInitials(friend.displayName!)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                            <p className="font-semibold">{friend.displayName}</p>
                            <p className="text-xs text-gray-500">Feb 11th, 2025</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">Some last message...</p>
                    </div>
                </button>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}

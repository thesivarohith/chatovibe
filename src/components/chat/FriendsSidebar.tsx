'use client';

import type { User } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
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
import { Skeleton } from '../ui/skeleton';

interface FriendsSidebarProps {
  user: User;
  onSelectChat: (user: ChatPartner) => void;
}

const UserSkeleton = () => (
    <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
        </div>
    </div>
);


export default function FriendsSidebar({ user, onSelectChat }: FriendsSidebarProps) {
  const [search, setSearch] = useState('');
  const auth = useAuth();
  const db = useFirestore();
  
  // Query users collection, excluding the current user
  const usersRef = db ? collection(db, 'users') : null;
  const q = usersRef ? query(usersRef, where('uid', '!=', user.uid)) : null;
  const [usersSnapshot, loading] = useCollection(q);

  const filteredUsers = useMemo(() => {
    const users = usersSnapshot?.docs.map(doc => doc.data() as ChatPartner) || [];
    if (!search) {
      return users;
    }
    return users.filter(u => 
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [usersSnapshot, search]);
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    auth?.signOut();
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            {loading && (
                <div className="space-y-2">
                    <UserSkeleton />
                    <UserSkeleton />
                    <UserSkeleton />
                </div>
            )}
            {!loading && filteredUsers.length > 0 ? (
              filteredUsers.map(chatPartner => (
                <button
                    key={chatPartner.uid}
                    type="button"
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    onClick={() => onSelectChat(chatPartner)}
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={chatPartner.photoURL!} alt={chatPartner.displayName!} />
                        <AvatarFallback>{getInitials(chatPartner.displayName!)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                         <p className="font-semibold truncate">{chatPartner.displayName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chatPartner.email}</p>
                    </div>
                </button>
              ))
            ) : (
                !loading && (
                    <div className="text-center text-gray-500 p-4">
                        No other users found.
                    </div>
                )
            )}
        </div>
      </ScrollArea>
    </div>
  );
}


'use client';

import type { User } from 'firebase/auth';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db, auth } from '@/lib/firebase';
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
import { Skeleton } from '@/components/ui/skeleton';
import type { ChatPartner } from '@/app/page';

interface FriendsSidebarProps {
  user: User;
  onSelectChat: (user: ChatPartner) => void;
}

const UserSkeleton = () => (
    <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    </div>
)

export default function FriendsSidebar({ user, onSelectChat }: FriendsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const usersRef = collection(db, 'users');
  const usersQuery = query(usersRef, where('uid', '!=', user.uid));
  const [usersSnapshot, loading] = useCollection(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!usersSnapshot) return [];
    const allUsers = usersSnapshot.docs.map(doc => doc.data() as ChatPartner);
    
    if (!searchTerm) return allUsers;
    
    return allUsers.filter(u => 
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, usersSnapshot]);


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
            className="pl-10 bg-gray-100 p-2 rounded-lg outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xl font-semibold">Messages ({filteredUsers.length})</h2>
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
            {!loading && filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 p-4">
                  {searchTerm ? 'No users found.' : 'No other users found.'}
                </div>
            )}
            {filteredUsers.map((friend) => (
                <button
                    key={friend.uid}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => {
                        onSelectChat(friend);
                        console.log(friend.uid);
                    }}
                >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.photoURL!} alt={friend.displayName!} />
                        <AvatarFallback>{getInitials(friend.displayName!)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                         <p className="font-semibold truncate">{friend.displayName}</p>
                        <p className="text-sm text-gray-500 truncate">{friend.email}</p>
                    </div>
                </button>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}

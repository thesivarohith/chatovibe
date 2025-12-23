'use client';

import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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

// Manually define the two users to connect them for chatting.
const staticUsers: ChatPartner[] = [
  {
    uid: 'user_sivarohith_2007',
    displayName: 'Siva Rohith',
    photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocJ-12345ABCDE',
    email: 'sivarohith2007@gmail.com',
  },
  {
    uid: 'user_thesivarohith',
    displayName: 'THE SIVA ROHITH',
    photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocK-67890FGHIJ',
    email: 'thesivarohith@gmail.com',
  }
];

export default function FriendsSidebar({ user, onSelectChat }: FriendsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out the current user and then filter by search term
  const filteredUsers = useMemo(() => {
    // Exclude the currently logged-in user from the list
    const otherUsers = staticUsers.filter(u => u.email !== user.email);

    if (!searchTerm.trim()) {
      return otherUsers;
    }
    
    return otherUsers.filter(u => 
      (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, user.email]);


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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            {filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 p-4">
                  No other users to chat with.
                </div>
            )}
            {filteredUsers.map((friend) => (
                <button
                    key={friend.uid}
                    type="button"
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => onSelectChat(friend)}
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

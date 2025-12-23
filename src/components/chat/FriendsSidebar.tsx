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

// Manually defined list of users for testing purposes.
const allUsers: ChatPartner[] = [
    {
        uid: 'VrDm5fX3hQNrzeoXLVwDxO6snYs1', 
        displayName: 'sivarohith 2007',
        email: 'sivarohith2007@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocJ_6Zg-Y1qX_2L_yF_i_i_i_i_i_i_i_i_i=s96-c'
    },
    {
        uid: 's5ZpugkT9JRPBmArEJUHAMg3VqE2', 
        displayName: 'thesivarohith',
        email: 'thesivarohith@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocL-q9x_T7f5y0_wXy_gY6U_j_s8k_z-O_hJ8eP8sY=s96-c'
    },
    {
        uid: 'gHZ9n7s2b9X8fJ2kP3s5t8YxVOE2', 
        displayName: 'Siva Rohith',
        email: 'sivarohith.sivakumar@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocL-q9x_T7f5y0_wXy_gY6U_j_s8k_z-O_hJ8eP8sY=s96-c'
    }
];


export default function FriendsSidebar({ user, onSelectChat }: FriendsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter out the current user from the list
  const otherUsers = useMemo(() => allUsers.filter(u => u.uid !== user.uid), [user.uid]);

  // Filter the list based on the search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return otherUsers;
    
    return otherUsers.filter(u => 
      (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, otherUsers]);


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
                  No users found.
                </div>
            )}
            {filteredUsers.map((friend) => (
                <button
                    key={friend.uid}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => {
                        onSelectChat(friend);
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

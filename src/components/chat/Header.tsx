'use client';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LogOut, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ChatPartner } from '@/app/page';

interface HeaderProps {
    user: ChatPartner;
}

export default function Header({ user }: HeaderProps) {
  
  const handleSignOut = () => {
    auth?.signOut();
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="font-semibold text-lg">{user.displayName}</h2>
            <p className="text-sm text-gray-500">@{user.email?.split('@')[0]}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreVertical />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

import type { User } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Timestamp } from 'firebase/firestore';
import moment from 'moment';

export interface MessageData {
  id: string;
  text: string;
  sender: string;
  uid: string;
  photoURL?: string;
  createdAt: Timestamp | null;
}

interface MessageProps {
  message: MessageData;
  currentUser: User;
}

export default function Message({ message, currentUser }: MessageProps) {
  const isSender = message.uid === currentUser.uid;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formattedTime = message.createdAt ? moment(message.createdAt.toDate()).fromNow() : '';

  return (
    <div className={cn('flex items-end gap-3 my-4', isSender ? 'justify-end' : 'justify-start')}>
      {!isSender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.photoURL} alt={message.sender} />
          <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'group relative max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-sm',
          isSender
            ? 'bg-blue-400 text-white rounded-br-none'
            : 'bg-gray-200 text-black rounded-bl-none'
        )}
      >
        {!isSender && <p className="text-xs font-semibold text-gray-600 mb-1">{message.sender}</p>}
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <span className="text-xs opacity-70 ml-2 float-right mt-1 clear-both">
          {formattedTime}
        </span>
      </div>
      {isSender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.photoURL ?? undefined} alt={currentUser.displayName ?? ''} />
          <AvatarFallback>{currentUser.displayName ? getInitials(currentUser.displayName) : 'U'}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

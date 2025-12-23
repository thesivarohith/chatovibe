'use client';
import type { User } from 'firebase/auth';
import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, where, or } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import Header from './Header';
import Message, { type MessageData } from './Message';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatPartner } from '@/app/page';

interface ChatRoomProps {
    currentUser: User;
    chatPartner: ChatPartner;
}

const ChatSkeleton = () => (
    <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 justify-start">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-12 w-48 rounded-lg" />
        </div>
        <div className="flex items-center gap-3 justify-end">
            <Skeleton className="h-12 w-56 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-center gap-3 justify-start">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-16 w-64 rounded-lg" />
        </div>
    </div>
);


export default function ChatRoom({ currentUser, chatPartner }: ChatRoomProps) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const messagesRef = collection(db, 'messages');
    
    // Corrected query to fetch messages between the two users
    const q = query(
        messagesRef,
        where('participants', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'asc')
    );

    const [messagesSnapshot, loading] = useCollection(q);
    
    // Filter messages on the client to get the conversation with the selected partner
    const messages = messagesSnapshot?.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as MessageData))
        .filter(message => 
            (message.senderId === currentUser.uid && message.receiverId === chatPartner.uid) ||
            (message.senderId === chatPartner.uid && message.receiverId === currentUser.uid)
        ) || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const timeout = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeout);
    }, [messagesSnapshot, chatPartner]);
    
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (trimmedInput === '') return;

        const { uid, displayName, photoURL } = currentUser;
        
        try {
            await addDoc(messagesRef, {
                text: trimmedInput,
                sender: displayName,
                senderId: uid,
                receiverId: chatPartner.uid,
                participants: [uid, chatPartner.uid],
                photoURL,
                createdAt: serverTimestamp(),
            });

            setInputValue('');
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header user={chatPartner} />
            <ScrollArea className="flex-1">
                 <div className="p-4">
                    {loading ? (
                        <ChatSkeleton />
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map(message => (
                                <motion.div
                                    key={message.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        opacity: { duration: 0.2 },
                                        layout: {
                                          type: "spring",
                                          bounce: 0.4,
                                          duration: 0.3
                                        }
                                    }}
                                >
                                    <Message 
                                        message={message}
                                        currentUser={currentUser} 
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>
            <footer className="p-4 bg-card border-t sticky bottom-0">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <Input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                        className="text-base"
                    />
                    <Button type="submit" size="icon" aria-label="Send Message" disabled={!inputValue.trim()} className="disabled:cursor-not-allowed">
                        <Send />
                    </Button>
                </form>
            </footer>
        </div>
    );
}

import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {subscribe} from './errorStore.ts';
import './ErrorContext.css';

type ErrorMessage = { id: number; text: string };

export const ErrorToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<ErrorMessage[]>([]);

    useEffect(() => {
        return subscribe(setMessages);
    }, []);

    return (
        <>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="toast"
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
};

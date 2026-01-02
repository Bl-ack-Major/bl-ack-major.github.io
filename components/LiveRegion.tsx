
import React, { useState, useEffect } from 'react';
import { useToast } from './ToastNotification';

const LiveRegion: React.FC = () => {
    // We hook into the toast system to announce notifications
    // In a real app, this would also subscribe to route changes, window focus events, etc.
    // For now, we'll just announce the last toast message.
    
    // Note: Since useToast provides a list, we need to track the last one added.
    // This is a simplified implementation.
    
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Observer for DOM mutations on the toast container could go here
        // Or we just expose a global event for a11y announcements
        const handleAnnounce = (e: CustomEvent<string>) => {
            setMessage(e.detail);
        };

        window.addEventListener('announce-a11y', handleAnnounce as EventListener);
        return () => window.removeEventListener('announce-a11y', handleAnnounce as EventListener);
    }, []);

    return (
        <div 
            className="sr-only" 
            role="status" 
            aria-live="polite" 
            aria-atomic="true"
        >
            {message}
        </div>
    );
};

// Helper to dispatch announcements
export const announce = (msg: string) => {
    window.dispatchEvent(new CustomEvent('announce-a11y', { detail: msg }));
};

export default LiveRegion;

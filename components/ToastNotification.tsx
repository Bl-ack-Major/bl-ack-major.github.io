
import React, { useState, useCallback, createContext, useContext } from 'react';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, Trophy } from 'lucide-react';
import { Notification } from '../types';
import { announce } from './LiveRegion';

interface ToastContextType {
  addNotification: (message: string | React.ReactNode, type?: 'info' | 'success' | 'warning' | 'error' | 'quest') => void;
  removeNotification: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string | React.ReactNode, type: 'info' | 'success' | 'warning' | 'error' | 'quest' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Announce to screen readers
    const textContent = typeof message === 'string' ? message : 'New notification received';
    announce(textContent);
    
    // Auto dismiss
    const duration = type === 'quest' ? 6000 : 4000; // Longer for quests
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <ToastContainer notifications={notifications} removeNotification={removeNotification} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
      throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-[10002] flex flex-col gap-3 pointer-events-none items-end" role="log" aria-live="polite">
      {notifications.map(notification => {
        let bgClass = "bg-[#1f2229] border-gray-700";
        let icon = <Info size={18} className="text-blue-400" />;
        let textClass = "text-gray-200";

        switch (notification.type) {
            case 'success':
                icon = <CheckCircle size={18} className="text-green-400" />;
                break;
            case 'warning':
                icon = <AlertTriangle size={18} className="text-yellow-400" />;
                break;
            case 'error':
                icon = <AlertCircle size={18} className="text-red-400" />;
                break;
            case 'quest':
                // Premium look for Quest completion
                bgClass = "bg-[#0a0a0f]/95 border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.25)] backdrop-blur-md";
                icon = (
                    <div className="relative">
                        <Trophy size={20} className="text-yellow-400 relative z-10" />
                        <div className="absolute inset-0 bg-yellow-500 blur-md opacity-50 animate-pulse"></div>
                    </div>
                );
                textClass = "text-gray-100";
                break;
        }

        return (
            <div 
              key={notification.id}
              className={`pointer-events-auto border shadow-2xl rounded-lg p-4 min-w-[320px] max-w-md flex items-start gap-4 animate-in slide-in-from-right duration-500 ${bgClass}`}
            >
              <div className="mt-0.5 shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium leading-relaxed ${textClass}`}>
                    {notification.message}
                </div>
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="text-gray-500 hover:text-white transition-colors shrink-0"
                aria-label="Close Notification"
              >
                <X size={16} />
              </button>
            </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

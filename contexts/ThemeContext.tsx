
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useChallenge } from './ChallengeContext';
import { AccountType } from '../auth/accountTypes';

interface ThemeContextType {
    isLightMode: boolean;
    toggleTheme: () => void;
    themeClass: string; // Helper for Tailwind classes
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { account } = useAuth();
    const { difficulty } = useChallenge();
    const [isLightMode, setIsLightMode] = useState(true);

    // Strict Logic for Theme Enforcement
    useEffect(() => {
        if (!account) return;

        // 1. Recruiter is ALWAYS default Light Mode (Corporate Persona)
        if (account.accountType === AccountType.RECRUITER) {
            setIsLightMode(true);
            return;
        }

        // 2. Administrator is ALWAYS default Dark Mode (Hacker Persona)
        if (account.accountType === AccountType.ADMINISTRATOR) {
            setIsLightMode(false);
            return;
        }

        // 3. Guest Logic
        if (account.accountType === AccountType.GUEST) {
            // Hacker Mode = Forced Dark
            if (difficulty === 'hard') {
                setIsLightMode(false);
            } else {
                // Casual Mode = Default Light (but user can toggle)
                // We only set this on mount/change to avoid overriding manual toggles too aggressively
                // unless we want to strictly enforce "Casual starts as Light"
                setIsLightMode(true); 
            }
        }
    }, [account, difficulty]);

    // Apply global body class for CSS selectors (Scrollbars, etc.)
    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        } else {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        }
    }, [isLightMode]);

    const toggleTheme = () => {
        // Prevent toggle if in Hacker Mode (Guest) - Strictly Dark
        if (account?.accountType === AccountType.GUEST && difficulty === 'hard') {
            return; 
        }
        setIsLightMode(prev => !prev);
    };

    const themeClass = isLightMode ? 'theme-light' : 'theme-dark';

    return (
        <ThemeContext.Provider value={{ isLightMode, toggleTheme, themeClass }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

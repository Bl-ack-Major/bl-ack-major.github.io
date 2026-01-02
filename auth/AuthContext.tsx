import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, AccountType } from './accountTypes';

interface AuthContextType {
    account: Account | null;
    login: (type: AccountType, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        const savedAuth = sessionStorage.getItem('auth_session');
        if (savedAuth) {
            setAccount(JSON.parse(savedAuth));
        }
    }, []);

    const login = (type: AccountType, username: string) => {
        let displayName = username.charAt(0).toUpperCase() + username.slice(1);
        
        if (username === 'keamo') {
            displayName = 'Keamo Motlhamme';
        }

        const newAccount: Account = {
            username,
            accountType: type,
            displayName: displayName,
            loginTime: new Date().toISOString()
        };
        setAccount(newAccount);
        sessionStorage.setItem('auth_session', JSON.stringify(newAccount));
    };

    const logout = () => {
        setAccount(null);
        sessionStorage.removeItem('auth_session');
    };

    return (
        <AuthContext.Provider value={{ account, login, logout, isAuthenticated: !!account }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
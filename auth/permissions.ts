import { AppId } from '../types';
import { AccountType } from './accountTypes';

const GUEST_APPS = [
    AppId.README, 
    AppId.ABOUT, 
    AppId.RESUME, 
    AppId.CONTACT, 
    AppId.TERMINAL, 
    AppId.PROJECTS, 
    AppId.LEARNING,
    AppId.BLOG,
    AppId.WIRESHARK,
    AppId.SYSTEM_LOGS,
    AppId.DEV_NOTES,
    AppId.SOURCE_VIEWER,
    AppId.QUESTS 
];

// Recruiter gets a curated list: Professional info + Tech Showcases
const RECRUITER_APPS = [
    AppId.README,
    AppId.ABOUT,
    AppId.RESUME,
    AppId.CONTACT,
    AppId.PROJECTS,
    AppId.LEARNING,
    AppId.BLOG,
    AppId.HIRE_ME,
    AppId.CAREER,
    AppId.TOOLS,
    AppId.PORTFOLIO_META,
    AppId.CTF,
    AppId.HOME_LAB,
    AppId.SYS_MONITOR,
    AppId.TERMINAL 
];

const ADMIN_APPS = Object.values(AppId).filter(id => id !== AppId.QUESTS);

export const hasPermission = (appId: AppId, accountType: AccountType): boolean => {
    if (accountType === AccountType.ADMINISTRATOR) return ADMIN_APPS.includes(appId);
    if (accountType === AccountType.RECRUITER) return RECRUITER_APPS.includes(appId);
    return GUEST_APPS.includes(appId);
};

export const getAvailableCommands = (accountType: AccountType): string[] => {
    const common = ['help', 'clear', 'exit', 'man'];
    
    // GUEST: Very limited + Challenge commands
    if (accountType === AccountType.GUEST) {
        return [
            ...common,
            'ls', 'pwd', 'whoami', 'date', 'cat', 'hint', 
            'cmatrix', 
            'decode64', 'ascii', 'charat', 'string'
        ];
    }
    
    // RECRUITER: Professional commands + standard shell exploration
    if (accountType === AccountType.RECRUITER) {
        return [
            ...common,
            'ls', 'pwd', 'whoami', 'date', 'cat',
            'resume', 'experience', 'skills', 'projects', 'certifications'
        ];
    }
    
    // ADMIN: Everything
    return [
        ...common,
        'ls', 'pwd', 'whoami', 'date', 'history', 'cat', 
        'resume', 'experience', 'skills', 'projects', 'certifications',
        'nmap', 'gemini', 'msfconsole', 'searchsploit', 'john', 'aircrack-ng', 
        'cowsay', 'sl', 'cmatrix', 'timezone', 'location',
        'decode64', 'ascii', 'charat'
    ];
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Quest, Reward, QuestActionType } from '../types';
import { useToast } from '../components/ToastNotification';
import { SOUND_KEYS } from '../constants';
import { useSound } from './SoundContext';
import { useAuth } from '../auth/AuthContext';
import { useChallenge } from './ChallengeContext';
import { AccountType } from '../auth/accountTypes';
import { usePersistence } from '../hooks/usePersistence';

// --- DATA DEFINITIONS ---

const INITIAL_QUESTS: Quest[] = [
    // --- MAIN STORY (CTF Path) ---
    {
        id: 'story_f1',
        title: 'Fragment 1: The Leak',
        description: 'Locate the Base64 string in System Logs and decode it using the terminal (decode64).',
        xp: 250,
        requirements: [{ type: 'CTF_PROGRESS', target: 'FRAGMENT_1', count: 1 }],
        isCompleted: false,
        progress: 0,
        category: 'Main Story'
    },
    {
        id: 'story_f2',
        title: 'Fragment 2: The Cipher',
        description: 'Find the ASCII codes in Dev Notes and convert them to text (ascii).',
        xp: 250,
        requirements: [{ type: 'CTF_PROGRESS', target: 'FRAGMENT_2', count: 1 }],
        isCompleted: false,
        progress: 0,
        category: 'Main Story'
    },
    {
        id: 'story_f3',
        title: 'Fragment 3: The Logic',
        description: 'Analyze Source Viewer code and extract the password substring (charat).',
        xp: 250,
        requirements: [{ type: 'CTF_PROGRESS', target: 'FRAGMENT_3', count: 1 }],
        isCompleted: false,
        progress: 0,
        category: 'Main Story'
    },
    {
        id: 'story_f4',
        title: 'Fragment 4: The Network',
        description: 'Intercept packet 24 in Wireshark and decode the Authorization header string using terminal (decode64).',
        xp: 300,
        requirements: [{ type: 'CTF_PROGRESS', target: 'FRAGMENT_4', count: 1 }],
        isCompleted: false,
        progress: 0,
        category: 'Main Story'
    },
    {
        id: 'story_root',
        title: 'Root Access',
        description: 'Combine the fragments to log in as the Administrator (keamo).',
        xp: 1000,
        requirements: [{ type: 'CTF_PROGRESS', target: 'ROOT_ACCESS', count: 1 }],
        isCompleted: false,
        progress: 0,
        category: 'Main Story'
    },

    // --- SIDE OPS (Exploration) ---
    {
        id: 'side_term',
        title: 'Script Kiddie',
        description: 'Execute 5 different commands in the Terminal.',
        xp: 50,
        requirements: [{ type: 'TERMINAL_CMD', count: 5 }],
        isCompleted: false,
        progress: 0,
        category: 'Side Op'
    },
    {
        id: 'side_explorer',
        title: 'Reconnaissance',
        description: 'Open 5 different applications to map the system.',
        xp: 75,
        requirements: [{ type: 'APP_OPEN', count: 5 }],
        isCompleted: false,
        progress: 0,
        category: 'Side Op'
    },
    {
        id: 'side_packet',
        title: 'Traffic Watcher',
        description: 'Inspect 3 distinct network packets in Wireshark.',
        xp: 100,
        requirements: [{ type: 'WIRESHARK_INSPECT', count: 3 }],
        isCompleted: false,
        progress: 0,
        category: 'Side Op'
    },
    {
        id: 'side_files',
        title: 'Data Miner',
        description: 'Read the contents of 3 different files in the system.',
        xp: 75,
        requirements: [{ type: 'FILE_READ', count: 3 }],
        isCompleted: false,
        progress: 0,
        category: 'Side Op'
    }
];

const REWARDS_LIST: Reward[] = [
    { id: 'r_lvl2', title: 'Neon Night Wallpapers', description: 'Unlocks a set of high-contrast cyberpunk wallpapers.', unlockLevel: 2, type: 'wallpaper', isClaimed: false },
    { id: 'r_lvl3', title: 'Matrix Protocol', description: 'Unlocks the `cmatrix` command in terminal.', unlockLevel: 3, type: 'theme', isClaimed: false },
    { id: 'r_lvl4', title: 'Encrypted Dossier', description: 'Decrypts a hidden file in Documents containing secret project data.', unlockLevel: 4, type: 'file', isClaimed: false },
    { id: 'r_lvl5', title: 'Root Certification', description: 'Awarded the "System Owned" digital certificate.', unlockLevel: 5, type: 'badge', isClaimed: false },
];

const XP_PER_LEVEL = 250;
const MAX_LEVEL = 5;

// --- CONTEXT ---

interface QuestState {
    quests: Quest[];
    rewards: Reward[];
    xp: number;
    level: number;
    // Store history as arrays of strings for easy serialization
    history: Record<string, string[]>;
}

const INITIAL_STATE: QuestState = {
    quests: INITIAL_QUESTS,
    rewards: REWARDS_LIST,
    xp: 0,
    level: 1,
    history: {
        'TERMINAL_CMD': [],
        'APP_OPEN': [],
        'WIRESHARK_INSPECT': [],
        'GEMINI_ANALYZE': [],
        'FILE_READ': [],
        'CTF_PROGRESS': [],
    }
};

interface QuestContextType {
    quests: Quest[];
    rewards: Reward[];
    xp: number;
    level: number;
    showLevelUp: number | null;
    trackEvent: (type: QuestActionType, data?: string) => void;
    claimReward: (rewardId: string) => void;
    acknowledgeLevelUp: () => void;
    recentAction: string | null;
    resetProgress: () => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Integrated Persistence Hook
    const [state, setState, isLoaded] = usePersistence<QuestState>('kali_quest_state_v6', INITIAL_STATE);
    
    const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
    const [recentAction, setRecentAction] = useState<string | null>(null);

    const { addNotification } = useToast();
    const { playSound } = useSound();
    const { account } = useAuth();
    const { difficulty } = useChallenge();

    const acknowledgeLevelUp = () => {
        setShowLevelUp(null);
    };

    const resetProgress = () => {
        setState(INITIAL_STATE);
        addNotification("Quest progress has been reset.", "info");
    };

    const trackEvent = useCallback((type: QuestActionType, data: string = 'generic') => {
        // Only track events if the user is a Guest in Hacker Mode
        if (!account || account.accountType !== AccountType.GUEST || difficulty !== 'hard') {
            return;
        }
        
        // Safety check if state isn't loaded yet
        if (!state) return;

        // Check if this specific action data has already been recorded
        const currentHistory = state.history[type] || [];
        if (currentHistory.includes(data)) return;

        setRecentAction(`${type}: ${data}`);

        // Prepare new state calculation
        let xpGained = 0;
        const newlyCompletedQuests: Quest[] = [];
        const newHistory = { ...state.history, [type]: [...currentHistory, data] };

        const updatedQuests = state.quests.map(quest => {
            if (quest.isCompleted) return quest;

            const req = quest.requirements.find(r => r.type === type);
            if (!req) return quest;

            // If target is specified, match it. Otherwise count any action of this type.
            if (req.target && req.target !== data) return quest;

            const newProgress = quest.progress + 1;
            
            if (newProgress >= req.count) {
                xpGained += quest.xp;
                const completedQuest = { ...quest, progress: newProgress, isCompleted: true };
                newlyCompletedQuests.push(completedQuest);
                return completedQuest;
            }

            return { ...quest, progress: newProgress };
        });

        // If no changes, update history only
        if (newlyCompletedQuests.length === 0 && xpGained === 0) {
             setState({ ...state, history: newHistory });
             return;
        }

        // Handle XP and Level Up
        const newXp = state.xp + xpGained;
        const newLevel = Math.min(Math.floor(newXp / XP_PER_LEVEL) + 1, MAX_LEVEL);
        
        // Update State via Persistence Hook
        setState({
            ...state,
            quests: updatedQuests,
            history: newHistory,
            xp: newXp,
            level: newLevel
        });

        // Notifications
        if (newlyCompletedQuests.length > 0) {
            newlyCompletedQuests.forEach(q => {
                addNotification(
                    <span>
                        <span className="block text-xs uppercase font-bold text-yellow-500 mb-1 tracking-wider">
                            {q.category === 'Main Story' ? 'MISSION ACCOMPLISHED' : 'OBJECTIVE COMPLETE'}
                        </span>
                        <span className="block text-sm">
                            Congratulations! You've been awarded <strong className="text-cyan-400">{q.xp} XP</strong> for <strong>{q.title}</strong>.
                        </span>
                    </span>, 
                    'quest'
                );
            });
            playSound(SOUND_KEYS.UI_CLICK);
        }

        if (newLevel > state.level) {
            setTimeout(() => {
                setShowLevelUp(newLevel);
                playSound(SOUND_KEYS.LOGIN); 
            }, 1000);
        }

    }, [state, setState, addNotification, playSound, account, difficulty]);

    const claimReward = (rewardId: string) => {
        if (!state) return;
        
        const updatedRewards = state.rewards.map(r => {
            if (r.id === rewardId && !r.isClaimed && state.level >= r.unlockLevel) {
                if (r.type === 'file') {
                    addNotification("Encrypted Dossier decrypted in /home/keamo/Documents", 'success');
                } else if (r.type === 'theme') {
                    addNotification("Matrix Protocol enabled. Type 'cmatrix' in Terminal.", 'success');
                } else if (r.type === 'wallpaper') {
                    addNotification("Neon Night Wallpapers added to collection.", 'success');
                } else if (r.type === 'badge') {
                    addNotification("System Ownership Verified.", 'success');
                }
                return { ...r, isClaimed: true };
            }
            return r;
        });

        setState({ ...state, rewards: updatedRewards });
    };

    return (
        <QuestContext.Provider value={{ 
            quests: state?.quests || INITIAL_QUESTS, 
            rewards: state?.rewards || REWARDS_LIST, 
            xp: state?.xp || 0, 
            level: state?.level || 1, 
            showLevelUp, 
            trackEvent, 
            claimReward, 
            acknowledgeLevelUp, 
            recentAction,
            resetProgress
        }}>
            {children}
        </QuestContext.Provider>
    );
};

export const useQuest = () => {
    const context = useContext(QuestContext);
    if (context === undefined) {
        throw new Error('useQuest must be used within a QuestProvider');
    }
    return context;
};

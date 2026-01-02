
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ToastNotification';
import { useSound } from './SoundContext';
import { SOUND_KEYS } from '../constants';

// --- TYPES ---

export interface NarrativeClue {
    id: string;
    chapter: number;
    title: string;
    description: string;
    source: 'terminal' | 'wireshark' | 'files' | 'logs';
    trigger: string; // The specific string/id that triggers discovery
    discovered: boolean;
    narrativeText: string; // Flavor text shown upon discovery
}

export interface Chapter {
    id: number;
    title: string;
    description: string;
    isUnlocked: boolean;
    isCompleted: boolean;
}

interface NarrativeContextType {
    currentChapter: number;
    chapters: Chapter[];
    clues: NarrativeClue[];
    discoverClue: (trigger: string, source: NarrativeClue['source']) => void;
    checkFlag: (flag: string) => boolean;
    progress: number; // 0-100 for current chapter
}

// --- STORY CONTENT (CHAPTERS 2 & 3 WRITTEN HERE) ---

const INITIAL_CHAPTERS: Chapter[] = [
    {
        id: 1,
        title: "The Leak",
        description: "Initial breach detection. Anomalies found in system logs suggesting unauthorized access.",
        isUnlocked: true,
        isCompleted: false
    },
    {
        id: 2,
        title: "The Insider",
        description: "Trace the internal actor. Investigate developer notes and hidden configurations to identify the compromised account.",
        isUnlocked: false,
        isCompleted: false
    },
    {
        id: 3,
        title: "The Exfiltration",
        description: "Follow the data. Analyze network traffic to find where the stolen assets were sent and neutralize the session.",
        isUnlocked: false,
        isCompleted: false
    }
];

const INITIAL_CLUES: NarrativeClue[] = [
    // --- CHAPTER 1: The Leak (Existing CTF logic mapped to Narrative) ---
    {
        id: 'c1_log_base64',
        chapter: 1,
        title: 'Encoded Entry',
        description: 'Found suspicious Base64 string in System Logs.',
        source: 'logs',
        trigger: 'eU91SGF2', // Matches fragment 1
        discovered: false,
        narrativeText: "⚠️ ANOMALY DETECTED: System logs contain an obfuscated Base64 payload. This isn't a standard error code."
    },
    
    // --- CHAPTER 2: The Insider (New Content) ---
    {
        id: 'c2_phantom_user',
        chapter: 2,
        title: 'Ghost Login',
        description: 'Identified unauthorized sudo access at 03:00 AM.',
        source: 'logs',
        trigger: 'dev_ops_phantom',
        discovered: false,
        narrativeText: "🔍 FORENSIC ALERT: User 'dev_ops_phantom' executed elevated commands during off-hours. This account was supposed to be disabled."
    },
    {
        id: 'c2_hidden_config',
        chapter: 2,
        title: 'Encrypted Config',
        description: 'Located hidden configuration file with ROT13 encryption.',
        source: 'files',
        trigger: 'shadow_protocol.conf',
        discovered: false,
        narrativeText: "📂 ASSET RECOVERY: A hidden file '.shadow_protocol.conf' was found. The content appears to be a ROT13 cipher."
    },

    // --- CHAPTER 3: The Exfiltration (New Content) ---
    {
        id: 'c3_ftp_packet',
        chapter: 3,
        title: 'Data Stream',
        description: 'Intercepted FTP STOR command in Wireshark.',
        source: 'wireshark',
        trigger: '1337', // Packet ID
        discovered: false,
        narrativeText: "📡 TRAFFIC INTERCEPT: Large outbound FTP transfer detected on port 21. Filename: 'project_omega_source.zip'."
    },
    {
        id: 'c3_final_report',
        chapter: 3,
        title: 'Incident Report',
        description: 'Submission of final analysis via terminal.',
        source: 'terminal',
        trigger: 'submit-report',
        discovered: false,
        narrativeText: "✅ CAMPAIGN COMPLETE: Incident report filed. The breach has been contained and the actor identified. Excellent work, Analyst."
    }
];

const NarrativeContext = createContext<NarrativeContextType | undefined>(undefined);

export const NarrativeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
    const [clues, setClues] = useState<NarrativeClue[]>(INITIAL_CLUES);
    const { addNotification } = useToast();
    const { playSound } = useSound();

    // Persistence Loading
    useEffect(() => {
        const saved = localStorage.getItem('kali_narrative_v1');
        if (saved) {
            const parsed = JSON.parse(saved);
            setChapters(parsed.chapters);
            setClues(parsed.clues);
        }
    }, []);

    // Persistence Saving
    useEffect(() => {
        localStorage.setItem('kali_narrative_v1', JSON.stringify({ chapters, clues }));
    }, [chapters, clues]);

    const currentChapter = chapters.find(c => c.isUnlocked && !c.isCompleted)?.id || (chapters.every(c => c.isCompleted) ? 4 : 1);

    const discoverClue = useCallback((trigger: string, source: NarrativeClue['source']) => {
        setClues(prev => {
            const clueIndex = prev.findIndex(c => c.trigger === trigger && c.source === source && !c.discovered);
            
            // Only discover clues for the current or previous chapters (linear progression)
            if (clueIndex !== -1 && prev[clueIndex].chapter <= currentChapter) {
                const newClues = [...prev];
                newClues[clueIndex] = { ...newClues[clueIndex], discovered: true };
                
                // Trigger effects
                playSound(SOUND_KEYS.UI_CLICK); // Unique sound ideal here
                addNotification(newClues[clueIndex].narrativeText, 'quest');

                // Check for chapter completion
                const chapterClues = newClues.filter(c => c.chapter === newClues[clueIndex].chapter);
                if (chapterClues.every(c => c.discovered)) {
                   completeChapter(newClues[clueIndex].chapter);
                }

                return newClues;
            }
            return prev;
        });
    }, [currentChapter, addNotification, playSound]);

    const completeChapter = (chapterId: number) => {
        setChapters(prev => prev.map(c => {
            if (c.id === chapterId) return { ...c, isCompleted: true };
            if (c.id === chapterId + 1) return { ...c, isUnlocked: true };
            return c;
        }));
        
        playSound(SOUND_KEYS.LOGIN);
        setTimeout(() => {
            const nextTitle = INITIAL_CHAPTERS.find(c => c.id === chapterId + 1)?.title || "Campaign Complete";
            addNotification(`CHAPTER ${chapterId} COMPLETE. Unlocking: ${nextTitle}`, 'success');
        }, 1000);
    };

    const checkFlag = (flag: string) => {
        // Simple flag checker for terminal interaction
        if (currentChapter === 2 && flag === "insider_tim3") {
            discoverClue("shadow_protocol.conf", "files"); // Alternate trigger method
            return true;
        }
        return false;
    };

    // Calculate progress for HUD
    const chapterClues = clues.filter(c => c.chapter === currentChapter);
    const discoveredCount = chapterClues.filter(c => c.discovered).length;
    const progress = chapterClues.length > 0 ? (discoveredCount / chapterClues.length) * 100 : 0;

    return (
        <NarrativeContext.Provider value={{ currentChapter, chapters, clues, discoverClue, checkFlag, progress }}>
            {children}
        </NarrativeContext.Provider>
    );
};

export const useNarrative = () => {
    const context = useContext(NarrativeContext);
    if (context === undefined) {
        throw new Error('useNarrative must be used within a NarrativeProvider');
    }
    return context;
};

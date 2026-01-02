
import React, { useEffect, useState } from 'react';
import { ChevronRight, Lock, Unlock, Zap, Terminal, Crown, Shield, Star, Sparkles } from 'lucide-react';
import { useQuest } from '../contexts/QuestContext';

// --- CANDY THEME CONFIGURATION ---
const CANDY_THEMES: Record<number, {
    label: string;
    icon: React.ReactNode;
    primaryColor: string; // Text/Icon color
    gradientBorder: string; // The border gradient
    glowColor: string; // The shadow/glow color
    bgGradient: string; // Subtle internal gradient
}> = {
    2: {
        label: "INITIATE",
        icon: <Zap size={32} />,
        primaryColor: "text-cyan-400",
        gradientBorder: "from-cyan-400 via-blue-500 to-cyan-400",
        glowColor: "shadow-cyan-500/40",
        bgGradient: "from-cyan-500/20 to-blue-600/10"
    },
    3: {
        label: "OPERATOR",
        icon: <Terminal size={32} />,
        primaryColor: "text-emerald-400",
        gradientBorder: "from-emerald-400 via-green-500 to-teal-400",
        glowColor: "shadow-emerald-500/40",
        bgGradient: "from-emerald-500/20 to-green-600/10"
    },
    4: {
        label: "SPECIALIST",
        icon: <Star size={32} />,
        primaryColor: "text-fuchsia-400",
        gradientBorder: "from-fuchsia-400 via-pink-500 to-purple-400",
        glowColor: "shadow-fuchsia-500/40",
        bgGradient: "from-fuchsia-500/20 to-purple-600/10"
    },
    5: {
        label: "ROOT ACCESS",
        icon: <Crown size={32} />,
        primaryColor: "text-red-500",
        gradientBorder: "from-red-500 via-orange-500 to-rose-500",
        glowColor: "shadow-red-500/40",
        bgGradient: "from-red-500/20 to-orange-600/10"
    }
};

const LevelUpModal: React.FC = () => {
    const { showLevelUp, acknowledgeLevelUp, rewards } = useQuest();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fix: Suppress Level 5 (Root Access) modal to avoid conflict with AdminWelcomeModal
        // We auto-acknowledge it so the state clears, but we don't show this UI.
        if (showLevelUp === 5) {
            acknowledgeLevelUp();
            return;
        }

        if (showLevelUp) {
            // Slight delay for mounting animation
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [showLevelUp, acknowledgeLevelUp]);

    // Don't render anything if level is 5 (handled by AdminWelcomeModal) or if no level up
    if (!showLevelUp || showLevelUp === 5) return null;

    const theme = CANDY_THEMES[showLevelUp] || CANDY_THEMES[2];
    const unlockedRewards = rewards.filter(r => r.unlockLevel === showLevelUp);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Soft Blur Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={acknowledgeLevelUp} // Click outside to close
            />

            {/* Main Glass Card */}
            <div 
                className={`
                    relative w-[340px] rounded-[30px] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) p-[2px]
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'}
                `}
            >
                {/* Rotating Border Gradient Layer */}
                <div className={`absolute inset-0 rounded-[30px] bg-gradient-to-br ${theme.gradientBorder} animate-spin-linear opacity-50 blur-sm`}></div>
                
                {/* Glassmorphism Container */}
                <div className="relative bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 rounded-[28px] flex flex-col items-center p-6 overflow-hidden w-full shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                    
                    {/* Glossy Reflection (Sheen) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>

                    {/* Internal Ambient Tint */}
                    <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${theme.bgGradient} opacity-60 pointer-events-none`}></div>
                    
                    {/* Level Badge */}
                    <div className="relative mt-2 mb-4">
                        <div className={`w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-black/30 backdrop-blur-md shadow-xl ${theme.glowColor} relative z-10`}>
                            <span className={`text-4xl font-black italic tracking-tighter ${theme.primaryColor} drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]`}>
                                {showLevelUp}
                            </span>
                        </div>
                        {/* Orbiting particles */}
                        <div className="absolute inset-0 animate-spin-reverse-linear">
                            <div className={`w-2 h-2 rounded-full ${theme.primaryColor.replace('text', 'bg')} absolute top-0 left-1/2 -translate-x-1/2 blur-[1px] shadow-[0_0_8px_currentColor]`}></div>
                        </div>
                    </div>

                    {/* Text Header */}
                    <div className="text-center mb-6 relative z-10">
                        <h2 className="text-white font-bold text-2xl tracking-tight flex items-center justify-center gap-2 drop-shadow-lg">
                            LEVEL UP <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                        </h2>
                        <div className={`text-xs font-bold tracking-[0.3em] uppercase ${theme.primaryColor} mt-1 drop-shadow-sm`}>
                            {theme.label}
                        </div>
                    </div>

                    {/* Rewards Pill */}
                    <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 mb-6 relative z-10 backdrop-blur-sm shadow-inner">
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 text-center">Unlocks Acquired</div>
                        
                        <div className="space-y-3">
                            {unlockedRewards.length > 0 ? (
                                unlockedRewards.map((reward, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-center gap-3 bg-white/5 p-2 rounded-xl animate-in slide-in-from-bottom-2 fade-in duration-500 border border-white/5"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    >
                                        <div className={`p-2 rounded-full bg-black/40 ${theme.primaryColor}`}>
                                            {theme.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-white truncate">{reward.title}</div>
                                            <div className="text-[9px] text-gray-400 font-mono uppercase">{reward.type}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-xs text-gray-500 italic py-2">
                                    System Privileges Escalated
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={acknowledgeLevelUp}
                        className={`
                            relative group w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white overflow-hidden transition-all
                            hover:scale-[1.02] active:scale-95 shadow-lg
                        `}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientBorder} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                        {/* Button Gloss */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></div>
                        
                        <span className="relative z-10 flex items-center justify-center gap-2 text-white drop-shadow-md">
                            Continue <ChevronRight size={16} />
                        </span>
                    </button>

                </div>
            </div>

            <style>{`
                @keyframes spin-linear {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse-linear {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-spin-linear {
                    animation-name: spin-linear;
                    animation-duration: 8s;
                    animation-timing-function: linear !important;
                    animation-iteration-count: infinite;
                }
                .animate-spin-reverse-linear {
                    animation-name: spin-reverse-linear;
                    animation-duration: 12s;
                    animation-timing-function: linear !important;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
};

export default LevelUpModal;

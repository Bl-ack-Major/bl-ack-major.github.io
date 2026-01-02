
import React from 'react';
import { Briefcase, Terminal, ChevronRight, Wifi, Command, Cpu, Lock, Zap } from 'lucide-react';
import { useChallenge } from '../contexts/ChallengeContext';
import { useSound } from '../contexts/SoundContext';
import { SOUND_KEYS } from '../constants';

interface WelcomeModalProps {
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    const { setDifficulty } = useChallenge();
    const { playSound } = useSound();

    const handleSelectMode = (mode: 'casual' | 'hard') => {
        playSound(SOUND_KEYS.CLICK);
        setDifficulty(mode);
        onClose();
        if (mode === 'hard') {
            setTimeout(() => playSound(SOUND_KEYS.LOGIN), 500);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] grid place-items-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            {/* Ambient Background Effects (Chromomorphism) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none overflow-visible fixed">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] mix-blend-screen -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Main Window Container */}
            <div className={`
                relative w-full max-w-5xl bg-[#0d1117]/60 backdrop-blur-2xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] flex flex-col md:flex-row
                ${window.innerWidth < 768 ? 'h-auto min-h-[500px] overflow-visible rounded-xl my-8' : 'h-[650px] max-h-[90vh] overflow-hidden rounded-3xl'}
            `}>

                {/* Traffic Lights (Mac Style Decoration) */}
                <div className="absolute top-5 left-5 z-50 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>

                {/* Left Sidebar - System Identity */}
                <div className="w-full md:w-80 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 flex flex-col relative shrink-0">
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center pt-16 md:pt-8">
                        <div className="relative mb-4 md:mb-8 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full blur-[25px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                            <img
                                src="/images/icons/kali-logo.svg"
                                alt="Kali Logo"
                                className="w-20 h-20 md:w-32 md:h-32 relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">KaliOS <span className="font-light text-gray-400">Web</span></h2>
                        <div className="text-[10px] font-mono text-gray-500 space-y-2 mt-4 md:mt-6 border-t border-white/5 pt-4 md:pt-6 w-full text-left max-w-xs md:max-w-none mx-auto">
                            <p className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><Cpu size={10} /> KERNEL</span>
                                <span className="text-blue-400 bg-blue-900/20 px-1.5 rounded">5.18.0-kali</span>
                            </p>
                            <p className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><Command size={10} /> BUILD</span>
                                <span className="text-purple-400 bg-purple-900/20 px-1.5 rounded">2025.1</span>
                            </p>
                            <p className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><Zap size={10} /> UPTIME</span>
                                <span className="text-green-400 bg-green-900/20 px-1.5 rounded">00:00:01</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/5 hidden md:block">
                        <p className="text-[10px] text-gray-400 leading-relaxed text-center font-mono opacity-60">
                            "The quieter you become, the more you are able to hear."
                        </p>
                    </div>
                </div>

                {/* Right Content - Experience Selection */}
                <div className="flex-1 flex flex-col relative bg-gradient-to-br from-white/5 to-transparent overflow-y-auto">
                    {/* Top Bar Area */}
                    <div className="h-14 border-b border-white/5 flex items-center justify-end px-6 shrink-0 bg-white/[0.02]">
                        <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
                            <Wifi size={12} className="text-green-500" /> Connected
                        </span>
                    </div>

                    <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                        <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">System Initialization</h1>
                            <p className="text-sm md:text-lg text-gray-400 font-light">Select your preferred operating environment.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6">
                            {/* Option 1: Casual */}
                            <button
                                onClick={() => handleSelectMode('casual')}
                                className="group relative flex flex-col bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 md:p-6 transition-all duration-300 text-left overflow-hidden shadow-lg hover:shadow-cyan-900/20 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[200px]"
                                style={{ animationDelay: '100ms' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                        <Briefcase className="text-cyan-400" size={24} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                                        Casual Mode
                                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity">GUI</span>
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-6 group-hover:text-gray-300">
                                        Observe my portfolio. Includes access to my projects, CTF, and certificate-related information.
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        Launch Environment <ChevronRight size={14} />
                                    </div>
                                </div>
                            </button>

                            {/* Option 2: Hacker */}
                            <button
                                onClick={() => handleSelectMode('hard')}
                                className="group relative flex flex-col bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 rounded-2xl p-5 md:p-6 transition-all duration-300 text-left overflow-hidden shadow-lg hover:shadow-red-900/20 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[200px]"
                                style={{ animationDelay: '200ms' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex-1 flex flex-col">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                        <Terminal className="text-red-400" size={24} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors flex items-center gap-2">
                                        Hacker Mode
                                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity">CLI</span>
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-6 group-hover:text-gray-300">
                                        Enter a challenge where you participate in gaining administrator access.
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        Initialize Shell <ChevronRight size={14} />
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="h-12 border-t border-white/5 flex items-center justify-between px-8 bg-black/20 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                            <span className="text-[10px] font-mono text-gray-500">SYSTEM_READY</span>
                        </div>
                        <div className="text-[10px] text-gray-600 flex items-center gap-2 font-mono">
                            <Lock size={10} /> <span>SECURE_BOOT_ENABLED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;

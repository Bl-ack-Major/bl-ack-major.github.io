
import React, { useEffect, useState, useRef } from 'react';
import { X, ArrowDown, Sparkles, Terminal, Briefcase, Shield, ChevronRight, Cpu, Zap, Command } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DesktopWelcomeProps {
    onClose: () => void;
}

const DesktopWelcome: React.FC<DesktopWelcomeProps> = ({ onClose }) => {
    const [visible, setVisible] = useState(false);
    const { isLightMode } = useTheme();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Enhanced Theme Variables
    const cardBg = isLightMode
        ? 'bg-white/90 backdrop-blur-3xl border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
        : 'bg-[#0d1117]/80 backdrop-blur-3xl border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]';

    const textColorMain = isLightMode ? 'text-slate-900' : 'text-white';
    const textColorSec = isLightMode ? 'text-slate-600' : 'text-gray-400';

    const iconContainer = isLightMode
        ? 'bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 border-white/80 shadow-lg'
        : 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]';

    const headerBg = isLightMode ? 'bg-slate-50/80 border-slate-200/50' : 'bg-white/5 border-white/5';

    return (
        <>
            {!isLightMode && <div className="screen-vignette" />}

            {/* Outer Container with Chromomorphism Background Effects */}
            <div
                ref={wrapperRef}
                className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[95%] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
            >
                {/* Chromomorphic Background Blobs */}
                <div className="absolute -inset-8 pointer-events-none overflow-visible">
                    <div className={`absolute top-0 left-0 w-40 h-40 rounded-full blur-[60px] animate-pulse ${isLightMode ? 'bg-cyan-300/40' : 'bg-cyan-500/20'}`} style={{ animationDuration: '4s' }} />
                    <div className={`absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[60px] animate-pulse ${isLightMode ? 'bg-purple-300/40' : 'bg-purple-500/20'}`} style={{ animationDuration: '6s' }} />
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[50px] ${isLightMode ? 'bg-blue-300/30' : 'bg-blue-500/15'}`} />
                </div>

                {/* Animated Gradient Border */}
                <div className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 ${isLightMode ? 'opacity-40' : 'opacity-60'}`} style={{ backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite' }} />
                <div className={`absolute -inset-[1px] rounded-3xl ${isLightMode ? 'bg-white/95' : 'bg-[#0a0a0a]/95'}`} />

                {/* Main Glass Card */}
                <div className={`relative rounded-3xl border overflow-hidden ${cardBg}`}>

                    {/* Top Gloss Shine Effect */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                    {/* Header Bar with Traffic Lights */}
                    <div className={`flex items-center justify-between px-5 py-3 border-b ${headerBg}`}>
                        <div className="flex items-center gap-3">
                            {/* Mac-style Traffic Lights */}
                            <div className="flex gap-1.5">
                                <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:brightness-110 transition-all" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isLightMode ? 'text-slate-400' : 'text-gray-400'}`}>Session Active</span>
                            </div>
                        </div>
                        <div className={`text-[10px] font-mono ${isLightMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            v2025.1
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6">
                        {/* Logo & Title Section */}
                        <div className="flex items-start gap-4 mb-5">
                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center p-2.5 shrink-0 group-hover:scale-110 transition-transform ${iconContainer}`}>
                                <img
                                    src="/images/icons/kali-boot-logo.svg"
                                    alt="Kali"
                                    className={`w-full h-full object-contain ${isLightMode ? 'opacity-90' : 'invert opacity-90 drop-shadow-md'}`}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${textColorMain}`}>
                                    Welcome to my Portfolio
                                    <Sparkles size={16} className={`${isLightMode ? 'text-amber-500' : 'text-amber-400'} animate-pulse`} />
                                </h3>
                                <p className={`text-xs mt-1 flex items-center gap-1.5 ${textColorSec}`}>
                                    <Shield size={10} className={isLightMode ? 'text-emerald-600' : 'text-emerald-400'} />
                                    Security Engineer • Entry Level
                                </p>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-2 gap-2.5 mb-5">
                            <div className={`relative group p-3 rounded-xl border transition-all ${isLightMode ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100 hover:border-cyan-300' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-cyan-500/30'}`}>
                                <Briefcase size={16} className={`mb-2 ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`} />
                                <p className={`text-xs font-semibold ${textColorMain}`}>Resume</p>
                                <p className={`text-[10px] mt-0.5 ${textColorSec}`}>On Desktop</p>
                            </div>
                            <div className={`relative group p-3 rounded-xl border transition-all ${isLightMode ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:border-purple-300' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-purple-500/30'}`}>
                                <Terminal size={14} className={`mb-2 ${isLightMode ? 'text-purple-600' : 'text-purple-400'}`} />
                                <p className={`text-xs font-semibold ${textColorMain}`}>Start Menu</p>
                                <p className={`text-[10px] mt-0.5 ${textColorSec}`}>Full Access</p>
                            </div>
                        </div>

                        {/* System Info Bar */}
                        <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-5 ${isLightMode ? 'bg-slate-100/80 border border-slate-200/50' : 'bg-black/30 border border-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-mono flex items-center gap-1 ${isLightMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <Cpu size={9} /> KALI-SEC
                                </span>
                                <span className={`text-[9px] font-mono flex items-center gap-1 ${isLightMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                    <Command size={9} /> 2025.1
                                </span>
                            </div>
                            <span className={`text-[9px] font-mono flex items-center gap-1 ${isLightMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                <Zap size={9} /> Online
                            </span>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={onClose}
                            className={`w-full group relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all overflow-hidden ${isLightMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300' : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/30 hover:shadow-xl hover:shadow-cyan-800/40'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="relative">Start Exploration</span>
                            <ChevronRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Arrow Indicator */}
                        <div className="flex justify-center mt-4">
                            <ArrowDown className={`animate-bounce ${isLightMode ? 'text-slate-400' : 'text-gray-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]'}`} size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add keyframes for gradient animation */}
            <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
        </>
    );
};

export default DesktopWelcome;


import React, { useEffect, useState } from 'react';
import { ChevronRight, Crown, Sparkles } from 'lucide-react';

interface AdminWelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminWelcomeModal: React.FC<AdminWelcomeModalProps> = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Theme: Root Access (Red/Orange)
    const theme = {
        primaryColor: "text-red-500",
        gradientBorder: "from-red-500 via-orange-500 to-rose-500",
        glowColor: "shadow-red-500/40",
        // Using radial gradient to prevent linear split lines
        bgGradient: "radial-gradient(circle at top, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 50%, transparent 100%)"
    };

    return (
        <div className="fixed inset-0 z-[10010] flex items-center justify-center">
             {/* Soft Blur Backdrop */}
             <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            
            {/* Main Glass Card */}
            <div
                className={`
                    relative w-[380px] rounded-[30px] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) p-[2px]
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'}
                `}
            >
                {/* Rotating Border Gradient Layer */}
                <div className={`absolute inset-0 rounded-[30px] bg-gradient-to-br ${theme.gradientBorder} animate-admin-spin-linear opacity-50 blur-sm`}></div>

                {/* Glassmorphism Container */}
                <div className="relative bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[28px] flex flex-col items-center p-8 overflow-hidden w-full shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">

                    {/* Glossy Reflection (Sheen) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                    
                    {/* Internal Ambient Tint */}
                    <div 
                        className="absolute inset-0 opacity-60 pointer-events-none"
                        style={{ background: theme.bgGradient }}
                    ></div>

                    {/* Level Badge */}
                    <div className="relative mt-2 mb-6">
                        {/* Removed backdrop-blur to avoid split artifact */}
                        <div className={`w-24 h-24 rounded-full border border-white/20 flex items-center justify-center bg-black/40 shadow-xl ${theme.glowColor} relative z-10`}>
                            <Crown size={48} className={`${theme.primaryColor} drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]`} />
                        </div>
                        {/* Orbiting particles */}
                        <div className="absolute inset-0 animate-admin-spin-reverse-linear">
                            <div className={`w-2 h-2 rounded-full bg-red-500 absolute top-0 left-1/2 -translate-x-1/2 blur-[1px] shadow-[0_0_8px_currentColor]`}></div>
                        </div>
                    </div>

                    {/* Text Header */}
                    <div className="text-center mb-6 relative z-10">
                        <h2 className="text-white font-bold text-3xl tracking-tight flex items-center justify-center gap-2 drop-shadow-lg">
                            ACCESS GRANTED <Sparkles size={20} className="text-yellow-400 animate-pulse" />
                        </h2>
                        <div className={`text-xs font-bold tracking-[0.3em] uppercase ${theme.primaryColor} mt-2 drop-shadow-sm`}>
                            UID 0 (ROOT)
                        </div>
                    </div>

                    {/* Message Pill */}
                    <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 mb-8 relative z-10 shadow-inner text-center">
                        <p className="text-gray-300 text-xs leading-relaxed font-medium">
                            Congratulations, you have root access.
                            <br />
                            <span className="text-gray-500 mt-1 block">Full administrative privileges enabled.</span>
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className={`
                            relative group w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white overflow-hidden transition-all
                            hover:scale-[1.02] active:scale-95 shadow-lg
                        `}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientBorder} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                        {/* Button Gloss */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></div>
                        
                        <span className="relative z-10 flex items-center justify-center gap-2 text-white drop-shadow-md">
                            Initialize System <ChevronRight size={16} />
                        </span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes admin-spin-linear {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes admin-spin-reverse-linear {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-admin-spin-linear {
                    animation-name: admin-spin-linear;
                    animation-duration: 8s;
                    animation-timing-function: linear !important;
                    animation-iteration-count: infinite;
                }
                .animate-admin-spin-reverse-linear {
                    animation-name: admin-spin-reverse-linear;
                    animation-duration: 12s;
                    animation-timing-function: linear !important;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
};

export default AdminWelcomeModal;

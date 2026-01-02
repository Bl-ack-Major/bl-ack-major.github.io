
import React, { useState } from 'react';
import { Send, User, Mail, Hash, Paperclip, Sparkles, CheckCircle, Globe, Linkedin, Github, Instagram, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { RESUME_DATA, SOCIAL_LINKS, SOUND_KEYS } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';
import { useSound } from '../../contexts/SoundContext';

export const ContactMe: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { isLightMode } = useTheme();
    const { playSound } = useSound();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        playSound(SOUND_KEYS.UI_CLICK);
        setIsSending(true);
        
        // Simulating encrypted transmission delay
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            playSound(SOUND_KEYS.LOGIN); // Success chime
            setFormData({ email: '', subject: '', message: '' });
            setTimeout(() => setIsSent(false), 5000);
        }, 2000);
    };

    // --- Dynamic Styling ---
    const theme = {
        bg: isLightMode ? 'bg-[#f6f6f6]' : 'bg-[#1a1a1a]',
        sidebarBg: isLightMode ? 'bg-[#ebebeb]/80' : 'bg-black/20',
        composerBg: isLightMode ? 'bg-white' : 'bg-[#252525]',
        textMain: isLightMode ? 'text-slate-900' : 'text-gray-100',
        textSec: isLightMode ? 'text-slate-500' : 'text-gray-400',
        border: isLightMode ? 'border-slate-200' : 'border-white/5',
        inputBorder: isLightMode ? 'border-slate-100' : 'border-white/5',
        accent: isLightMode ? 'text-blue-600' : 'text-cyan-400',
        accentBg: isLightMode ? 'bg-blue-600' : 'bg-cyan-500',
        glassCard: isLightMode ? 'bg-white/90 border-white shadow-xl' : 'bg-white/5 border-white/10 shadow-2xl',
    };

    return (
        <div className={`h-full w-full flex flex-col md:flex-row overflow-hidden font-sans ${theme.bg} transition-colors duration-500`}>
            
            {/* --- LEFT SIDEBAR: THE DOSSIER (Hidden on Mobile) --- */}
            <aside className={`hidden md:flex w-72 shrink-0 border-r flex-col backdrop-blur-xl ${theme.sidebarBg} ${theme.border} z-10`}>
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6 group">
                        <div className={`absolute -inset-2 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                        <div className={`relative w-24 h-24 rounded-full p-1 border-2 ${isLightMode ? 'border-white bg-white shadow-lg' : 'border-white/10 bg-black/40'}`}>
                            <img 
                                src={`https://ui-avatars.com/api/?name=Keamo+Sec&background=${isLightMode ? 'f1f5f9' : '0D1117'}&color=${isLightMode ? '475569' : '367BF0'}&size=128`} 
                                alt="Keamo" 
                                className="w-full h-full rounded-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#1a1a1a] rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    
                    <h2 className={`font-bold text-lg tracking-tight ${theme.textMain}`}>Keamo Motlhamme</h2>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-6 ${theme.accent}`}>Active Node // RSA</p>
                    
                    <div className="w-full space-y-2 text-left">
                        {[
                            { label: 'Location', value: 'Johannesburg, ZA', icon: MapPin },
                            { label: 'Status', value: 'Ready for Deploy', icon: ShieldCheck },
                            { label: 'Encryption', value: 'Pgp/AES-256', icon: Zap }
                        ].map((item, i) => (
                            <div key={i} className={`p-3 rounded-2xl border transition-all ${isLightMode ? 'bg-white/50 border-slate-100 hover:bg-white' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <div className="flex items-center gap-3">
                                    <item.icon size={14} className={theme.textSec} />
                                    <div className="min-w-0">
                                        <div className={`text-[9px] uppercase font-bold tracking-widest ${theme.textSec}`}>{item.label}</div>
                                        <div className={`text-xs font-medium truncate ${theme.textMain}`}>{item.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-6 space-y-4">
                    <div className="flex justify-center gap-4">
                        <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-all ${isLightMode ? 'bg-white hover:shadow-md text-slate-700' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}><Github size={18} /></a>
                        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-all ${isLightMode ? 'bg-white hover:shadow-md text-[#0077b5]' : 'bg-white/5 hover:bg-white/10 text-[#0077b5]'}`}><Linkedin size={18} /></a>
                        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-all ${isLightMode ? 'bg-white hover:shadow-md text-pink-500' : 'bg-white/5 hover:bg-white/10 text-pink-500'}`}><Instagram size={18} /></a>
                    </div>
                    <div className={`text-[10px] text-center font-mono opacity-30 ${theme.textSec}`}>END_TO_END_ENCRYPTED_V1</div>
                </div>
            </aside>

            {/* --- RIGHT CONTENT: THE COMPOSER --- */}
            <main className="flex-1 relative flex flex-col overflow-hidden bg-dot-pattern">
                {isSent ? (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 animate-in fade-in duration-500">
                        <div className={`max-w-md w-full backdrop-blur-3xl rounded-[2.5rem] p-12 text-center border shadow-2xl flex flex-col items-center ${theme.glassCard}`}>
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-3 ${theme.textMain}`}>Message Transmitted</h3>
                            <p className={`${theme.textSec} text-sm leading-relaxed mb-8`}>
                                Your signal has been routed through our secure gateways. I will analyze the packet and respond shortly.
                            </p>
                            <button 
                                onClick={() => setIsSent(false)}
                                className={`px-8 py-3 rounded-2xl font-bold text-sm text-white transition-all shadow-lg ${theme.accentBg} hover:opacity-90 active:scale-95`}
                            >
                                Send Another
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Toolbar */}
                <div className={`h-14 border-b flex items-center px-4 md:px-6 justify-between backdrop-blur-md sticky top-0 z-20 ${isLightMode ? 'bg-white/40 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            <Mail size={16} />
                        </div>
                        <span className={`text-sm font-bold tracking-tight ${theme.textMain}`}>New Transmission</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-mono flex items-center gap-1.5 ${theme.textSec}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            SECURE CHANNEL
                        </span>
                    </div>
                </div>

                {/* Compose Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
                    
                    {/* MOBILE PROFILE CARD (Visible only on mobile) */}
                    <div className={`md:hidden mb-6 p-4 rounded-2xl border flex items-center gap-4 shadow-sm backdrop-blur-md ${theme.sidebarBg} ${theme.border}`}>
                        <div className="relative shrink-0">
                             <div className={`w-14 h-14 rounded-full p-0.5 border ${isLightMode ? 'border-white bg-white shadow-sm' : 'border-white/10 bg-black/40'}`}>
                                <img 
                                    src={`https://ui-avatars.com/api/?name=Keamo+Sec&background=${isLightMode ? 'f1f5f9' : '0D1117'}&color=${isLightMode ? '475569' : '367BF0'}&size=128`} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover" 
                                />
                             </div>
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1a1a1a] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className={`font-bold text-sm ${theme.textMain}`}>Keamo Motlhamme</h2>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${theme.accent}`}>Active Node</p>
                            <div className="flex gap-3">
                                <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className={`transition-colors ${theme.textSec} hover:${theme.textMain}`}><Github size={16}/></a>
                                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className={`transition-colors ${theme.textSec} hover:text-blue-500`}><Linkedin size={16}/></a>
                                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className={`transition-colors ${theme.textSec} hover:text-pink-500`}><Instagram size={16}/></a>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={`max-w-3xl mx-auto backdrop-blur-2xl rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col min-h-[450px] ${theme.composerBg} ${theme.border}`}>
                        
                        {/* Header Rows */}
                        <div className={`space-y-0 border-b ${theme.border}`}>
                            <div className={`flex items-center px-4 md:px-6 py-3 md:py-4 border-b ${theme.inputBorder}`}>
                                <span className={`w-16 md:w-20 text-xs md:text-sm font-medium ${theme.textSec}`}>To:</span>
                                <div className={`flex-1 text-xs md:text-sm font-bold flex items-center gap-2 ${theme.textMain}`}>
                                    <span className={`px-2 py-0.5 rounded-md ${isLightMode ? 'bg-blue-50 text-blue-600' : 'bg-cyan-500/20 text-cyan-400'}`}>Keamo</span>
                                    <span className="hidden sm:inline text-xs font-normal opacity-50 font-mono">&lt;keamo.motlhamme@outlook.com&gt;</span>
                                </div>
                            </div>
                            <div className={`flex items-center px-4 md:px-6 py-3 md:py-4 border-b ${theme.inputBorder}`}>
                                <span className={`w-16 md:w-20 text-xs md:text-sm font-medium ${theme.textSec}`}>From:</span>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="your@email.com"
                                    className={`flex-1 bg-transparent border-none outline-none text-xs md:text-sm ${theme.textMain} placeholder:opacity-30`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className={`flex items-center px-4 md:px-6 py-3 md:py-4`}>
                                <span className={`w-16 md:w-20 text-xs md:text-sm font-medium ${theme.textSec}`}>Subject:</span>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Project Inquiry"
                                    className={`flex-1 bg-transparent border-none outline-none text-xs md:text-sm font-bold ${theme.textMain} placeholder:opacity-30`}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Body Area */}
                        <div className="flex-1 p-4 md:p-6 relative">
                            <textarea 
                                required
                                placeholder="Type your message here..."
                                className={`w-full h-full bg-transparent border-none outline-none text-sm md:text-base leading-relaxed resize-none ${theme.textMain} placeholder:opacity-20`}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                            
                            {/* Decorative Background Icon */}
                            <div className={`absolute bottom-8 right-8 pointer-events-none transition-opacity duration-700 ${formData.message ? 'opacity-10' : 'opacity-0'}`}>
                                <Sparkles size={80} className={theme.accent} />
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className={`px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-t ${theme.border} bg-white/5`}>
                            <div className="flex gap-2">
                                <button type="button" className={`p-2 rounded-lg transition-colors ${isLightMode ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-gray-500'}`}>
                                    <Paperclip size={18} />
                                </button>
                                <button type="button" className={`p-2 rounded-lg transition-colors ${isLightMode ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-gray-500'}`}>
                                    <Hash size={18} />
                                </button>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSending}
                                className={`
                                    group relative flex items-center gap-2 md:gap-3 px-6 md:px-8 py-2.5 md:py-3 rounded-2xl font-bold text-xs md:text-sm transition-all duration-300
                                    ${isSending 
                                        ? 'bg-gray-500 cursor-not-allowed text-white/50' 
                                        : `${theme.accentBg} text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95`
                                    }
                                `}
                            >
                                {isSending ? (
                                    <>
                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Transmit 
                                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

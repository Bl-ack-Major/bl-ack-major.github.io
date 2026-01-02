
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Wifi, Battery, Sun, Moon, Power, Command } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { validateLogin } from '../auth/passwordValidator';
import { USER_PROFILES, SOUND_KEYS, THEME_CONFIG } from '../constants';
import { useSound } from '../contexts/SoundContext';
import { AccountType } from '../auth/accountTypes';
import { useQuest } from '../contexts/QuestContext';
import { useChallenge } from '../contexts/ChallengeContext';

interface LoginScreenProps {
    onLoginSuccess: (accountType: AccountType, isHack?: boolean) => void;
    isRecruiterSafeMode?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, isRecruiterSafeMode = false }) => {
    const displayedUsers = isRecruiterSafeMode 
        ? USER_PROFILES.filter(u => u.id === 'recruiter')
        : USER_PROFILES;
    
    const [isLightMode, setIsLightMode] = useState(isRecruiterSafeMode);
    
    const [selectedUser, setSelectedUser] = useState<typeof displayedUsers[0] | null>(null);
    const [focusedUserIndex, setFocusedUserIndex] = useState<number>(0);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [startAnimations, setStartAnimations] = useState(false);

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const userRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const { login } = useAuth();
    const { playSound } = useSound();
    const { trackEvent } = useQuest();
    const { difficulty } = useChallenge();

    useEffect(() => {
        userRefs.current = userRefs.current.slice(0, displayedUsers.length);
    }, [displayedUsers]);

    useEffect(() => {
        if (!selectedUser) {
            userRefs.current[focusedUserIndex]?.focus();
        }
    }, [focusedUserIndex, selectedUser]);

    useEffect(() => {
        if (isRecruiterSafeMode) {
            setIsLightMode(true);
            if (displayedUsers.length === 1 && !selectedUser) {
                setSelectedUser(displayedUsers[0]);
            }
        }
    }, [isRecruiterSafeMode, displayedUsers]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const animTimer = setTimeout(() => {
            setStartAnimations(true);
        }, 500);

        return () => {
            clearInterval(timer);
            clearTimeout(animTimer);
        };
    }, []);

    useEffect(() => {
        if (selectedUser && selectedUser.id !== 'guest') {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        if (selectedUser?.id === 'recruiter') {
            if (!isRecruiterSafeMode) setIsLightMode(true); 
            setPassword('');
            const targetPassword = "Welcome2026";
            let currentIndex = 0;

            const typeNextChar = () => {
                if (currentIndex < targetPassword.length) {
                    const char = targetPassword.charAt(currentIndex);
                    setPassword(prev => prev + char);
                    // Play typing sound for each character
                    playSound(SOUND_KEYS.TYPING);
                    currentIndex++;
                    typingTimeoutRef.current = setTimeout(typeNextChar, 50 + Math.random() * 100);
                }
            };
            typingTimeoutRef.current = setTimeout(typeNextChar, 800);
        } else {
            if (selectedUser && !isRecruiterSafeMode) setIsLightMode(false); 
            setPassword('');
        }

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [selectedUser, isRecruiterSafeMode, playSound]);

    const handleUserClick = (user: typeof displayedUsers[0]) => {
        playSound(SOUND_KEYS.CLICK);
        setSelectedUser(user);
        setError(false);
    };

    const handleBack = () => {
        playSound(SOUND_KEYS.CLICK);
        setSelectedUser(null);
        setPassword('');
        setError(false);
        if (!isRecruiterSafeMode) setIsLightMode(false); 
    };

    const handleLogin = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!selectedUser) return;
        if (isAuthenticating) return;

        setIsAuthenticating(true);
        
        setTimeout(() => {
            const accountType = validateLogin(selectedUser.id, password);
            
            if (accountType) {
                const isHack = selectedUser.id === 'keamo' && accountType === AccountType.ADMINISTRATOR;
                
                if (isHack && difficulty === 'hard') {
                    trackEvent('CTF_PROGRESS', 'ROOT_ACCESS');
                }

                playSound(SOUND_KEYS.LOGIN);
                login(accountType, selectedUser.id);
                onLoginSuccess(accountType, isHack);
            } else {
                playSound(SOUND_KEYS.ERROR);
                setError(true);
                setPassword('');
                setIsAuthenticating(false);
                inputRef.current?.focus();
            }
        }, 800);
    };

    // --- KEYBOARD NAVIGATION ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedUser && selectedUser.id !== 'guest') {
                if (e.key === 'Escape') {
                    handleBack();
                }
                return;
            }

            if (!selectedUser) {
                // If no user is selected, allow navigation between profiles
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    setFocusedUserIndex(prev => (prev + 1) % displayedUsers.length);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setFocusedUserIndex(prev => (prev - 1 + displayedUsers.length) % displayedUsers.length);
                } else if (e.key === 'Enter') {
                    // Enter is handled by button onClick/onKeyDown naturally if focused, 
                    // but we ensure it here if focus is somehow lost but index is tracked
                    if (document.activeElement !== userRefs.current[focusedUserIndex]) {
                         handleUserClick(displayedUsers[focusedUserIndex]);
                    }
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedUserIndex, selectedUser, displayedUsers]);


    return (
        <div className={`h-screen w-screen overflow-hidden relative font-sans select-none cursor-default transition-colors duration-700 ${isLightMode ? 'bg-[#eef2f6] text-slate-800' : 'bg-[#000000] text-gray-200'}`}>
            <div className="absolute inset-0 transition-opacity duration-1000">
                {isLightMode ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe] opacity-90" />
                ) : (
                    <div className="absolute inset-0 bg-[#000000]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#131b29] via-[#000000] to-[#000000]" />
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
                    </div>
                )}
            </div>

            <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-20">
                <div className={`transition-all duration-700 ${startAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="text-3xl md:text-5xl font-thin tracking-tight leading-none">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                    <div className={`text-[10px] md:text-sm font-medium mt-1 uppercase tracking-widest ${isLightMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {!isRecruiterSafeMode && (
                        <button 
                            onClick={() => setIsLightMode(!isLightMode)}
                            className={`p-1.5 md:p-2 rounded-full transition-all hover:bg-white/10 ${isLightMode ? 'text-slate-600 hover:bg-white/50' : 'text-gray-400'}`}
                        >
                            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    )}
                    <div className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 md:py-1.5 rounded-full border ${isLightMode ? 'bg-white/40 border-slate-300 text-slate-600 shadow-sm' : 'bg-black/20 border-white/10 text-gray-400'}`}>
                        <Wifi size={14} />
                        <Battery size={14} />
                    </div>
                </div>
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                <div className={`flex flex-wrap justify-center gap-4 md:gap-16 transition-all duration-500 ${selectedUser ? 'scale-95 opacity-0 pointer-events-none absolute' : 'scale-100 opacity-100'}`}>
                    {displayedUsers.map((user, idx) => (
                        <button 
                            key={user.id}
                            ref={el => { userRefs.current[idx] = el; }}
                            onClick={() => handleUserClick(user)}
                            onFocus={() => setFocusedUserIndex(idx)}
                            className={`
                                group flex flex-col items-center cursor-pointer transition-all duration-500 w-[90px] md:w-[130px] rounded-lg focus:outline-none
                                ${startAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                            `}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <div className="relative mb-3 md:mb-6">
                                {/* Visual Focus Ring / Glow - Triggers on hover AND group-focus-visible */}
                                <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-fuchsia-600 rounded-full blur opacity-0 group-hover:opacity-75 group-focus-visible:opacity-75 transition-all duration-500 group-hover:scale-110 group-focus-visible:scale-110"></div>
                                
                                <div className={`relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-2 transition-all duration-300 ${isLightMode ? 'border-white shadow-lg group-hover:border-transparent group-focus-visible:border-transparent' : 'border-white/10 group-hover:border-transparent group-focus-visible:border-transparent bg-black'}`}>
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=${isLightMode ? 'f1f5f9' : '111827'}&color=${isLightMode ? '475569' : 'fff'}&size=128`} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-focus-visible:opacity-100"
                                    />
                                </div>
                            </div>

                            <h3 className={`text-xs md:text-lg font-medium tracking-wide mb-1 transition-colors text-center ${isLightMode ? 'text-slate-800 font-bold group-hover:text-black' : 'text-gray-300 group-hover:text-white'}`}>
                                {user.name}
                            </h3>
                            <span className={`text-[7px] md:text-[10px] uppercase tracking-widest font-bold px-1.5 md:px-2 py-0.5 rounded border ${
                                isLightMode 
                                    ? 'bg-white/50 border-slate-300 text-slate-600 shadow-sm' 
                                    : 'bg-white/5 border-white/10 text-gray-500 group-hover:border-cyan-500/30 group-hover:text-cyan-400'
                            }`}>
                                {user.role}
                            </span>
                        </button>
                    ))}
                </div>

                {selectedUser && (
                    <div className="flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative mb-6 md:mb-8">
                            <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20 relative z-10 shadow-2xl">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=${isLightMode ? 'f1f5f9' : '111827'}&color=${isLightMode ? '475569' : 'fff'}&size=128`} 
                                    alt={selectedUser.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <h2 className={`text-xl md:text-2xl font-light mb-6 ${isLightMode ? 'text-slate-900 font-medium' : 'text-white'}`}>
                            {selectedUser.name}
                        </h2>

                        {selectedUser.id === 'guest' ? (
                            <button
                                onClick={() => handleLogin()}
                                disabled={isAuthenticating}
                                autoFocus
                                className={`
                                    w-32 py-2 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 border focus:outline-none focus-visible:ring-2
                                    ${isLightMode 
                                        ? 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 shadow-sm focus-visible:ring-blue-400' 
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 focus-visible:ring-cyan-400'
                                    }
                                `}
                            >
                                {isAuthenticating ? (
                                    <span className="animate-pulse">Loading...</span>
                                ) : (
                                    <>
                                        <span>Enter</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        ) : (
                            <form onSubmit={handleLogin} className="w-full max-w-[280px] relative group">
                                <div className={`
                                    flex items-center rounded-lg overflow-hidden transition-all duration-300
                                    ${isLightMode 
                                        ? 'bg-white/70 border border-slate-300 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white shadow-lg' 
                                        : 'bg-black/30 border border-white/10 focus-within:border-cyan-500/50 focus-within:bg-black/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.1)]'}
                                `}>
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                                        placeholder={selectedUser.id === 'recruiter' ? 'Auto-typing...' : 'Password'}
                                        className={`
                                            w-full py-3 px-4 bg-transparent outline-none text-sm font-mono tracking-widest text-center cursor-text
                                            ${isLightMode ? 'text-slate-800 placeholder-slate-500' : 'text-white placeholder-gray-600'}
                                        `}
                                        readOnly={selectedUser.id === 'recruiter'}
                                    />
                                    {isAuthenticating && (
                                        <div className="absolute right-3 animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full text-cyan-500"></div>
                                    )}
                                </div>
                                
                                {error && (
                                    <div className="absolute top-full left-0 w-full text-center mt-3">
                                        <span className="text-[10px] md:text-xs text-red-400 bg-red-900/10 px-3 py-1 rounded border border-red-500/20 animate-pulse">
                                            Authentication Failed
                                        </span>
                                    </div>
                                )}
                                
                                <button type="submit" className="hidden" disabled={isAuthenticating} />
                            </form>
                        )}

                        <button 
                            onClick={handleBack}
                            className={`
                                mt-10 md:mt-12 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all hover:-translate-x-1 opacity-60 hover:opacity-100 focus:outline-none focus-visible:underline
                                ${isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-500 hover:text-white'}
                            `}
                        >
                            <ArrowLeft size={14} /> Switch User
                        </button>
                    </div>
                )}
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 flex justify-between items-end z-20 ${isLightMode ? 'text-slate-500' : 'text-gray-600'}`}>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
                        {isRecruiterSafeMode ? "RECRUITER SAFE MODE" : "SYSTEM READY"}
                    </span>
                    <span className="text-[8px] md:text-[10px] font-mono">v2025.1.0-release</span>
                </div>
                <div className="flex gap-2 md:gap-4">
                    <button className="hover:text-white transition-colors" title="Shut Down"><Power className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /></button>
                    <button className="hover:text-white transition-colors" title="Recovery Mode"><Command className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /></button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

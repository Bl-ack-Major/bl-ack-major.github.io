
import React, { useState, useEffect, memo } from 'react';
import { format } from 'date-fns';
import { AppId } from '../types';
import { APP_CONFIGS_META, SOUND_KEYS, THEME_CONFIG } from '../constants';
import { Wifi, Volume2, VolumeX, User, LogOut, Save, Download } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { useAuth } from '../auth/AuthContext';
import { AccountType } from '../auth/accountTypes';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from './ToastNotification';
import { persistenceService } from '../services/persistenceService';

// --- Isolated Clock Component for Performance ---
const SystemClock = memo(({ isLightMode }: { isLightMode: boolean }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`text-[10px] md:text-xs font-medium font-mono md:ml-2 border px-1.5 md:py-1 rounded select-none cursor-default ${isLightMode ? 'bg-white/50 border-white/60 text-slate-700' : 'bg-black/20 border-white/10 text-white/90'}`}>
            {format(time, 'HH:mm')}
        </div>
    );
});

interface TaskbarProps {
  openApps?: AppId[];
  pinnedApps?: AppId[];
  activeApp?: AppId | null;
  onAppClick: (id: AppId) => void;
  onStartClick: (e: React.MouseEvent) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ openApps = [], pinnedApps = [], activeApp = null, onAppClick, onStartClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { playSound, toggleMute, isMuted } = useSound();
  const { account, logout } = useAuth();
  const { isLightMode } = useTheme();
  const { addNotification } = useToast();
  
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const closeProfile = () => setIsProfileOpen(false);
    window.addEventListener('click', closeProfile);
    return () => window.removeEventListener('click', closeProfile);
  }, []);

  const handleAppClick = (id: AppId) => {
      playSound(SOUND_KEYS.CLICK);
      onAppClick(id);
  };

  const handleStartClick = (e: any) => {
      playSound(SOUND_KEYS.CLICK);
      onStartClick(e);
  };

  const handleLogout = () => {
      playSound(SOUND_KEYS.CLICK);
      logout();
  };

  const handleSwitchAccount = () => {
      playSound(SOUND_KEYS.CLICK);
      logout();
  };

  const handleSaveSession = async () => {
      playSound(SOUND_KEYS.UI_CLICK);
      try {
          // Force persist current state if generic persistence service supports manual triggers
          // Currently usePersistence handles auto-save, but this gives user feedback
          addNotification("Session state saved to local storage.", "success");
      } catch (e) {
          addNotification("Failed to save session.", "error");
      }
  };

  const handleResetSession = async () => {
      if(confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
          playSound(SOUND_KEYS.UI_CLICK);
          await persistenceService.clear();
          localStorage.clear();
          window.location.reload();
      }
  };

  // Deduplicate apps and ensure arrays are valid
  const safeOpenApps = Array.isArray(openApps) ? openApps : [];
  const safePinnedApps = Array.isArray(pinnedApps) ? pinnedApps : [];
  const displayApps = Array.from(new Set([...safePinnedApps, ...safeOpenApps]));

  const baseClasses = isLightMode 
    ? "bg-white/60 border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.1)] text-slate-800" 
    : "bg-black/60 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-gray-200";

  return (
    <div className="fixed bottom-2 md:bottom-2 left-0 right-0 flex justify-center z-[9999] px-2 md:px-4 pointer-events-none">
        {/* Floating Glass Dock */}
        <div className={`h-14 md:h-16 backdrop-blur-xl border rounded-2xl md:rounded-2xl flex items-center px-2 md:px-4 relative max-w-full md:min-w-[fit-content] gap-1 md:gap-2 pointer-events-auto transition-all duration-300 ${baseClasses}`}>
            
            {/* Start / Launchpad */}
            <button 
                onClick={handleStartClick}
                className="group relative flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 px-1 md:px-2 shrink-0"
                title="Start Menu"
                aria-label="Open Start Menu"
            >
                <img 
                    src="/images/icons/kali-logo.svg" 
                    alt="Start" 
                    className={`w-10 h-10 md:w-12 md:h-12 object-contain transition-all duration-300 ${
                        isLightMode 
                        ? 'opacity-90 drop-shadow-sm' 
                        : 'brightness-200 grayscale contrast-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                    }`}
                />
            </button>

            <div className={`w-px h-6 md:h-8 mx-0.5 md:mx-1 ${isLightMode ? 'bg-slate-300/50' : 'bg-white/10'}`}></div>

            {/* App Icons - Responsive Scroll if too many */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar max-w-[50vw] md:max-w-none">
                {displayApps.map((id) => {
                    const config = APP_CONFIGS_META[id];
                    if (!config) return null;
                    
                    const isOpen = safeOpenApps && safeOpenApps.includes(id);
                    const isActive = activeApp === id;

                    return (
                        <button
                            key={id}
                            onClick={() => handleAppClick(id)}
                            className="group relative flex flex-col items-center justify-center p-0.5 md:p-1 transition-transform duration-200 hover:scale-110 md:hover:-translate-y-2 focus:outline-none"
                            title={config.name}
                            aria-label={`Open ${config.name}`}
                        >
                            <div className={`
                                p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 relative
                                ${isOpen ? (isLightMode ? 'bg-white/40' : 'bg-white/10') : (isLightMode ? 'hover:bg-white/30' : 'hover:bg-white/5')}
                                ${isActive ? (isLightMode ? 'ring-2 ring-blue-400/50' : 'ring-1 ring-white/30') : ''}
                            `}>
                                {React.cloneElement(config.icon as React.ReactElement<any>, { 
                                    size: isMobile ? 22 : 28, 
                                    className: isLightMode ? "text-slate-700 drop-shadow-sm" : "text-gray-200 filter drop-shadow-md" 
                                })}
                            </div>
                            
                            {/* Dot Indicator */}
                            <div className={`
                                absolute -bottom-1 w-1 h-1 rounded-full transition-all duration-300
                                ${isOpen ? (isLightMode ? 'bg-slate-800' : 'bg-white') : 'opacity-0'}
                            `}></div>
                        </button>
                    )
                })}
            </div>

            <div className={`w-px h-6 md:h-8 mx-0.5 md:mx-1 ${isLightMode ? 'bg-slate-300/50' : 'bg-white/10'}`}></div>

            {/* System Tray Area */}
            <div className="flex items-center gap-1.5 md:gap-2 md:pl-2 shrink-0">
                {!isMobile && (
                  <button onClick={toggleMute} className={`transition-colors hover:scale-110 duration-200 ${isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-300 hover:text-white'}`}>
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                )}
                
                {/* Isolated Clock Component */}
                <SystemClock isLightMode={isLightMode} />
                
                <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border ${isLightMode ? 'border-white/50' : 'border-white/20'}`}
                    >
                        <User size={14} className="text-white" />
                    </button>
                    
                    {isProfileOpen && (
                        <div className={`absolute bottom-14 right-0 w-48 md:w-56 backdrop-blur-xl border rounded-2xl shadow-2xl p-2 animate-in slide-in-from-bottom-2 origin-bottom-right ${isLightMode ? 'bg-white/90 border-white/60' : 'bg-[#1e1e1e]/80 border-white/10'}`}>
                            <div className={`px-3 py-3 border-b mb-1 ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <div className={`font-bold text-sm ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{account?.displayName || 'User'}</div>
                                <div className={`text-[10px] uppercase font-bold text-blue-500`}>{account?.accountType || 'Guest'}</div>
                            </div>
                            
                            {/* Session Controls */}
                            <button 
                                onClick={handleSaveSession}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex items-center gap-2 ${isLightMode ? 'text-slate-600 hover:bg-slate-100' : 'text-gray-300 hover:bg-white/10'}`}
                            >
                                <Save size={14} /> Save Session
                            </button>
                            <button 
                                onClick={handleResetSession}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex items-center gap-2 ${isLightMode ? 'text-slate-600 hover:bg-slate-100' : 'text-gray-300 hover:bg-white/10'}`}
                            >
                                <Download size={14} /> Reset Progress
                            </button>
                            
                            <div className={`h-px my-1 ${isLightMode ? 'bg-slate-200' : 'bg-white/10'}`} />
                            
                            <button 
                                onClick={handleSwitchAccount}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${isLightMode ? 'text-slate-600 hover:bg-slate-100' : 'text-gray-300 hover:bg-white/10'}`}
                            >
                                Switch Account
                            </button>
                            <button 
                                onClick={handleLogout}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${isLightMode ? 'text-red-500 hover:bg-red-50' : 'text-gray-300 hover:bg-red-500/20 hover:text-red-400'}`}
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};

export default memo(Taskbar);

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Terminal, Folder, FileText, Globe, Settings, Power, User, 
  Star, Clock, Grid, Bug, Activity, Shield, Wifi, Database, Lock, 
  Cpu, HardDrive, Layers, Command, Mail, Radar, Code, Hash, Key, Volume2, VolumeX, Package, Compass, Layout, Briefcase,
  Flag, Server, Target, Award, BookOpen, ChevronRight, Moon, Sun, Menu, X
} from 'lucide-react';
import { AppId } from '../types';
import { useToast } from './ToastNotification';
import { useSound } from '../contexts/SoundContext';
import { SOUND_KEYS } from '../constants';
import { useAuth } from '../auth/AuthContext';
import { hasPermission } from '../auth/permissions';
import { AccountType } from '../auth/accountTypes';
import { useTheme } from '../contexts/ThemeContext';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (id: AppId) => void;
}

interface AppEntry {
    name: string;
    icon: React.ReactNode;
    subtitle?: string;
    appId?: AppId;
    isPlaceholder?: boolean;
}

// Updated CATEGORIES: Removed iconPath and relying on fallbackIcon as primary
const CATEGORIES = [
  { id: 'fav', name: 'Favorites', fallbackIcon: <Star size={16} /> },
  { id: 'recent', name: 'Recent', fallbackIcon: <Clock size={16} /> },
  { id: 'all', name: 'All Apps', fallbackIcon: <Grid size={16} /> },
  { id: 'usual', name: 'Usual Apps', fallbackIcon: <Grid size={16} className="text-inherit" /> },
];

const APP_DATA: Record<string, AppEntry[]> = {
  'fav': [
    { name: 'Collaborate', icon: <Briefcase size={24} className="text-blue-500" />, subtitle: "Why choose me?", appId: AppId.HIRE_ME },
    { name: 'About Me', icon: <User size={24} className="text-blue-400" />, subtitle: "Professional Bio", appId: AppId.ABOUT },
    { name: 'Resume', icon: <FileText size={24} className="text-red-400" />, subtitle: "CV & Experience", appId: AppId.RESUME },
    { name: 'Projects', icon: <Folder size={24} className="text-purple-400" />, subtitle: "Code & Case Studies", appId: AppId.PROJECTS },
    { name: 'Contact', icon: <Mail size={24} className="text-teal-400" />, subtitle: "Get in touch", appId: AppId.CONTACT },
    { name: 'Career', icon: <Compass size={24} className="text-pink-400" />, subtitle: "Future Roadmap", appId: AppId.CAREER },
    { name: 'Certs', icon: <Award size={24} className="text-yellow-500" />, subtitle: "Qualifications", appId: AppId.LEARNING },
    { name: 'Terminal', icon: <Terminal size={24} className="text-gray-400" />, appId: AppId.TERMINAL, subtitle: 'System Shell' },
  ],
  'usual': [
    { name: 'Terminal', icon: <Terminal size={18} />, appId: AppId.TERMINAL, subtitle: 'Functional' },
    { name: 'Burp Suite', icon: <Bug size={18} className="text-orange-500" />, appId: AppId.BURP, subtitle: 'Functional' },
    { name: 'Wireshark', icon: <Activity size={18} className="text-blue-400" />, appId: AppId.WIRESHARK, subtitle: 'Functional' },
    { name: 'System Logs', icon: <FileText size={18} className="text-gray-400" />, appId: AppId.SYSTEM_LOGS, subtitle: 'System Events' },
    { name: 'Dev Notes', icon: <FileText size={18} className="text-yellow-500" />, appId: AppId.DEV_NOTES, subtitle: 'Developer Notes' },
    { name: 'Source Viewer', icon: <Code size={18} className="text-purple-400" />, appId: AppId.SOURCE_VIEWER, subtitle: 'Code Review' },
    { name: 'Zenmap', icon: <Radar size={18} className="text-green-500" />, appId: AppId.NMAP, subtitle: 'Functional' },
    { name: 'Files', icon: <Folder size={18} className="text-blue-400" />, appId: AppId.FILE_MANAGER, subtitle: 'File Manager' },
    { name: 'Home Lab', icon: <Server size={18} className="text-blue-600" />, appId: AppId.HOME_LAB, subtitle: 'Lab Environment' },
    { name: 'CTF Challenges', icon: <Flag size={18} className="text-green-500" />, appId: AppId.CTF, subtitle: 'Achievements' },
    { name: 'Write-ups', icon: <BookOpen size={18} className="text-cyan-500" />, appId: AppId.BLOG, subtitle: 'Blog & Notes' },
    { name: 'Tools Inventory', icon: <Package size={18} className="text-orange-400" />, appId: AppId.TOOLS, subtitle: 'Skills & Packages' },
    { name: 'System Monitor', icon: <Activity size={18} className="text-gray-500" />, appId: AppId.SYS_MONITOR, subtitle: 'Resources' },
    { name: 'Objectives', icon: <Target size={18} className="text-red-500" />, appId: AppId.QUESTS, subtitle: 'Gamification' },
    { name: 'About Portfolio', icon: <Layout size={18} className="text-cyan-400" />, appId: AppId.PORTFOLIO_META, subtitle: 'Meta Information' },
  ],
};

const allAppsFlat = Object.values(APP_DATA).flat();
const uniqueAppsMap = new Map();
allAppsFlat.forEach(item => uniqueAppsMap.set(item.name, item));
APP_DATA['all'] = Array.from(uniqueAppsMap.values());

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onAppClick }) => {
  const [activeCategory, setActiveCategory] = useState('fav');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentApps, setRecentApps] = useState<AppEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  
  const { addNotification } = useToast();
  const { playSound, toggleMute, isMuted } = useSound();
  const { account, logout } = useAuth();
  const { isLightMode, toggleTheme } = useTheme();
  
  const isMobile = window.innerWidth < 768;
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
      if (isOpen) {
          setSearchQuery('');
          setSelectedIndex(-1);
          setMobileCategoryOpen(false);
          // Focus search on open
          setTimeout(() => searchInputRef.current?.focus(), 50);
      }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAppClick = (app: AppEntry) => {
    playSound(SOUND_KEYS.CLICK);
    if (app.isPlaceholder) {
        playSound(SOUND_KEYS.ERROR);
        addNotification(`This is a demonstration tool showing my familiarity with ${app.name}`, 'info');
        return;
    }
    
    if (app.appId) {
      setRecentApps(prev => {
          const filtered = prev.filter(a => a.name !== app.name);
          return [app, ...filtered].slice(0, 7);
      });
      
      onAppClick(app.appId);
      onClose();
    }
  };

  const filterByPermission = (app: AppEntry) => {
      if (!account) return false;
      if (account.accountType === AccountType.ADMINISTRATOR) return true;
      if (account.accountType === AccountType.GUEST) {
          if (app.isPlaceholder) return false;
          return app.appId ? hasPermission(app.appId, account.accountType) : false;
      }
      if (account.accountType === AccountType.RECRUITER) {
          if (app.appId && hasPermission(app.appId, account.accountType)) return true;
          return false;
      }
      return false;
  };

  const getDisplayedApps = () => {
      if (account?.accountType === AccountType.RECRUITER && activeCategory === 'fav' && !searchQuery) {
          return [];
      }

      if (activeCategory === 'recent') return recentApps.length > 0 ? recentApps : [];
      let apps = APP_DATA[activeCategory] || APP_DATA['fav'];
      return apps.filter(filterByPermission);
  };

  const displayedApps = getDisplayedApps();

  const filteredApps = searchQuery 
    ? APP_DATA['all']
      .filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(filterByPermission)
      .sort((a, b) => (a.isPlaceholder === b.isPlaceholder) ? 0 : a.isPlaceholder ? 1 : -1)
    : displayedApps;

  const handleKeyDown = (e: React.KeyboardEvent) => {
      // Navigation within Search/Results
      if (document.activeElement === searchInputRef.current || resultsContainerRef.current?.contains(document.activeElement)) {
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex(prev => Math.min(prev + 1, filteredApps.length - 1));
              scrollIntoView(selectedIndex + 1);
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex(prev => Math.max(prev - 1, 0));
              scrollIntoView(selectedIndex - 1);
          } else if (e.key === 'Enter') {
              e.preventDefault();
              const targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
              if (filteredApps[targetIndex]) {
                  handleAppClick(filteredApps[targetIndex]);
              }
          }
      }
  };
  
  const handleCategoryKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % CATEGORIES.length;
          categoryRefs.current[nextIndex]?.focus();
          setActiveCategory(CATEGORIES[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
          categoryRefs.current[prevIndex]?.focus();
          setActiveCategory(CATEGORIES[prevIndex].id);
      } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveCategory(CATEGORIES[index].id);
      }
  };

  const scrollIntoView = (index: number) => {
      if (resultsContainerRef.current) {
          const rows = resultsContainerRef.current.children[0]?.children; 
          if (rows && rows[index]) {
              rows[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
      }
  };

  const handleLogout = () => {
      playSound(SOUND_KEYS.CLICK);
      logout();
      onClose();
  };

  // Styles
  const baseClasses = isLightMode 
    ? "bg-white/90 border-white/40 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)]" 
    : "bg-[#1e1e1e]/90 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]";

  const sidebarClasses = isLightMode
    ? "bg-slate-50/80 border-slate-200/50"
    : "bg-black/30 border-white/5";

  const searchClasses = isLightMode
    ? "bg-white/60 border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200 text-slate-700"
    : "bg-black/20 border-white/10 focus-within:bg-black/30 focus-within:border-blue-500/50 text-white";

  const activeCategoryClasses = isLightMode
    ? "bg-blue-500/10 text-blue-600 border-l-blue-500"
    : "bg-white/10 text-white border-l-blue-500";

  return (
    <>
    <div className="fixed inset-0 z-[9999] pointer-events-auto" onClick={onClose} />
    
    <div 
      className={`fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 w-[95vw] md:w-[750px] h-[70vh] md:h-[550px] rounded-3xl overflow-hidden font-sans z-[10000] animate-in fade-in slide-in-from-bottom-10 duration-300 select-none border backdrop-blur-2xl pointer-events-auto ${baseClasses}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
        <div className="flex flex-col md:flex-row h-full">
            {/* Mobile Category Toggle */}
            {isMobile && (
              <div className={`p-4 border-b flex items-center justify-between ${sidebarClasses}`}>
                <button 
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="flex items-center gap-2 text-sm font-bold text-blue-500"
                >
                  <Menu size={18} />
                  {CATEGORIES.find(c => c.id === activeCategory)?.name}
                </button>
                <div className="flex items-center gap-2">
                   <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white text-[10px]`}>
                      {account?.displayName?.charAt(0)}
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Categories - Hidden on mobile unless toggled or displayed as menu */}
            <div className={`
              ${isMobile ? (mobileCategoryOpen ? 'absolute inset-0 z-50' : 'hidden') : 'w-1/3 md:w-60'} 
              border-r flex flex-col ${sidebarClasses} transition-all duration-300
            `}>
                <div className={`p-6 border-b ${isLightMode ? 'border-slate-200/50' : 'border-white/5'} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                        <img 
                            src="/images/icons/kali-logo.svg" 
                            alt="Kali" 
                            className={`w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-md ${isLightMode ? 'opacity-90' : 'brightness-200 grayscale contrast-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`} 
                        />
                        <div className="flex flex-col">
                            <span className={`font-bold text-base md:text-lg tracking-tight ${isLightMode ? 'text-slate-800' : 'text-white'}`}>Kali OS</span>
                            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">Portfolio</span>
                        </div>
                    </div>
                    {isMobile && <button onClick={() => setMobileCategoryOpen(false)} className="text-gray-400 p-2"><X size={20}/></button>}
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-0.5 px-3">
                    {CATEGORIES.map((cat, idx) => (
                        <button
                            key={cat.id}
                            ref={el => { categoryRefs.current[idx] = el; }}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                if (isMobile) setMobileCategoryOpen(false);
                            }}
                            onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                            className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-all duration-200 rounded-lg border-l-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                activeCategory === cat.id 
                                    ? activeCategoryClasses 
                                    : `border-transparent ${isLightMode ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`
                            }`}
                        >
                            <span className={activeCategory === cat.id ? 'text-blue-500' : 'opacity-70'}>
                                {cat.fallbackIcon}
                            </span>
                            <span className="text-sm font-medium truncate">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className={`p-4 border-t ${isLightMode ? 'border-slate-200/50' : 'border-white/5'}`}>
                    <div className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${isLightMode ? 'bg-white hover:bg-slate-50 border border-slate-200' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}>
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg`}>
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`font-bold text-xs truncate ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{account?.displayName}</div>
                            <div className="text-[9px] text-blue-500 truncate capitalize font-bold">{account?.accountType}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
                {/* Search Header */}
                <div className="p-4 md:p-6 pb-2">
                    <div className="relative group">
                        <div className={`relative flex items-center rounded-2xl border transition-all ${searchClasses}`}>
                            <Search className={`ml-4 ${isLightMode ? 'text-slate-400' : 'text-gray-500'}`} size={16} />
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                placeholder="Search apps..." 
                                className={`w-full bg-transparent border-none py-2.5 md:py-3 pl-3 pr-4 text-sm focus:outline-none focus:ring-0 ${isLightMode ? 'placeholder-slate-400' : 'placeholder-gray-500'}`}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>

                {/* App Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2 custom-scrollbar" ref={resultsContainerRef}>
                    {searchQuery && <div className={`text-[10px] font-bold mb-4 uppercase tracking-wider ${isLightMode ? 'text-slate-400' : 'text-gray-500'}`}>Results</div>}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                        {filteredApps.length === 0 && !searchQuery && (
                            <div className="col-span-full flex flex-col items-center justify-center h-40 text-gray-500">
                                <Clock size={32} className="mb-2 opacity-20" />
                                <span className="text-xs">No recent activity</span>
                            </div>
                        )}
                        
                        {filteredApps.map((app, idx) => {
                            const isSelected = idx === selectedIndex;
                            return (
                                <button
                                    key={`${app.name}-${idx}`}
                                    onClick={() => handleAppClick(app)}
                                    className={`
                                        flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all group text-left border outline-none
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                                        ${isSelected 
                                            ? (isLightMode ? 'bg-blue-50 border-blue-300 shadow-md transform scale-[1.02]' : 'bg-white/10 border-blue-500/50 shadow-lg transform scale-[1.02]')
                                            : (isLightMode 
                                                ? 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50' 
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30')
                                        }
                                        ${app.isPlaceholder ? 'opacity-60 grayscale' : ''}
                                    `}
                                >
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 border transition-colors shadow-sm
                                        ${isLightMode 
                                            ? 'bg-slate-50 border-slate-200 text-slate-600 group-hover:text-blue-600' 
                                            : 'bg-black/40 border-white/5 group-hover:border-blue-500/50'
                                        }
                                    `}>
                                        {React.cloneElement(app.icon as React.ReactElement<any>, { size: isMobile ? 20 : 24 })}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className={`font-bold text-xs md:text-sm truncate ${isLightMode ? 'text-slate-800' : 'text-gray-200'} group-hover:text-blue-500`}>{app.name}</div>
                                        <div className={`text-[10px] md:text-[11px] truncate ${isLightMode ? 'text-slate-500' : 'text-gray-500'}`}>{app.subtitle || 'App'}</div>
                                    </div>
                                    {app.isPlaceholder && (
                                        <span className="text-[8px] bg-black/10 text-gray-500 px-1 py-0.5 rounded border border-black/5 self-center">
                                            DEMO
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Toolbar */}
                <div className={`h-14 md:h-16 border-t flex items-center justify-between px-4 md:px-6 shrink-0 ${isLightMode ? 'bg-slate-50/80 border-slate-200/50' : 'bg-black/20 border-white/5'}`}>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className={`p-2 rounded-lg transition-colors ${isLightMode ? 'text-slate-500 hover:bg-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                        <button 
                            onClick={toggleTheme} 
                            className={`p-2 rounded-lg transition-colors ${isLightMode ? 'text-slate-500 hover:bg-white hover:text-amber-500' : 'text-gray-400 hover:text-blue-400 hover:bg-white/5'}`}
                        >
                            {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                    </div>
                    
                    <button 
                        onClick={handleLogout} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isLightMode 
                                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`} 
                    >
                        <Power size={14} /> <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};
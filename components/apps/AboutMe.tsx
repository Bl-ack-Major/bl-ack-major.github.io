
import React, { useState, useEffect, useRef } from 'react';
import { 
    ArrowLeft, ArrowRight, RotateCw, Home, Star, Lock, MoreVertical, 
    X, Search, BookOpen, GitFork, Eye, ChevronDown, Terminal, 
    Layout, Settings, Download, Printer, Folder, FileText, 
    Globe, Mail, MapPin, Link as LinkIcon, User, Package,
    AlertCircle, CheckCircle, Play, Github, Briefcase, Shield, Info,
    Trophy, Target, Zap, GraduationCap, ChevronRight, Code, Filter, ExternalLink
} from 'lucide-react';
import { PROJECTS_DATA, RESUME_DATA, SOCIAL_LINKS } from '../../constants';
import { Project, AppId } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface BrowserProps {
    initialTab?: 'overview' | 'repositories' | 'about' | 'projects';
    onOpenApp?: (id: AppId, props?: any) => void;
}

// --- MOCK DOM FOR DEV TOOLS ---
const MOCK_DOM_TREE = `
<!DOCTYPE html>
<html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
  <head>
    <meta charset="utf-8">
    <title>Keamo · GitHub</title>
    <meta name="description" content="Security Engineer & Penetration Tester">
  </head>
  <body class="logged-in env-production page-profile">
    <div class="position-relative js-header-wrapper">
      <header class="Header js-details-container">...</header>
    </div>
    <div id="start-of-content" class="show-on-focus"></div>
    <div class="application-main">
      <main>
        <div class="container-xl px-3 px-md-4 px-lg-5">
           <!-- Profile Container -->
           <div class="h-card col-lg-3 float-left pr-lg-5">
              <img class="avatar avatar-user width-full border color-bg-default">
              <span class="p-name vcard-fullname d-block overflow-hidden">Keamo</span>
           </div>
           <!-- Repo Grid -->
           <div class="col-lg-9 float-left pl-lg-5">
              <!-- Content rendered by React -->
           </div>
        </div>
      </main>
    </div>
  </body>
</html>
`.trim();

const CATEGORIES = ['All', 'Academic', 'Personal', 'Lab', 'Tool', 'Professional'];

export const AboutMe: React.FC<BrowserProps> = ({ initialTab = 'about', onOpenApp }) => {
    const { isLightMode } = useTheme();
    
    // --- BROWSER STATE ---
    const [currentUrl, setCurrentUrl] = useState(`https://github.com/keamo`);
    const [urlInput, setUrlInput] = useState(currentUrl);
    const [history, setHistory] = useState<string[]>([`https://github.com/keamo`]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDevTools, setShowDevTools] = useState(false);
    const [activeTab, setActiveTab] = useState<'Elements' | 'Console'>('Elements');
    const [consoleOutput, setConsoleOutput] = useState<string[]>(['> GitHub System v2.4.0 initialized', '> Connected to api.github.com... OK']);
    const [consoleInput, setConsoleInput] = useState('');

    // --- GITHUB CONTENT STATE ---
    const [view, setView] = useState<'profile' | 'repo'>('profile');
    const [profileTab, setProfileTab] = useState<'overview' | 'repositories' | 'stars' | 'about' | 'projects'>(initialTab);
    const [currentRepo, setCurrentRepo] = useState<Project | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const menuRef = useRef<HTMLDivElement>(null);
    const consoleEndRef = useRef<HTMLDivElement>(null);

    // Initial setup based on props
    useEffect(() => {
        if (initialTab) {
            setProfileTab(initialTab);
            const tabParam = initialTab !== 'overview' ? `?tab=${initialTab}` : '';
            const newUrl = `https://github.com/keamo${tabParam}`;
            setCurrentUrl(newUrl);
            setUrlInput(newUrl);
        }
    }, [initialTab]);

    // Handle clicking outside menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll console
    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [consoleOutput, showDevTools]);

    // --- BROWSER ACTIONS ---

    const navigate = (url: string) => {
        setIsLoading(true);
        setShowMenu(false);
        
        setTimeout(() => {
            let newUrl = url;
            if (!url.startsWith('http')) newUrl = `https://${url}`;
            
            if (newUrl.includes('github.com/keamo')) {
                const parts = newUrl.split('github.com/keamo/');
                if (parts[1] && !parts[1].startsWith('?')) {
                    const repoName = parts[1].split('/')[0];
                    const repo = PROJECTS_DATA.find(p => p.name.includes(repoName));
                    if (repo) {
                        setCurrentRepo(repo);
                        setView('repo');
                    } else {
                        setView('profile');
                        setCurrentRepo(null);
                    }
                } else {
                    setView('profile');
                    setCurrentRepo(null);
                    if (newUrl.includes('tab=repositories')) setProfileTab('repositories');
                    else if (newUrl.includes('tab=about')) setProfileTab('about');
                    else if (newUrl.includes('tab=projects')) setProfileTab('projects');
                    else setProfileTab('overview');
                }
            } else if (newUrl.includes('google.com')) {
                setConsoleOutput(prev => [...prev, `> Redirecting external traffic to ${newUrl}... blocked by CORS policy.`]);
            }

            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newUrl);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            setCurrentUrl(newUrl);
            setUrlInput(newUrl);
            setIsLoading(false);
        }, 600);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            const prevUrl = history[prevIndex];
            setCurrentUrl(prevUrl);
            setUrlInput(prevUrl);
            if (prevUrl.includes('github.com/keamo/')) {
                 const repoName = prevUrl.split('github.com/keamo/')[1];
                 const repo = PROJECTS_DATA.find(p => p.name.includes(repoName));
                 if (repo) { setCurrentRepo(repo); setView('repo'); }
            } else {
                setView('profile');
                setCurrentRepo(null);
                if (prevUrl.includes('tab=repositories')) setProfileTab('repositories');
                else if (prevUrl.includes('tab=about')) setProfileTab('about');
                else if (prevUrl.includes('tab=projects')) setProfileTab('projects');
                else setProfileTab('overview');
            }
        }
    };

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            const nextUrl = history[nextIndex];
            setCurrentUrl(nextUrl);
            setUrlInput(nextUrl);
             if (nextUrl.includes('github.com/keamo/')) {
                 const repoName = nextUrl.split('github.com/keamo/')[1];
                 const repo = PROJECTS_DATA.find(p => p.name.includes(repoName));
                 if (repo) { setCurrentRepo(repo); setView('repo'); }
            } else {
                setView('profile');
                setCurrentRepo(null);
                if (nextUrl.includes('tab=repositories')) setProfileTab('repositories');
                else if (nextUrl.includes('tab=about')) setProfileTab('about');
                else if (nextUrl.includes('tab=projects')) setProfileTab('projects');
                else setProfileTab('overview');
            }
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(urlInput);
    };

    const executeConsole = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const cmd = consoleInput.trim();
            setConsoleOutput(prev => [...prev, `> ${cmd}`]);
            
            try {
                if (cmd === 'clear') {
                    setConsoleOutput([]);
                } else if (cmd.startsWith('alert')) {
                    const msg = cmd.match(/alert\(['"](.+)['"]\)/)?.[1];
                    if (msg) alert(msg);
                } else if (cmd === 'help') {
                    setConsoleOutput(prev => [...prev, 'Available commands: alert(), console.log(), document.title']);
                } else if (cmd === 'document.title') {
                    setConsoleOutput(prev => [...prev, `< "Keamo · GitHub"`]);
                } else {
                    setConsoleOutput(prev => [...prev, `< undefined`]);
                }
            } catch (err) {
                setConsoleOutput(prev => [...prev, `Error: ${err}`]);
            }
            setConsoleInput('');
        }
    };

    // --- THEME CONSTANTS ---
    const browserBg = isLightMode ? 'bg-[#f3f4f6]' : 'bg-[#2b2b2b]';
    const toolbarBg = isLightMode ? 'bg-white' : 'bg-[#3c3c3c]';
    const addressBarBg = isLightMode ? 'bg-[#f1f5f9] text-slate-700' : 'bg-[#2b2b2b] text-gray-200';
    const iconColor = isLightMode ? 'text-slate-500 hover:bg-slate-100' : 'text-gray-400 hover:bg-white/10';
    
    const ghBg = isLightMode ? 'bg-white' : 'bg-[#0d1117]';
    const ghTextMain = isLightMode ? 'text-[#24292f]' : 'text-[#c9d1d9]';
    const ghTextSec = isLightMode ? 'text-[#57606a]' : 'text-[#8b949e]';
    const ghBorder = isLightMode ? 'border-[#d0d7de]' : 'border-[#30363d]';
    const ghHeaderBg = isLightMode ? 'bg-[#f6f8fa]' : 'bg-[#161b22]';
    const ghLink = isLightMode ? 'text-[#0969da]' : 'text-[#58a6ff]';
    const devToolsBg = isLightMode ? 'bg-white border-t border-slate-300' : 'bg-[#242424] border-t border-gray-700';

    return (
        <div className={`h-full flex flex-col font-sans ${browserBg} overflow-hidden`}>
            {/* --- BROWSER CHROME --- */}
            <div className={`flex items-end px-2 pt-2 gap-2 h-10 ${isLightMode ? 'bg-[#dee1e6]' : 'bg-[#202020]'}`}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[200px] shadow-sm relative group ${isLightMode ? 'bg-white text-slate-800' : 'bg-[#3c3c3c] text-gray-200'}`}>
                    {isLoading ? <RotateCw size={12} className="animate-spin text-blue-500" /> : <Github size={12} />}
                    <span className="truncate flex-1 font-medium">Keamo · GitHub</span>
                    <button className="opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded p-0.5"><X size={10} /></button>
                </div>
                <button className={`p-1.5 rounded-full hover:bg-black/10 mb-1 ${isLightMode ? 'text-slate-600' : 'text-gray-400'}`}>
                    <Layout size={14} />
                </button>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 border-b ${isLightMode ? 'border-slate-200' : 'border-black'} ${toolbarBg}`}>
                <div className="flex gap-1">
                    <button onClick={handleBack} disabled={historyIndex === 0} className={`p-1.5 rounded-full transition-colors disabled:opacity-30 ${iconColor}`}>
                        <ArrowLeft size={16} />
                    </button>
                    <button onClick={handleForward} disabled={historyIndex === history.length - 1} className={`p-1.5 rounded-full transition-colors disabled:opacity-30 ${iconColor}`}>
                        <ArrowRight size={16} />
                    </button>
                    <button onClick={handleRefresh} className={`p-1.5 rounded-full transition-colors ${iconColor}`}>
                        <RotateCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => navigate('github.com/keamo')} className={`p-1.5 rounded-full transition-colors ${iconColor}`}>
                        <Home size={16} />
                    </button>
                </div>

                <form onSubmit={handleUrlSubmit} className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent focus-within:border-blue-500/50 transition-all ${addressBarBg}`}>
                    <Lock size={12} className={isLightMode ? 'text-green-600' : 'text-green-500'} />
                    <input 
                        type="text" 
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-xs font-mono"
                        spellCheck={false}
                    />
                    {isLoading ? null : <Star size={14} className="text-yellow-500 fill-yellow-500 cursor-pointer" />}
                </form>

                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className={`p-1.5 rounded-full transition-colors ${iconColor} ${showMenu ? 'bg-black/10' : ''}`}>
                        <MoreVertical size={16} />
                    </button>
                    {showMenu && (
                        <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl border py-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#2b2b2b] border-gray-700 text-gray-200'}`}>
                            <div className="px-4 py-2 border-b border-gray-700/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-500">K-Browser</span>
                                <span className="text-[10px] opacity-50">v1.0</span>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white flex items-center gap-3">
                                <Layout size={14} /> New Tab
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white flex items-center gap-3">
                                <BookOpen size={14} /> Bookmarks
                            </button>
                            <div className="h-px bg-gray-700/10 my-1"></div>
                            <button 
                                onClick={() => { setShowDevTools(!showDevTools); setShowMenu(false); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white flex items-center gap-3 justify-between"
                            >
                                <span className="flex items-center gap-3"><Terminal size={14} /> Developer Tools</span>
                                {showDevTools && <CheckCircle size={12} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bookmarks Bar */}
            <div className={`flex items-center gap-4 px-3 py-1.5 border-b text-xs ${isLightMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#3c3c3c] border-black text-gray-300'}`}>
                <button onClick={() => navigate('github.com/keamo')} className="hover:bg-black/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Github size={12} /> Keamo
                </button>
                <button onClick={() => navigate('github.com/keamo?tab=repositories')} className="hover:bg-black/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Folder size={12} /> Repos
                </button>
                <button onClick={() => navigate('github.com/keamo?tab=projects')} className="hover:bg-black/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Layout size={12} /> Projects
                </button>
                <button onClick={() => navigate('github.com/keamo?tab=about')} className="hover:bg-black/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <User size={12} /> About
                </button>
            </div>

            {/* --- MAIN CONTENT AREA (GITHUB SIMULATION) --- */}
            <div className={`flex-1 flex overflow-hidden ${ghBg} ${ghTextMain}`}>
                <div className={`flex-1 flex flex-col overflow-y-auto custom-scrollbar relative`}>
                    <header className={`py-3 px-4 md:px-6 flex items-center gap-4 text-white shrink-0 ${isLightMode ? 'bg-[#24292f]' : 'bg-[#161b22] border-b border-gray-800'}`}>
                        <button onClick={() => navigate('github.com')}><Github size={32} className="fill-white" /></button>
                        <div className="relative flex-1 max-w-md hidden md:block">
                            <div className="flex items-center rounded-md border border-gray-600 bg-none px-2 py-1 transition-colors focus-within:bg-white focus-within:text-black focus-within:border-white">
                                <Search size={14} className="mr-2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search or jump to..." 
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-inherit"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            <AlertCircle size={16} className="text-gray-400 hover:text-white cursor-pointer" />
                            <div className="w-5 h-5 rounded-full border border-gray-600 overflow-hidden cursor-pointer">
                                <img src={`https://ui-avatars.com/api/?name=Keamo+Sec&background=${isLightMode ? 'e2e8f0' : '0D1117'}&color=${isLightMode ? '475569' : '367BF0'}&size=20`} alt="Avatar" />
                            </div>
                        </div>
                    </header>

                    {view === 'profile' ? (
                        <div className="flex-1">
                            <div className={`sticky top-0 z-10 border-b ${ghBorder} ${ghBg} mt-6 hidden md:block`}>
                                <div className="w-full px-4 md:px-8 flex gap-1">
                                    <div className="w-1/5"></div>
                                    <div className="flex-1 flex gap-2 overflow-x-auto">
                                        {[
                                            { id: 'overview', label: 'Overview', icon: BookOpen },
                                            { id: 'about', label: 'About', icon: User },
                                            { id: 'repositories', label: 'Repositories', icon: Folder, count: PROJECTS_DATA.length },
                                            { id: 'projects', label: 'Projects', icon: Layout },
                                            { id: 'stars', label: 'Stars', icon: Star, count: 12 }
                                        ].map(tab => (
                                            <button 
                                                key={tab.id}
                                                onClick={() => setProfileTab(tab.id as any)}
                                                className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                                                    profileTab === tab.id 
                                                    ? 'border-[#fd8c73] font-semibold text-inherit' 
                                                    : 'border-transparent hover:border-gray-300 text-gray-500'
                                                }`}
                                            >
                                                <tab.icon size={16} className={profileTab === tab.id ? '' : 'text-gray-400'} />
                                                {tab.label}
                                                {tab.count && <span className={`px-1.5 py-0.5 rounded-full text-xs ${isLightMode ? 'bg-gray-100' : 'bg-gray-800'}`}>{tab.count}</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
                                <aside className="w-full md:w-1/5 relative z-0">
                                    <div className={`rounded-full border overflow-hidden w-40 h-40 md:w-48 md:h-48 mx-auto md:mx-0 mb-4 ${ghBorder} ${ghBg} relative z-0`}>
                                        <img src={`https://ui-avatars.com/api/?name=Keamo+Sec&background=${isLightMode ? 'f1f5f9' : '0D1117'}&color=${isLightMode ? '475569' : '367BF0'}&size=256`} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="mb-4">
                                        <h1 className="text-xl font-bold leading-tight">{RESUME_DATA.header.name}</h1>
                                        <div className={`text-lg font-light ${ghTextSec}`}>keamo</div>
                                    </div>
                                    <div className={`text-xs mb-4 ${ghTextMain}`}>
                                        Security Engineer & Penetration Tester. Building secure architectures and breaking insecure ones.
                                    </div>
                                    <button className={`w-full py-1 rounded-md border text-xs font-medium mb-4 bg-[#21262d] text-white border-white/10 hover:bg-[#30363d] shadow-sm`}>
                                        Edit profile
                                    </button>
                                    <div className={`space-y-2 text-[11px] ${ghTextSec}`}>
                                        <div className="flex items-center gap-2"><User size={14}/> <span>24 followers</span> · <span>15 following</span></div>
                                        <div className="flex items-center gap-2"><Briefcase size={14}/> {RESUME_DATA.header.title}</div>
                                        <div className="flex items-center gap-2"><MapPin size={14}/> {RESUME_DATA.header.location.split(',')[0]}</div>
                                        <div className="flex items-center gap-2"><Mail size={14}/> <a href={`mailto:${RESUME_DATA.header.email}`} className="hover:text-blue-500 hover:underline truncate">{RESUME_DATA.header.email}</a></div>
                                        <div className="flex items-center gap-2"><LinkIcon size={14}/> <a href={`https://${RESUME_DATA.header.website}`} className="hover:text-blue-500 hover:underline">{RESUME_DATA.header.website}</a></div>
                                    </div>
                                </aside>

                                <div className="flex-1">
                                    {profileTab === 'about' && (
                                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
                                            <section>
                                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                                    <Info className="text-blue-500" size={24} /> Professional Summary
                                                </h2>
                                                <div className={`p-6 border rounded-xl leading-relaxed ${ghBorder} ${ghBg}`}>
                                                    {RESUME_DATA.summary}
                                                </div>
                                            </section>

                                            <section>
                                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                                    <Briefcase className="text-purple-500" size={24} /> Work Experience
                                                </h2>
                                                <div className="space-y-6">
                                                    {RESUME_DATA.experience.map((job, i) => (
                                                        <div key={i} className={`p-6 border rounded-xl relative overflow-hidden ${ghBorder} ${ghBg}`}>
                                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                                                                <div>
                                                                    <h3 className="text-lg font-bold">{job.role}</h3>
                                                                    <p className="text-blue-500 font-medium">{job.company}</p>
                                                                </div>
                                                                <span className={`text-xs px-3 py-1 rounded-full font-mono ${isLightMode ? 'bg-slate-100' : 'bg-white/5'}`}>{job.period}</span>
                                                            </div>
                                                            <ul className="space-y-2 text-sm leading-relaxed text-gray-500">
                                                                {job.achievements.map((ach, j) => (
                                                                    <li key={j} className="flex gap-2">
                                                                        <span className="text-blue-500">•</span> {ach}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section>
                                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                                    <GraduationCap className="text-green-500" size={24} /> Education & Certifications
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {RESUME_DATA.education.map((edu, i) => (
                                                        <div key={i} className={`p-5 border rounded-xl ${ghBorder} ${ghBg}`}>
                                                            <h3 className="font-bold text-sm">{edu.degree}</h3>
                                                            <p className="text-xs text-blue-500 my-1">{edu.school}</p>
                                                            <p className="text-[11px] text-gray-500">{edu.year}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}

                                    {profileTab === 'overview' && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <div className="flex justify-between items-center mb-2">
                                                <h2 className="text-base font-normal">Pinned</h2>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {PROJECTS_DATA.filter(p => p.isPinned).map(repo => (
                                                    <div 
                                                        key={repo.id}
                                                        onClick={() => navigate(`github.com/keamo/${repo.name.split('/')[1]}`)}
                                                        className={`border rounded-md p-4 flex flex-col cursor-pointer transition-all hover:border-gray-400 ${ghBorder} ${ghBg}`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <BookOpen size={16} className={ghTextSec} />
                                                            <span className={`font-bold ${ghLink} hover:underline`}>{repo.name.split('/')[1]}</span>
                                                            <span className={`text-[10px] border rounded-full px-1.5 py-0.5 ${ghBorder} ${ghTextSec}`}>Public</span>
                                                        </div>
                                                        <p className={`text-xs flex-1 mb-4 ${ghTextSec}`}>{repo.description}</p>
                                                        <div className={`flex items-center gap-4 text-xs ${ghTextSec}`}>
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                                                                {repo.language}
                                                            </div>
                                                            <div className="flex items-center gap-1"><Star size={14}/> {repo.stars}</div>
                                                            <div className="flex items-center gap-1"><GitFork size={14}/> {repo.forks}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {profileTab === 'repositories' && (
                                        <div className="space-y-4 animate-in fade-in">
                                            <div className={`flex flex-col md:flex-row gap-2 pb-4 border-b ${ghBorder}`}>
                                                <div className="flex-1 relative">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Find a repository..." 
                                                        className={`w-full border rounded-md px-3 py-1.5 text-sm ${ghBorder} ${isLightMode ? 'bg-white' : 'bg-[#0d1117]'} focus:border-blue-500 focus:outline-none`}
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <div className="relative inline-block w-full md:w-auto">
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className={`w-full md:w-auto appearance-none border rounded-md px-4 pr-10 py-1.5 text-sm font-medium cursor-pointer focus:outline-none focus:border-blue-500 ${ghBorder} ${isLightMode ? 'bg-[#f6f8fa] hover:bg-[#f3f4f6]' : 'bg-[#21262d] hover:bg-[#30363d]'}`}
                                                    >
                                                        {CATEGORIES.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                                        <ChevronDown size={14} className={ghTextSec} />
                                                    </div>
                                                </div>
                                            </div>

                                            {PROJECTS_DATA
                                                .filter(p => {
                                                    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                                                    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
                                                    return matchesSearch && matchesCategory;
                                                })
                                                .map(repo => (
                                                <div key={repo.id} className={`py-6 border-b ${ghBorder} flex justify-between items-start`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 onClick={() => navigate(`github.com/keamo/${repo.name.split('/')[1]}`)} className={`text-xl font-bold ${ghLink} hover:underline cursor-pointer`}>
                                                                {repo.name.split('/')[1]}
                                                            </h3>
                                                            <span className={`text-xs border rounded-full px-2 py-0.5 ${ghBorder} ${ghTextSec}`}>Public</span>
                                                        </div>
                                                        <p className={`text-sm ${ghTextSec} mb-4 max-w-2xl`}>{repo.description}</p>
                                                        <div className={`flex items-center gap-4 text-xs ${ghTextSec}`}>
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                                                                {repo.language}
                                                            </div>
                                                            {repo.stars > 0 && <div className="flex items-center gap-1"><Star size={14}/> {repo.stars}</div>}
                                                            {repo.forks > 0 && <div className="flex items-center gap-1"><GitFork size={14}/> {repo.forks}</div>}
                                                            <div>Updated {repo.lastUpdated}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {profileTab === 'projects' && (
                                        <div className="space-y-8 animate-in fade-in">
                                            <h2 className="text-xl font-bold border-b pb-2 mb-4">Project Write-ups</h2>
                                            {PROJECTS_DATA.map(project => (
                                                <div key={project.id} className={`p-6 border rounded-xl ${ghBorder} ${ghBg} hover:shadow-md transition-shadow group`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className={`text-2xl font-bold ${ghLink} group-hover:underline cursor-pointer`} onClick={() => navigate(`github.com/keamo/${project.name.split('/')[1]}`)}>
                                                                {project.name.split('/')[1].replace(/-/g, ' ').toUpperCase()}
                                                            </h3>
                                                            <p className={`text-sm font-medium mt-1 ${ghTextSec}`}>{project.description}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => navigate(`github.com/keamo/${project.name.split('/')[1]}`)}
                                                            className={`p-2 rounded-full ${isLightMode ? 'bg-slate-100 hover:bg-slate-200' : 'bg-white/5 hover:bg-white/10'}`}
                                                        >
                                                            <ExternalLink size={18} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="space-y-6">
                                                        <section>
                                                            <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-cyan-500 flex items-center gap-2">
                                                                <Zap size={14} /> Key Takeaways
                                                            </h4>
                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {project.whatILearned?.map((item, i) => (
                                                                    <li key={i} className="flex gap-2 text-xs leading-relaxed items-start">
                                                                        <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" /> {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </section>

                                                        <section className={`p-4 rounded-lg border italic text-xs leading-relaxed ${isLightMode ? 'bg-slate-50 text-slate-600' : 'bg-black/20 text-gray-400'}`}>
                                                            "This project was instrumental in my understanding of {project.topics[0]} and {project.topics[1]}. 
                                                            By building this from the ground up, I gained practical experience in {project.category.toLowerCase()} development 
                                                            and security integration."
                                                        </section>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full animate-in fade-in">
                            <div className={`${ghHeaderBg} border-b ${ghBorder} px-4 md:px-8 pt-4 pb-0`}>
                                <div className="w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-lg">
                                            <BookOpen size={18} className={ghTextSec} />
                                            <span className={`${ghLink} hover:underline cursor-pointer`} onClick={() => navigate('github.com/keamo')}>keamo</span>
                                            <span className={ghTextSec}>/</span>
                                            <span className={`${ghLink} font-bold hover:underline`}>{currentRepo?.name.split('/')[1]}</span>
                                            <span className={`text-xs border rounded-full px-2 py-0.5 ml-2 ${ghBorder} ${ghTextSec}`}>Public</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 text-sm overflow-x-auto">
                                        <button className={`flex items-center gap-2 py-3 border-b-2 font-medium border-[#fd8c73] ${ghTextMain}`}>
                                            <Code size={16} /> Code
                                        </button>
                                        <button className={`flex items-center gap-2 py-3 border-b-2 border-transparent hover:border-gray-400 ${ghTextSec}`}>
                                            <AlertCircle size={16} /> Issues
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto p-4 md:p-6 w-full">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    <div className="lg:col-span-3 space-y-4">
                                        <div className={`border rounded-md overflow-hidden ${ghBorder} ${ghBg}`}>
                                            <div className={`p-3 border-b text-sm flex items-center justify-between ${ghHeaderBg} ${ghBorder}`}>
                                                <div className="flex items-center gap-2">
                                                    <img src={`https://ui-avatars.com/api/?name=Keamo+Sec&background=${isLightMode ? 'f1f5f9' : '0D1117'}&color=${isLightMode ? '475569' : '367BF0'}&size=20`} className="w-5 h-5 rounded-full" alt="user" />
                                                    <span className="font-bold">keamo</span>
                                                    <span className={`${ghTextSec} truncate`}>{currentRepo?.commits[0]?.message}</span>
                                                </div>
                                            </div>
                                            {currentRepo?.files.map((file, i) => (
                                                <div key={i} className={`flex items-center gap-3 p-3 border-t text-sm hover:bg-gray-100 dark:hover:bg-[#161b22] cursor-pointer ${ghBorder}`}>
                                                    {file.type === 'folder' ? <Folder size={16} className="text-blue-500 fill-blue-500" /> : <FileText size={16} className={ghTextSec} />}
                                                    <span className={`${ghTextMain} hover:text-blue-500 hover:underline`}>{file.name}</span>
                                                    <span className="flex-1"></span>
                                                    <span className={`${ghTextSec} text-xs`}>{currentRepo?.commits[0]?.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`border rounded-md mt-6 ${ghBorder} ${ghBg}`}>
                                            <div className={`p-3 border-b text-sm font-bold flex items-center gap-2 ${ghHeaderBg} ${ghBorder}`}>
                                                <FileText size={16} /> README.md
                                            </div>
                                            <div className={`p-8 prose prose-sm max-w-none ${isLightMode ? 'prose-slate' : 'prose-invert'}`}>
                                                <h1 className="text-2xl font-bold border-b pb-2 mb-4">{currentRepo?.name.split('/')[1]}</h1>
                                                <p>{currentRepo?.description}</p>
                                                <div className={`p-4 rounded border font-mono text-xs whitespace-pre-wrap ${isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-[#161b22] border-[#30363d]'}`}>
                                                    {currentRepo?.readme.replace(`# ${currentRepo.name.split('/')[1]}`, '')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-bold text-sm mb-3">About</h3>
                                            <p className={`text-sm mb-4 ${ghTextSec}`}>{currentRepo?.description}</p>
                                        </div>
                                        <div className={`border-t pt-4 ${ghBorder}`}>
                                            <h3 className="font-bold text-sm mb-3">Languages</h3>
                                            <div className="flex gap-4 text-xs font-bold">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    {currentRepo?.language} <span className={ghTextSec}>100.0%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showDevTools && (
                    <div className={`w-[400px] border-l flex flex-col ${devToolsBg} ${isLightMode ? 'border-slate-300' : 'border-gray-700'}`}>
                        <div className={`flex items-center justify-between px-2 py-1 bg-gray-100 dark:bg-[#333] border-b ${isLightMode ? 'border-slate-300' : 'border-black'}`}>
                            <div className="flex gap-1">
                                <button onClick={() => setActiveTab('Elements')} className={`px-3 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 rounded ${activeTab === 'Elements' ? 'text-blue-500 font-bold underline' : 'text-gray-500'}`}>Elements</button>
                                <button onClick={() => setActiveTab('Console')} className={`px-3 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 rounded ${activeTab === 'Console' ? 'text-blue-500 font-bold underline' : 'text-gray-500'}`}>Console</button>
                            </div>
                            <button onClick={() => setShowDevTools(false)} className="text-gray-500 hover:text-red-500"><X size={14}/></button>
                        </div>
                        <div className="flex-1 overflow-auto p-2 font-mono text-xs bg-white dark:bg-[#242424] text-gray-800 dark:text-gray-300 selection:bg-blue-200 selection:text-black">
                            {activeTab === 'Elements' ? (
                                <div className="whitespace-pre pl-1">
                                    <span className="text-gray-400">&lt;!DOCTYPE html&gt;</span>
                                    {MOCK_DOM_TREE.split('\n').map((line, i) => (
                                        <div key={i} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 cursor-default">{line}</div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 space-y-1">
                                        {consoleOutput.map((log, i) => (
                                            <div key={i} className={`border-b border-gray-100 dark:border-gray-800 pb-0.5 ${log.startsWith('Error') ? 'text-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}>{log}</div>
                                        ))}
                                        <div ref={consoleEndRef}></div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 border-t border-gray-200 dark:border-gray-700 pt-1">
                                        <span className="text-blue-500 font-bold">{'>'}</span>
                                        <input 
                                            type="text" 
                                            className="flex-1 outline-none bg-transparent"
                                            value={consoleInput}
                                            onChange={(e) => setConsoleInput(e.target.value)}
                                            onKeyDown={executeConsole}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutMe;

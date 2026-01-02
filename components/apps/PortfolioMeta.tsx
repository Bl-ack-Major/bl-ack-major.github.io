
import React from 'react';
import { 
    Layers, Code, Zap, Cpu, Database, Globe, 
    Layout, Terminal, Box, GitBranch, 
    Monitor, Server, Wifi, Lock, Activity
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const PortfolioMeta: React.FC = () => {
    const { isLightMode } = useTheme();

    // --- THEME CONFIGURATION ---
    const theme = {
        bg: isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]',
        textMain: isLightMode ? 'text-slate-900' : 'text-gray-200',
        textSec: isLightMode ? 'text-slate-500' : 'text-gray-400',
        // Restored Glassmorphism: semi-transparent backgrounds with heavy blur
        cardBg: isLightMode ? 'bg-white/70 border-slate-200/60 shadow-sm backdrop-blur-xl' : 'bg-[#1c1c1e]/60 border-white/10 backdrop-blur-xl',
        cardBorder: isLightMode ? 'border-slate-200' : 'border-white/10',
        accent: isLightMode ? 'text-blue-600' : 'text-cyan-400',
        accentBg: isLightMode ? 'bg-blue-50/80 border-blue-100' : 'bg-cyan-500/10 border-cyan-500/20',
        gridColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)',
        headerBg: isLightMode ? 'bg-white/60 border-slate-200/60 backdrop-blur-xl' : 'bg-[#0a0a0a]/60 border-white/10 backdrop-blur-xl'
    };

    return (
        <div className={`h-full w-full flex flex-col ${theme.bg} ${theme.textMain} font-sans overflow-hidden relative transition-colors duration-500`}>
            
            {/* Engineering Grid Background */}
            <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ 
                    backgroundImage: `linear-gradient(${theme.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px)`, 
                    backgroundSize: '40px 40px' 
                }}
            />

            {/* Ambient Blobs for Depth */}
            <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${isLightMode ? 'bg-blue-200/30' : 'bg-blue-900/10'}`} />
            <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${isLightMode ? 'bg-cyan-200/30' : 'bg-purple-900/10'}`} />

            {/* Header */}
            <div className={`relative z-20 border-b p-6 flex items-center justify-between shrink-0 ${theme.headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border ${theme.accentBg} ${theme.accent}`}>
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none">System Architecture</h1>
                        <p className={`text-xs font-medium mt-1 ${theme.textSec}`}>v1.2.0 • Technical Specification</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-2 py-1 rounded border ${isLightMode ? 'bg-slate-100/50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                        REACT_OS_KERNEL
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                <div className="w-full max-w-[1600px] mx-auto space-y-8">

                    {/* 1. Executive Summary / Concept */}
                    <div className={`${theme.cardBg} border rounded-2xl p-8 relative overflow-hidden`}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Monitor className={isLightMode ? 'text-blue-500' : 'text-cyan-400'} /> 
                                    The Simulation Engine
                                </h2>
                                <p className={`leading-relaxed ${theme.textSec}`}>
                                    This portfolio is not a static website; it is a <strong>Single Page Application (SPA)</strong> operating as a functional OS simulation. 
                                    It virtualizes standard operating system concepts—window management, file systems, and process isolation—entirely within the browser's DOM using React state.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['React 19', 'TypeScript', 'Vite', 'Gemini AI'].map(tag => (
                                        <span key={tag} className={`text-xs font-bold px-3 py-1 rounded-full border ${theme.accentBg} ${theme.accent}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className={`border-l pl-8 flex flex-col justify-center gap-4 ${isLightMode ? 'border-slate-200/50' : 'border-white/5'}`}>
                                <div>
                                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme.textSec}`}>Total Modules</div>
                                    <div className="text-3xl font-mono font-bold">24</div>
                                </div>
                                <div>
                                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme.textSec}`}>Render Strategy</div>
                                    <div className="text-3xl font-mono font-bold">Client-Side</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Architectural Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* State Management */}
                        <div className={`${theme.cardBg} border rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${isLightMode ? 'bg-purple-50/80 border-purple-100 text-purple-600' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                                <Database size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Global State Machine</h3>
                            <p className={`text-sm leading-relaxed mb-4 flex-1 ${theme.textSec}`}>
                                Utilizes React Context API to manage global system states without prop drilling. 
                                The <code>WindowManager</code> hook handles z-indexing and focus, while the <code>FileSystem</code> context creates a virtual in-memory drive structure.
                            </p>
                            <div className={`text-[10px] font-mono p-2 rounded border ${isLightMode ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-black/30 border-white/5 text-gray-500'}`}>
                                providers/FileSystemContext.tsx
                            </div>
                        </div>

                        {/* AI Integration */}
                        <div className={`${theme.cardBg} border rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${isLightMode ? 'bg-blue-50/80 border-blue-100 text-blue-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                <Zap size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Neural Engine</h3>
                            <p className={`text-sm leading-relaxed mb-4 flex-1 ${theme.textSec}`}>
                                Direct integration with <strong>Google Gemini 2.5 Flash</strong> via the AI Studio API. 
                                The system analyzes text inputs (Log Analysis App) and terminal commands to generate dynamic, context-aware responses.
                            </p>
                            <div className={`text-[10px] font-mono p-2 rounded border ${isLightMode ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-black/30 border-white/5 text-gray-500'}`}>
                                services/geminiService.ts
                            </div>
                        </div>

                        {/* Security Logic */}
                        <div className={`${theme.cardBg} border rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${isLightMode ? 'bg-red-50/80 border-red-100 text-red-600' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                <Lock size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Gamified Security</h3>
                            <p className={`text-sm leading-relaxed mb-4 flex-1 ${theme.textSec}`}>
                                Implements a "CTF (Capture The Flag)" logic layer. 
                                User progression is tracked via local storage, unlocking simulated "Root" privileges based on interaction events (finding hidden files, decoding strings).
                            </p>
                            <div className={`text-[10px] font-mono p-2 rounded border ${isLightMode ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-black/30 border-white/5 text-gray-500'}`}>
                                contexts/ChallengeContext.tsx
                            </div>
                        </div>
                    </div>

                    {/* 3. Tech Stack Grid */}
                    <div className="space-y-4">
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${theme.textSec} flex items-center gap-2`}>
                            <Layers size={14} /> Technology Stack
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[
                                { name: "React 19", type: "Framework", icon: <Code size={18} /> },
                                { name: "TypeScript", type: "Language", icon: <Terminal size={18} /> },
                                { name: "Tailwind", type: "Styling", icon: <Layout size={18} /> },
                                { name: "Vite", type: "Bundler", icon: <Activity size={18} /> },
                                { name: "Lucide", type: "Icons", icon: <Box size={18} /> },
                                { name: "Date-Fns", type: "Utils", icon: <Activity size={18} /> },
                            ].map((tech, i) => (
                                <div key={i} className={`${theme.cardBg} border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1`}>
                                    <div className={`mb-2 opacity-70 ${theme.accent}`}>{tech.icon}</div>
                                    <div className="font-bold text-sm">{tech.name}</div>
                                    <div className={`text-[10px] uppercase font-bold mt-1 ${theme.textSec}`}>{tech.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Deployment Pipeline */}
                    <div className={`${theme.cardBg} border rounded-2xl p-8`}>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Server className={isLightMode ? 'text-green-600' : 'text-green-400'} size={20} />
                                    Deployment Pipeline
                                </h3>
                                <p className={`text-sm leading-relaxed ${theme.textSec}`}>
                                    The application is built using Vite for optimized asset bundling. 
                                    It is deployed as a static site, leveraging the browser's local storage for session persistence across reloads. 
                                    Assets are served via CDN for low-latency global access.
                                </p>
                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                        <GitBranch size={14} className={theme.textSec} />
                                        <span>main branch</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                        <Globe size={14} className={theme.textSec} />
                                        <span>portfolio.kali.dev</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                        <Wifi size={14} className="text-green-500" />
                                        <span>Live</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visual Diagram */}
                            <div className={`w-full md:w-1/3 border rounded-xl p-4 flex items-center justify-between text-xs font-mono ${isLightMode ? 'bg-slate-50/50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                                <div className="text-center">
                                    <div className="mb-2">Source</div>
                                    <div className={`p-2 rounded border ${theme.cardBg}`}>TSX</div>
                                </div>
                                <div className={`h-px w-8 ${isLightMode ? 'bg-slate-300' : 'bg-gray-700'}`}></div>
                                <div className="text-center">
                                    <div className="mb-2">Build</div>
                                    <div className={`p-2 rounded border ${theme.cardBg}`}>Vite</div>
                                </div>
                                <div className={`h-px w-8 ${isLightMode ? 'bg-slate-300' : 'bg-gray-700'}`}></div>
                                <div className="text-center">
                                    <div className="mb-2">Dist</div>
                                    <div className={`p-2 rounded border ${theme.cardBg}`}>WWW</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PortfolioMeta;

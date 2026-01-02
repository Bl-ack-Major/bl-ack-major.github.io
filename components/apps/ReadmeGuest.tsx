import React from 'react';
import {
    Shield, Terminal, Search, Lock, CheckCircle, User, Unlock, FileText, Code,
    Activity, Key, Briefcase, ExternalLink, Info, AlertTriangle, ChevronRight,
    Hash, Database, Layout, Target, ArrowRight, Download, Cpu, Globe, Zap,
    Skull, Crosshair, Network, Eye, Moon, Sun, Monitor, Server, Command, Layers
} from 'lucide-react';
import { useChallenge } from '../../contexts/ChallengeContext';
import { AppId } from '../../types';
import { RESUME_DATA, SOCIAL_LINKS } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

interface ReadmeGuestProps {
    onOpenApp?: (id: AppId) => void;
}

export const ReadmeGuest: React.FC<ReadmeGuestProps> = ({ onOpenApp }) => {
    const { stage, difficulty } = useChallenge();
    const { isLightMode } = useTheme();

    const handleOpenApp = (id: AppId) => {
        if (onOpenApp) onOpenApp(id);
    };

    // --- CASUAL MODE ("The Corporate Persona" - macOS/Web3 Style) ---
    if (difficulty === 'casual') {
        const bgClass = isLightMode ? 'bg-[#eef2f6]' : 'bg-[#0d1117]';
        const textMain = isLightMode ? 'text-slate-800' : 'text-gray-200';
        const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
        const headerBg = isLightMode ? 'bg-white/60 border-white/50' : 'bg-[#161b22]/80 border-white/10';
        const cardBg = isLightMode ? 'bg-white/70 border-white/80' : 'bg-[#1f2937]/50 border-white/10';
        const buttonBg = isLightMode ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-[#21262d] hover:bg-[#30363d] border-white/10';
        const quickAccessBg = isLightMode ? 'bg-white/80 hover:bg-white border-white/60' : 'bg-[#161b22]/80 hover:bg-[#161b22] border-white/5';

        return (
            <div className={`h-full flex flex-col ${bgClass} ${textMain} font-sans relative overflow-hidden selection:bg-fuchsia-500/20 transition-colors duration-300`}>
                <div className={`absolute inset-0 ${bgClass} z-0 transition-colors duration-300`}></div>
                <div className={`absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-bl from-cyan-400/20 to-blue-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse ${isLightMode ? 'opacity-100' : 'opacity-20'}`} style={{ animationDuration: '8s' }} />
                <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-fuchsia-400/20 to-purple-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse ${isLightMode ? 'opacity-100' : 'opacity-20'}`} style={{ animationDuration: '10s' }} />

                <div className={`relative z-20 px-8 py-6 flex items-center justify-between shrink-0 ${headerBg} backdrop-blur-xl border-b shadow-sm transition-all`}>
                    <div className="flex items-center gap-4">
                        <div className="relative group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px] shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
                                <div className={`w-full h-full rounded-2xl ${isLightMode ? 'bg-white' : 'bg-[#0d1117]'} flex items-center justify-center`}>
                                    <User className="text-cyan-500" size={20} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold ${textMain} tracking-tight leading-none`}>{RESUME_DATA.header.name}</h1>
                            <p className={`text-xs font-medium ${textSec} mt-1 flex items-center gap-1.5`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                {RESUME_DATA.header.title}
                            </p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${isLightMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                        Visitor Mode
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                    <div className="w-full max-w-[1200px] mx-auto space-y-12">
                        <div className={`${cardBg} backdrop-blur-2xl border rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.08)] transition-all duration-500`}>
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none text-cyan-600">
                                <Monitor size={300} />
                            </div>
                            <div className="relative z-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-bold uppercase tracking-wider mb-6">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                    </span>
                                    Portfolio V1.0
                                </div>
                                <h2 className={`text-4xl md:text-5xl font-bold ${textMain} mb-6 leading-normal tracking-tight`}>
                                    Building <br />
                                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-fuchsia-500 pb-4">Secure Systems.</span>
                                </h2>
                                <p className={`text-lg ${textSec} leading-relaxed mb-8 font-light`}>
                                    I bridge the gap between offensive security and modern software architecture.
                                    This portfolio demonstrates my technical capabilities in a clean, accessible environment.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => handleOpenApp(AppId.RESUME)}
                                        className={`bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5`}
                                    >
                                        <FileText size={18} /> View Resume
                                    </button>
                                    <button
                                        onClick={() => handleOpenApp(AppId.HIRE_ME)}
                                        className={`${buttonBg} ${textMain} border px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md`}
                                    >
                                        <Briefcase size={18} /> Professional Bio
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-sm font-bold ${textSec} uppercase tracking-widest mb-6 px-1 flex items-center gap-2`}>
                                <Command size={14} /> Quick Access
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: AppId.PROJECTS, label: 'Projects', desc: 'Case studies & repositories', icon: Code, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20' },
                                    { id: AppId.LEARNING, label: 'Certifications', desc: 'Verified skills & badges', icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                                    { id: AppId.CONTACT, label: 'Contact', desc: 'Get in touch directly', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleOpenApp(item.id)}
                                        className={`group ${quickAccessBg} backdrop-blur-md border rounded-2xl p-6 text-left transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/10 hover:-translate-y-1`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${item.bg} border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
                                            <item.icon size={26} className={item.color} />
                                        </div>
                                        <h4 className={`text-lg font-bold ${textMain} mb-1 transition-colors`}>{item.label}</h4>
                                        <p className={`text-sm ${textSec}`}>{item.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`border-t ${isLightMode ? 'border-slate-200' : 'border-white/10'} pt-8 flex flex-col md:flex-row justify-between items-center text-sm ${textSec} pb-4`}>
                            <p className="font-medium">© 2025 {RESUME_DATA.header.name}</p>
                            <div className="flex gap-6 mt-4 md:mt-0">
                                <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className={`hover:${textMain} transition-colors font-medium`}>GitHub</a>
                                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors font-medium">LinkedIn</a>
                                <a href={`mailto:${RESUME_DATA.header.email}`} className={`hover:${textMain} transition-colors font-medium`}>Email</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- HACKER MODE ("The Kali Persona") ---
    return (
        <div className="h-full flex flex-col bg-[#0a0e14] text-gray-300 font-mono relative overflow-hidden selection:bg-[#39ff14]/30 selection:text-black">
            <div className="absolute inset-0 bg-[#0a0e14] z-0"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#39ff14]/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#bf00ff]/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
            <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-[#ff006e]/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

            <div className="bg-[#0a0e14]/90 backdrop-blur-md border-b border-[#39ff14]/20 p-5 flex items-center justify-between relative z-20 shrink-0 shadow-[0_0_20px_rgba(57,255,20,0.05)]">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 border border-[#39ff14]/30 rounded bg-[#39ff14]/5 animate-pulse shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                        <Terminal size={20} className="text-[#39ff14]" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white leading-none font-mono">
                            TARGET: <span className="text-[#39ff14] drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]">SYSTEM_ROOT</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500 font-mono">
                            <span className="flex items-center gap-1"><Activity size={10} className="text-[#39ff14]" /> DAEMON_ACTIVE</span>
                            <span className="text-gray-600">|</span>
                            <span>ID: GUEST-{Math.floor(Math.random() * 9999)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded text-xs font-mono text-gray-400">
                    <Lock size={12} />
                    <span>LOCKED: HACKER MODE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                <div className="w-full max-w-[1400px] mx-auto space-y-10">
                    <div className="bg-[#05070a]/80 border border-[#39ff14]/30 rounded-lg overflow-hidden backdrop-blur-sm relative shadow-[0_0_30px_rgba(57,255,20,0.05)]">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#39ff14] shadow-[0_0_15px_#39ff14]"></div>
                        <div className="bg-[#39ff14]/10 p-2 px-4 border-b border-[#39ff14]/20 flex justify-between items-center">
                            <span className="text-xs font-bold text-[#39ff14] uppercase tracking-widest flex items-center gap-2">
                                <Terminal size={12} /> /var/mission/briefing.txt
                            </span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#39ff14]/50"></div>
                                <div className="w-2 h-2 rounded-full bg-[#39ff14]/30"></div>
                                <div className="w-2 h-2 rounded-full bg-[#39ff14]/10"></div>
                            </div>
                        </div>
                        <div className="p-6 md:p-8 font-mono text-sm leading-relaxed">
                            <p className="text-[#39ff14] font-bold mb-4 animate-pulse">{">>>"} INCOMING ENCRYPTED TRANSMISSION...</p>
                            <p className="text-gray-300 mb-4">
                                Welcome, Operative. The system administrator <strong className="text-white">keamo</strong> has fragmented the master password across the infrastructure.
                            </p>
                            <p className="text-gray-300 mb-6">
                                Your objective is to perform a <strong className="text-white">Grey Box Penetration Test</strong>.
                                Locate all fragments, reconstruct the key, and escalate privileges to access the Administrator Dashboard.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-6 border-t border-[#39ff14]/10 pt-6">
                                <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold text-[#39ff14] uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.1)]">
                                    <Crosshair size={14} /> Status: {stage >= 4 ? 'COMPROMISED' : 'ENGAGED'}
                                </div>
                                <div className="bg-[#bf00ff]/10 border border-[#bf00ff]/30 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold text-[#bf00ff] uppercase tracking-wider shadow-[0_0_10px_rgba(191,0,255,0.1)]">
                                    <Network size={14} /> Scope: Localhost
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                lvl: 1,
                                title: "Reconnaissance",
                                desc: "Analyze System Logs for leaked Base64 credentials.",
                                target: "System Logs",
                                status: stage >= 1 ? 'COMPLETE' : 'ACTIVE'
                            },
                            {
                                lvl: 2,
                                title: "Decryption",
                                desc: "Decrypt developer notes using ASCII conversion tools.",
                                target: "Dev Notes",
                                status: stage >= 2 ? 'COMPLETE' : (stage === 1 ? 'ACTIVE' : 'LOCKED')
                            },
                            {
                                lvl: 3,
                                title: "Exploitation",
                                desc: "Reverse engineer authentication logic to bypass controls.",
                                target: "Source Viewer",
                                status: stage >= 3 ? 'COMPLETE' : (stage === 2 ? 'ACTIVE' : 'LOCKED')
                            },
                            {
                                lvl: 4,
                                title: "Network Sniffing",
                                desc: "Intercept transmission packets to find master key remnants.",
                                target: "Wireshark",
                                status: stage >= 4 ? 'COMPLETE' : (stage === 3 ? 'ACTIVE' : 'LOCKED')
                            }
                        ].map((step, i) => {
                            let borderColor = 'border-white/10';
                            let textColor = 'text-gray-500';
                            let statusColor = 'text-gray-600 border-gray-700';
                            let bgClass = 'bg-[#0a0e14]/60';

                            if (step.status === 'COMPLETE') {
                                borderColor = 'border-[#39ff14]/30';
                                bgClass = 'bg-[#39ff14]/5';
                                textColor = 'text-[#39ff14]';
                                statusColor = 'text-[#39ff14] border-[#39ff14]/30 bg-[#39ff14]/10 shadow-[0_0_8px_rgba(57,255,20,0.2)]';
                            } else if (step.status === 'ACTIVE') {
                                borderColor = 'border-[#bf00ff]/40 shadow-[0_0_15px_rgba(191,0,255,0.1)]';
                                bgClass = 'bg-[#bf00ff]/5';
                                textColor = 'text-white';
                                statusColor = 'text-[#bf00ff] border-[#bf00ff]/30 bg-[#bf00ff]/10 animate-pulse';
                            }

                            return (
                                <div key={i} className={`p-5 border rounded-lg backdrop-blur-sm transition-all ${borderColor} ${bgClass}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`font-mono text-xs font-bold ${textColor}`}>PHASE 0{step.lvl}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                                            {step.status}
                                        </span>
                                    </div>
                                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${textColor === 'text-gray-500' ? 'text-gray-400' : 'text-white'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed font-mono">
                                        {step.desc} <br />
                                        <span className="text-gray-600 mt-2 block">{">"} Target: {step.target}</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm font-mono uppercase tracking-widest border-b border-[#ff006e]/30 pb-2 w-fit">
                            <Server size={14} className="text-[#ff006e]" /> Available Tools
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { id: AppId.TERMINAL, label: 'Terminal', icon: Terminal, locked: false },
                                { id: AppId.SYSTEM_LOGS, label: 'Log Analysis', icon: FileText, locked: false },
                                { id: AppId.DEV_NOTES, label: 'Dev Secrets', icon: Database, locked: stage < 1 },
                                { id: AppId.SOURCE_VIEWER, label: 'Source Code', icon: Code, locked: stage < 2 }
                            ].map((tool, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOpenApp(tool.id)}
                                    disabled={tool.locked}
                                    className={`
                                        group p-4 bg-[#0d1117] border border-white/5 rounded-lg hover:border-[#bf00ff]/30 transition-all flex flex-col items-center gap-3 relative overflow-hidden
                                        ${tool.locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#bf00ff]/5 hover:shadow-[0_0_15px_rgba(191,0,255,0.1)]'}
                                    `}
                                >
                                    {tool.locked && (
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                                    )}
                                    <div className={`${tool.locked ? 'text-gray-600' : 'text-gray-400 group-hover:text-[#bf00ff] transition-colors'}`}>
                                        {tool.locked ? <Lock size={24} /> : <tool.icon size={24} />}
                                    </div>
                                    <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-300">
                                        {tool.label}
                                    </span>
                                    {!tool.locked && (
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#bf00ff]/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="font-mono text-xs text-gray-500 border-t border-white/10 pt-4 flex justify-between items-center">
                        <span className="flex items-center gap-2">root@kali:/var/www/html# <span className="w-2 h-4 bg-[#39ff14] animate-pulse"></span></span>
                        <span className="text-[#39ff14]/50 uppercase tracking-wider text-[10px]">Kali GNU/Linux Rolling</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

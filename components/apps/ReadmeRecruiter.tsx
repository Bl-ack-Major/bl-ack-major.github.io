
import React from 'react';
// Added TrendingUp to the imports from lucide-react
import { Briefcase, FileText, Award, Layers, Mail, Linkedin, Terminal, Shield, Zap, Target, Code, Globe, CheckCircle, ArrowRight, Download, BookOpen, Cpu, Link as LinkIcon, Star, UserCheck, TrendingUp } from 'lucide-react';
import { AppId } from '../../types';
import { RESUME_DATA, SOCIAL_LINKS } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

interface ReadmeRecruiterProps {
    onOpenApp?: (id: AppId, props?: any) => void;
}

export const ReadmeRecruiter: React.FC<ReadmeRecruiterProps> = ({ onOpenApp }) => {
    const { isLightMode } = useTheme();
    
    const handleOpen = (id: AppId, props?: any) => {
        if (onOpenApp) onOpenApp(id, props);
    };

    // Theme Configuration
    const bgClass = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-100';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-md hover:shadow-lg' : 'bg-[#1c1c1e]/60 border-white/10 hover:bg-white/[0.08]';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const buttonBg = isLightMode ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-transparent text-gray-300 hover:text-white border-white/20 hover:border-cyan-400/50';

    return (
        <div className={`h-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-500`}>
            {/* Chromomorphism Background Layers */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[80px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
                </>
            )}
            
            {/* Subtle Grid Texture */}
            <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none ${isLightMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}></div>

            {/* Header - Glass Bar (Mac-like Toolbar) */}
            <div className={`relative z-20 px-8 py-5 flex items-center justify-between shrink-0 backdrop-blur-xl border-b shadow-sm ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl border shadow-inner backdrop-blur-md ${isLightMode ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-white/10 text-cyan-400'}`}>
                        <Briefcase size={22} className="drop-shadow-md" />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold tracking-tight leading-none drop-shadow-sm ${textMain}`}>Candidate Overview</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLightMode ? 'bg-emerald-500' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`}></span>
                            <span className={`text-[10px] font-medium tracking-wide uppercase ${isLightMode ? 'text-emerald-600' : 'text-emerald-400'}`}>Learning & Growing</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-sm ${isLightMode ? 'bg-white/50 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                        <UserCheck size={12} className={textSec} />
                        <span className={`text-[10px] font-mono ${isLightMode ? 'text-slate-600' : 'text-gray-300'}`}>ID: KEAMO-SEC</span>
                    </div>
                    <button 
                        onClick={() => window.open('https://drive.google.com/file/d/1DLKUPEC1VHe13CKf_iQ7mp1IdeLWrS0S/view?usp=sharing', '_blank')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${isLightMode ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200' : 'bg-[#367BF0] hover:bg-[#2563eb] text-white shadow-blue-900/20'}`}
                    >
                        <Download size={14} /> <span className="hidden sm:inline">Save PDF</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                <div className="w-full max-w-[1600px] mx-auto space-y-10 min-h-full flex flex-col">
                    
                    {/* Hero Section */}
                    <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
                        <div className="flex-1 space-y-6">
                            <h2 className={`text-4xl md:text-5xl font-bold leading-normal tracking-tight ${textMain}`}>
                                <span className="block opacity-90">Securing Foundations.</span>
                                <span className={`inline-block text-transparent bg-clip-text drop-shadow-sm pb-4 ${isLightMode ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600' : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500'}`}>Mapping Progress.</span>
                            </h2>
                            <p className={`text-lg leading-relaxed max-w-2xl font-light ${isLightMode ? 'text-slate-600' : 'text-gray-300/80'}`}>
                                I am an entry-level Security Engineer focused on solidifying the basics of network defense and cloud security. This portfolio acts as a transparent log of my training—explore my labs and current learning path below.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                                <button 
                                    onClick={() => handleOpen(AppId.RESUME)}
                                    className={`group relative px-6 py-3 rounded-xl border font-semibold text-sm transition-all backdrop-blur-md overflow-hidden ${isLightMode ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm' : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                    <span className="relative flex items-center gap-2">
                                        <FileText size={18} className={isLightMode ? 'text-cyan-600' : 'text-cyan-300'} /> View CV
                                    </span>
                                </button>
                                <button 
                                    onClick={() => handleOpen(AppId.CONTACT)}
                                    className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 ${buttonBg}`}
                                >
                                    <Mail size={18} /> Connect
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats / Highlights Widget */}
                        <div className="w-full lg:w-auto grid grid-cols-2 gap-4 min-w-[300px]">
                            <div 
                                onClick={() => handleOpen(AppId.LEARNING, { initialTab: 'certs' })}
                                className={`${cardBg} backdrop-blur-xl border rounded-2xl p-5 transition-all cursor-pointer group ${isLightMode ? 'hover:border-cyan-400' : 'hover:border-cyan-500/30'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border mb-3 group-hover:scale-110 transition-transform ${isLightMode ? 'bg-cyan-100 border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                                    <Award className={isLightMode ? 'text-cyan-600' : 'text-cyan-400'} size={20} />
                                </div>
                                <div className={`text-2xl font-bold mb-0.5 ${textMain}`}>3+</div>
                                <div className={`text-[10px] uppercase font-bold tracking-wider ${textSec}`}>Certifications</div>
                            </div>

                            <div 
                                onClick={() => handleOpen(AppId.PROJECTS)}
                                className={`${cardBg} backdrop-blur-xl border rounded-2xl p-5 transition-all cursor-pointer group ${isLightMode ? 'hover:border-purple-400' : 'hover:border-purple-500/30'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border mb-3 group-hover:scale-110 transition-transform ${isLightMode ? 'bg-purple-100 border-purple-200' : 'bg-purple-500/10 border-purple-500/20'}`}>
                                    <Code className={isLightMode ? 'text-purple-600' : 'text-purple-400'} size={20} />
                                </div>
                                <div className={`text-2xl font-bold mb-0.5 ${textMain}`}>5+</div>
                                <div className={`text-[10px] uppercase font-bold tracking-wider ${textSec}`}>Active Labs</div>
                            </div>

                            <div 
                                onClick={() => handleOpen(AppId.CTF)}
                                className={`col-span-2 ${cardBg} backdrop-blur-xl border rounded-2xl p-5 transition-all cursor-pointer group flex items-center justify-between ${isLightMode ? 'hover:border-green-400' : 'hover:border-green-500/30'}`}
                            >
                                <div>
                                    <div className={`text-xl font-bold ${textMain}`}>In Progress</div>
                                    <div className={`text-[10px] uppercase font-bold tracking-wider ${textSec}`}>TryHackMe Learning Path</div>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${isLightMode ? 'bg-green-100 border-green-200 group-hover:bg-green-200' : 'bg-green-500/10 border-green-500/20 group-hover:bg-green-500/20'}`}>
                                    <TrendingUp className={isLightMode ? 'text-green-600' : 'text-green-400'} size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Competencies (Cards) */}
                    <section>
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 pl-1 ${textSec}`}>
                            <Zap size={14} className="text-yellow-400" /> Focus Areas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Cloud Security', icon: <Cpu size={24} />, desc: 'Currently learning AWS infrastructure hardening and least-privilege IAM management.', color: isLightMode ? 'text-blue-600' : 'text-blue-400', bg: isLightMode ? 'bg-blue-100 border-blue-200' : 'bg-blue-500/10 border-blue-500/20' },
                                { title: 'Security Monitoring', icon: <Shield size={24} />, desc: 'Familiarizing with log analysis and basic incident detection workflows.', color: isLightMode ? 'text-purple-600' : 'text-purple-400', bg: isLightMode ? 'bg-purple-100 border-purple-200' : 'bg-purple-500/10 border-purple-500/20' },
                                { title: 'Network Basics', icon: <Terminal size={24} />, desc: 'Building labs to practice Nmap scanning, packet capture, and Linux hardening.', color: isLightMode ? 'text-red-600' : 'text-red-400', bg: isLightMode ? 'bg-red-100 border-red-200' : 'bg-red-500/10 border-red-500/20' }
                            ].map((skill, i) => (
                                <div key={i} className={`backdrop-blur-md border rounded-2xl p-6 transition-all group hover:-translate-y-1 ${cardBg}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform duration-300 ${skill.bg}`}>
                                        <div className={skill.color}>{skill.icon}</div>
                                    </div>
                                    <h4 className={`text-lg font-bold mb-2 ${textMain}`}>{skill.title}</h4>
                                    <p className={`text-sm leading-relaxed ${textSec}`}>{skill.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Module Navigation (Control Center) */}
                    <section className="flex-1">
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 pl-1 ${textSec}`}>
                            <Layers size={14} className="text-cyan-400" /> Current Tracking
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { id: AppId.PROJECTS, label: 'Labs', sub: 'Practical Practice', icon: Code, color: isLightMode ? 'text-pink-600' : 'text-pink-400' },
                                { id: AppId.LEARNING, label: 'Education', sub: 'Certifications', icon: Award, color: isLightMode ? 'text-yellow-600' : 'text-yellow-400' },
                                { id: AppId.TOOLS, label: 'Toolbox', sub: 'Active Learning', icon: Terminal, color: isLightMode ? 'text-green-600' : 'text-green-400' },
                                { id: AppId.BLOG, label: 'Write-ups', sub: 'Documentation', icon: Globe, color: isLightMode ? 'text-cyan-600' : 'text-cyan-400' },
                            ].map((item, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleOpen(item.id)}
                                    className={`group relative flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl border transition-all text-left ${cardBg}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200 group-hover:bg-slate-100' : 'bg-black/20 border-white/5 group-hover:bg-white/5'}`}>
                                        <item.icon size={22} className={item.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`block font-bold text-sm ${textMain}`}>{item.label}</span>
                                        <span className={`text-xs transition-colors ${textSec} group-hover:${textMain}`}>{item.sub}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1 ${isLightMode ? 'text-slate-400 group-hover:text-slate-800' : 'text-gray-600 group-hover:text-white'}`}>
                                        <ArrowRight size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Footer Contact - Compact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 mt-auto">
                        <a 
                            href={`mailto:${RESUME_DATA.header.email}`} 
                            className={`border p-4 rounded-xl flex items-center gap-4 transition-all group ${cardBg}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/10 text-blue-400'}`}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className={`text-sm font-bold ${textMain}`}>Email</div>
                                <div className={`text-xs ${textSec}`}>{RESUME_DATA.header.email}</div>
                            </div>
                        </a>
                        <a 
                            href={SOCIAL_LINKS.linkedin} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`border p-4 rounded-xl flex items-center gap-4 transition-all group ${cardBg}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${isLightMode ? 'bg-[#0077b5]/20 text-[#0077b5]' : 'bg-[#0077b5]/10 text-[#0077b5]'}`}>
                                <Linkedin size={20} />
                            </div>
                            <div>
                                <div className={`text-sm font-bold ${textMain}`}>LinkedIn</div>
                                <div className={`text-xs ${textSec}`}>Connect Professionally</div>
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

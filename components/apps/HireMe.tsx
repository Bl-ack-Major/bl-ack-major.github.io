
import React from 'react';
import { Briefcase, MapPin, Download, CheckCircle, Target, Users, Zap, ExternalLink, Calendar, Mail, Globe, Shield, Radio, Activity, Send, Code } from 'lucide-react';
import { RESUME_DATA } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

const HireMe: React.FC = () => {
    const { isLightMode } = useTheme();

    // Theme Config
    const bgClass = isLightMode ? 'bg-[#f0f4f8]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-sm hover:shadow-md' : 'bg-white/5 border-white/10 hover:bg-white/[0.07]';
    const infoBg = isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/10';

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-500`}>
            {/* Chromomorphism / Ambient Background Effects */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-[80px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-1000" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                    <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none" />
                </>
            )}

            {/* Header */}
            <div className={`relative z-10 backdrop-blur-xl border-b p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 ${headerBg}`}>
                <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${isLightMode ? 'bg-cyan-50 border-cyan-100 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLightMode ? 'bg-cyan-500' : 'bg-cyan-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isLightMode ? 'bg-cyan-600' : 'bg-cyan-500'}`}></span>
                        </span>
                        Status: Available
                    </div>
                    <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${textMain}`}>
                        Engagement <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">Protocol</span>
                    </h1>
                    <p className={`text-sm md:text-base max-w-xl font-light ${textSec}`}>
                        Deploying offensive security expertise to fortify defensive architectures.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => window.open(`mailto:${RESUME_DATA.header.email}`)}
                        className={`group border border-transparent px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isLightMode ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-300' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]'}`}
                    >
                        <Send size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> Initiate Comms
                    </button>
                    <button 
                        onClick={() => window.open('https://drive.google.com/file/d/1DLKUPEC1VHe13CKf_iQ7mp1IdeLWrS0S/view?usp=sharing', '_blank')}
                        className={`border px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all backdrop-blur-md ${isLightMode ? 'bg-white/50 hover:bg-white text-slate-700 border-slate-200' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}
                    >
                        <Download size={18} /> Access Dossier
                    </button>
                </div>
            </div>

            {/* Main Content - Full Stretch */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10 w-full">
                <div className="w-full max-w-[1800px] mx-auto space-y-8 h-full flex flex-col">
                    
                    {/* Hero Statement */}
                    <div className={`border-l-4 border-cyan-500 p-6 rounded-r-xl backdrop-blur-sm ${isLightMode ? 'bg-gradient-to-r from-cyan-50 to-transparent' : 'bg-gradient-to-r from-[#1a1c23]/50 to-transparent'}`}>
                        <h2 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${textMain}`}>
                            <Radio className="text-cyan-400 animate-pulse" /> Ready to Deploy
                        </h2>
                        <p className={`leading-relaxed text-sm md:text-base max-w-3xl ${textSec}`}>
                            Currently my backround is in <strong className={textMain}>Penetration Testing</strong>, <strong className={textMain}>Security Analysis (SOC)</strong>, and <strong className={textMain}>Security Engineering</strong>. My approach combines technical rigor with business risk intelligence.
                        </p>
                    </div>

                    {/* Value Proposition Grid */}
                    <section className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                            <div className={`backdrop-blur-md border rounded-2xl p-6 transition-all group flex flex-col ${cardBg} ${isLightMode ? 'hover:border-cyan-400' : 'hover:border-cyan-500/50'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-all ${isLightMode ? 'bg-cyan-100 border-cyan-200 shadow-sm' : 'bg-cyan-500/10 border-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>
                                    <Shield size={24} className={isLightMode ? 'text-cyan-600' : 'text-cyan-400'} />
                                </div>
                                <h3 className={`font-bold text-lg mb-2 ${textMain}`}>Operational Security</h3>
                                <p className={`text-sm leading-relaxed flex-1 ${textSec}`}>
                                    Proactive threat hunting and vulnerability assessment. I don't just find flags; I analyze the kill chain to prevent recurrence.
                                </p>
                            </div>
                            <div className={`backdrop-blur-md border rounded-2xl p-6 transition-all group flex flex-col ${cardBg} ${isLightMode ? 'hover:border-violet-400' : 'hover:border-violet-500/50'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-all ${isLightMode ? 'bg-violet-100 border-violet-200 shadow-sm' : 'bg-violet-500/10 border-violet-500/20 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'}`}>
                                    <Activity size={24} className={isLightMode ? 'text-violet-600' : 'text-violet-400'} />
                                </div>
                                <h3 className={`font-bold text-lg mb-2 ${textMain}`}>Risk Mitigation</h3>
                                <p className={`text-sm leading-relaxed flex-1 ${textSec}`}>
                                    Translating technical findings into actionable business intelligence. Clear reporting that bridges the gap between engineering and management.
                                </p>
                            </div>
                            <div className={`backdrop-blur-md border rounded-2xl p-6 transition-all group flex flex-col ${cardBg} ${isLightMode ? 'hover:border-emerald-400' : 'hover:border-emerald-500/50'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-all ${isLightMode ? 'bg-emerald-100 border-emerald-200 shadow-sm' : 'bg-emerald-500/10 border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                                    <Code size={24} className={isLightMode ? 'text-emerald-600' : 'text-emerald-400'} />
                                </div>
                                <h3 className={`font-bold text-lg mb-2 ${textMain}`}>DevSecOps Integration</h3>
                                <p className={`text-sm leading-relaxed flex-1 ${textSec}`}>
                                    Automating security checks within the CI/CD pipeline. Proficient in shell scripting for custom tool development and automation.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Logistics & Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className={`backdrop-blur-xl border rounded-2xl p-8 flex flex-col justify-between ${infoBg}`}>
                            <div>
                                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${textMain}`}>
                                    <Target className="text-red-400" /> Mission Parameters
                                </h2>
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {['Junior Penetration Tester', 'SOC Analyst', 'Security Engineer', 'AppSec'].map(role => (
                                        <span key={role} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-default ${isLightMode ? 'bg-white border-slate-200 text-slate-600 hover:border-blue-300' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'}`}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className={`space-y-4 pt-6 border-t ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={`${textSec} flex items-center gap-2`}><MapPin size={16}/> Base of Operations</span>
                                    <span className={`${textMain} font-medium`}>Remote / Hybrid (Johannesburg)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={`${textSec} flex items-center gap-2`}><Briefcase size={16}/> Engagement Type</span>
                                    <span className={`${textMain} font-medium`}>Full-time</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={`${textSec} flex items-center gap-2`}><Calendar size={16}/> Deployment Readiness</span>
                                    <span className="text-cyan-400 font-bold">Immediate</span>
                                </div>
                            </div>
                        </section>

                        <section className={`backdrop-blur-xl border rounded-2xl p-8 relative overflow-hidden ${infoBg}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
                            
                            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${textMain}`}>
                                <Users className="text-blue-400" /> Cultural Alignment
                            </h2>
                            
                            <div className="space-y-6 relative z-10">
                                <p className={`leading-relaxed text-sm ${textSec}`}>
                                    I thrive in environments that value <strong className={textMain}>integrity</strong>, <strong className={textMain}>curiosity</strong>, and <strong className={textMain}>collaboration</strong>. I'm looking for a team where knowledge sharing is standard protocol and security is a collective responsibility.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-xl border transition-colors ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        <div className={`font-bold mb-1 text-sm ${textMain}`}>Self-Starter</div>
                                        <div className={`text-xs ${textSec}`}>Autonomous learner who takes initiative on complex problems.</div>
                                    </div>
                                    <div className={`p-4 rounded-xl border transition-colors ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        <div className={`font-bold mb-1 text-sm ${textMain}`}>Team Player</div>
                                        <div className={`text-xs ${textSec}`}>Believes security is a collective responsibility, not a silo.</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HireMe;


import React from 'react';
import { Flag, Trophy, Target, Globe, Map, ExternalLink, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { CTF_STATS, CTF_GOALS, FAVORITE_CHALLENGES } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

const CTFChallenges: React.FC = () => {
    const { isLightMode } = useTheme();

    // --- Theme Config ---
    const bgClass = isLightMode ? 'bg-[#f0f4f8]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-[#1c1c1e]/60 border-white/10 shadow-2xl';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const heroBg = isLightMode 
        ? 'bg-gradient-to-r from-red-50 to-white border-red-100 shadow-sm' 
        : 'bg-gradient-to-r from-red-900/10 to-transparent border-white/10';

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-red-500/30 overflow-hidden relative transition-colors duration-500`}>
            {/* Chromomorphism Background */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-1000" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                </>
            )}
            
            {/* Glass Header */}
            <div className={`relative z-10 backdrop-blur-xl border-b p-6 flex items-center justify-between shrink-0 shadow-sm ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border ${isLightMode ? 'bg-red-100 border-red-200 text-red-600' : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-white/10 text-red-500'}`}>
                        <Map className="drop-shadow-sm" size={24} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold tracking-tight leading-none ${textMain}`}>
                            Security Journey
                        </h1>
                        <p className={`text-xs font-medium mt-1 ${textSec}`}>
                            The Ascent: From Novice to Cybersecurity Specialist
                        </p>
                    </div>
                </div>
                <div className={`hidden md:flex gap-3 text-xs font-mono ${isLightMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border backdrop-blur-sm ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                        <Trophy size={14} className="text-yellow-500"/> Skill Building
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border backdrop-blur-sm ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                        <TrendingUp size={14} className="text-green-500"/> Current Progress
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative z-10">
                <div className="w-full max-w-[1800px] mx-auto space-y-8">
                    
                    {/* Hero Narrative */}
                    <div className={`border rounded-3xl p-8 relative overflow-hidden backdrop-blur-md ${heroBg}`}>
                        <div className={`absolute top-0 right-0 p-8 ${isLightMode ? 'text-red-500 opacity-5' : 'opacity-5'}`}>
                            <Target size={200} />
                        </div>
                        <div className="relative z-10 max-w-3xl">
                            <h2 className={`text-2xl font-bold mb-4 ${textMain}`}>Documenting My Path to Proficiency.</h2>
                            <p className={`text-sm leading-relaxed mb-6 ${isLightMode ? 'text-slate-600' : 'text-gray-300'}`}>
                                Every expert was once a beginner. This dashboard tracks my day-to-day progress on <strong className={textMain}>TryHackMe</strong> and <strong className={textMain}>HackTheBox</strong>. By logging my rank and solved machines publicly, I stay accountable to my goal of becoming a Senior Cybersecurity Analyst.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] shadow-md ${isLightMode ? 'bg-white border-slate-200 text-slate-400' : 'bg-[#1c1c1e] border-[#30363d] text-gray-500'}`}>
                                            <Users size={12} />
                                        </div>
                                    ))}
                                </div>
                                <span className={`text-xs ${textSec}`}>Early Stage: Continuous Learning in Progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT: Current Status (The Badge) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
                                    <Shield className="text-red-500" size={20} /> Current Status
                                </h3>
                            </div>

                            {/* TryHackMe Showcase */}
                            {CTF_STATS.filter(p => p.name === 'TryHackMe').map((platform, i) => (
                                <div key={i} className={`backdrop-blur-xl border rounded-3xl p-8 relative group transition-all ${cardBg} ${isLightMode ? 'hover:border-red-400' : 'hover:border-red-500/30'}`}>
                                    <div className="absolute top-4 right-4">
                                        <span className={`flex items-center gap-1 text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${isLightMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
                                            Learning Path Active
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center justify-center py-8">
                                        {/* Static Badge Image */}
                                        <div className="relative">
                                            <div className={`absolute inset-0 blur-[50px] rounded-full transition-opacity duration-1000 ${isLightMode ? 'bg-red-200/60 opacity-40 group-hover:opacity-70' : 'bg-red-600/20 opacity-40 group-hover:opacity-60'}`}></div>
                                            <img 
                                                src={platform.badgeImageUrl} 
                                                alt="TryHackMe Profile Badge" 
                                                className="relative z-10 w-full max-w-[320px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>

                                    <div className={`mt-6 pt-6 border-t flex justify-between items-center ${isLightMode ? 'border-slate-100' : 'border-white/10'}`}>
                                        <div>
                                            <div className={`text-xs uppercase font-bold tracking-wider mb-1 ${textSec}`}>Platform Rank</div>
                                            <div className={`font-bold text-xl ${textMain}`}>{platform.rank}</div>
                                        </div>
                                        <a 
                                            href={platform.profileUrl} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className={`flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${isLightMode ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-[#C1272D] hover:bg-[#a01f24] shadow-red-900/20'}`}
                                        >
                                            View Progress <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {/* Other Platforms Mini-Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {CTF_STATS.filter(p => p.name !== 'TryHackMe').map((platform, i) => (
                                    <div key={i} className={`backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between transition-colors group ${isLightMode ? 'bg-white/60 border-slate-200 hover:bg-white' : 'bg-[#1c1c1e]/40 border-white/10 hover:bg-white/5'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-bold text-sm transition-colors ${isLightMode ? 'text-slate-800 group-hover:text-green-600' : 'text-white group-hover:text-green-400'}`}>{platform.name}</h4>
                                            {platform.name === 'HackTheBox' ? <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div> : null}
                                        </div>
                                        <div>
                                            <div className={`text-[10px] uppercase tracking-wide font-bold ${textSec}`}>Level</div>
                                            <div className={`text-sm font-mono ${isLightMode ? 'text-slate-700' : 'text-gray-300'}`}>{platform.rank}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Goals & Roadmap */}
                        <div className="lg:col-span-7 space-y-6">
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}>
                                <Flag className="text-yellow-500" size={20} /> Career Milestones
                            </h3>

                            <div className={`backdrop-blur-md border rounded-3xl p-1 overflow-hidden ${isLightMode ? 'bg-white/60 border-slate-200' : 'bg-[#1c1c1e]/40 border-white/10'}`}>
                                {CTF_GOALS.map((goal, i) => (
                                    <div key={i} className={`p-6 border-b last:border-0 transition-colors group ${isLightMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className={`text-sm font-bold mb-1 transition-colors ${isLightMode ? 'text-slate-800 group-hover:text-yellow-600' : 'text-white group-hover:text-yellow-400'}`}>{goal.title}</h4>
                                                <p className={`text-xs ${textSec}`}>{goal.description}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${
                                                goal.status === 'Achieved' 
                                                    ? (isLightMode ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-500/10 text-green-400 border-green-500/30')
                                                    : goal.status === 'In Progress'
                                                        ? (isLightMode ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30')
                                                        : (isLightMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white/5 text-gray-500 border-white/10')
                                            }`}>
                                                {goal.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-1 h-2 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-200 border-slate-300' : 'bg-black/40 border-white/5'}`}>
                                                <div 
                                                    className={`h-full transition-all duration-1000 relative rounded-full ${
                                                        goal.status === 'Achieved' ? 'bg-green-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                                                    }`} 
                                                    style={{ width: `${goal.progress}%` }}
                                                >
                                                    {goal.status === 'In Progress' && <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>}
                                                </div>
                                            </div>
                                            <div className="text-right w-24">
                                                <span className={`text-xs font-mono font-bold ${textMain}`}>{goal.currentValue}</span>
                                                {goal.targetValue && <span className={`text-[10px] ml-1 ${textSec}`}>➔ {goal.targetValue}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity / Pwns */}
                            <div className={`backdrop-blur-md border rounded-3xl p-6 ${isLightMode ? 'bg-white/60 border-slate-200' : 'bg-[#1c1c1e]/40 border-white/10'}`}>
                                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${textSec}`}>
                                    Initial Room Captures
                                </h3>
                                <div className="space-y-3">
                                    {FAVORITE_CHALLENGES.slice(0, 3).map((challenge, i) => (
                                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:-translate-y-0.5 group ${isLightMode ? 'bg-slate-50 border-slate-200 hover:border-blue-300' : 'bg-black/20 border-white/5 hover:border-blue-500/30'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px] ${challenge.difficulty === 'Easy' ? 'bg-green-500 shadow-green-500/50' : challenge.difficulty === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                                                <div>
                                                    <div className={`text-sm font-bold transition-colors ${isLightMode ? 'text-slate-800 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'}`}>{challenge.name}</div>
                                                    <div className={`text-[10px] font-medium ${textSec}`}>{challenge.platform} • {challenge.category}</div>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-mono px-2 py-1 rounded ${isLightMode ? 'bg-white text-slate-500 border border-slate-200' : 'text-gray-600 bg-white/5'}`}>{challenge.date}</span>
                                        </div>
                                    ))}
                                    <button className={`w-full text-center text-xs py-3 mt-2 transition-colors flex items-center justify-center gap-1 font-bold ${isLightMode ? 'text-slate-500 hover:text-slate-800' : 'text-gray-500 hover:text-white'}`}>
                                        Show All Started Modules <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Footer */}
                    <div className={`border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-6 pb-4 ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                        <div>
                            <h3 className={`font-bold ${textMain}`}>Let's Connect on TryHackMe</h3>
                            <p className={`text-sm ${textSec}`}>I'm looking to learn alongside other emerging analysts.</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://tryhackme.com/p/Kea.mo" target="_blank" rel="noreferrer" className={`p-2 rounded-lg border transition-all ${isLightMode ? 'bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50' : 'bg-white/5 border-white/10 text-gray-400 hover:text-[#C1272D] hover:bg-white/10'}`}>
                                <Globe size={20} />
                            </a>
                            <a href="#" className={`p-2 rounded-lg border transition-all ${isLightMode ? 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50' : 'bg-white/5 border-white/10 text-gray-400 hover:text-[#5865F2] hover:bg-white/10'}`}>
                                <Globe size={20} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CTFChallenges;

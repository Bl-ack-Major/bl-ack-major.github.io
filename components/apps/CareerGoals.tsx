import React from 'react';
import { Target, Compass, Zap, Layers, Cpu, Code, GitBranch, Flag, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { CAREER_GOALS } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

const CareerGoals: React.FC = () => {
    const { isLightMode } = useTheme();

    // Theme Config
    const bgClass = isLightMode ? 'bg-[#f0f4f8]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-[#1c1c1e]/80 border-white/10';
    const headerBorder = isLightMode ? 'border-slate-300' : 'border-white/10';

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans relative overflow-hidden selection:bg-pink-500/30 transition-colors duration-500`}>
            {/* Chromomorphism Background */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-1000" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                </>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
                <div className="w-full max-w-[1800px] mx-auto">
                    
                    {/* Hero Header */}
                    <div className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b ${headerBorder} pb-8 relative`}>
                        {/* Decorative Line */}
                        <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${isLightMode ? 'bg-pink-50 text-pink-600 border-pink-200' : 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.2)]'}`}>
                                    <span className="relative flex h-2 w-2">
                                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLightMode ? 'bg-pink-500' : 'bg-pink-400'}`}></span>
                                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isLightMode ? 'bg-pink-600' : 'bg-pink-500'}`}></span>
                                    </span>
                                    Active Strategy
                                </span>
                            </div>
                            <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight ${textMain}`}>
                                Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 drop-shadow-sm">Roadmap</span>
                            </h1>
                            <p className={`text-lg max-w-2xl leading-relaxed font-light ${textSec}`}>
                                A strategic trajectory focused on offensive security, cloud architecture, and continuous professional development.
                            </p>
                        </div>
                        
                        <div className={`flex flex-col items-start md:items-end gap-2 p-4 rounded-xl border backdrop-blur-sm ${isLightMode ? 'bg-white/60 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <span className={`text-xs font-mono uppercase tracking-widest ${textSec}`}>Current Trajectory</span>
                            <div className={`text-2xl font-bold flex items-center gap-2 ${textMain}`}>
                                <TrendingUp className="text-green-400" /> High Growth
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {/* Short Term */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-60 transition duration-500 blur"></div>
                            <div className={`relative backdrop-blur-xl p-8 rounded-2xl border h-full flex flex-col shadow-2xl ${cardBg} ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl border shadow-md ${isLightMode ? 'bg-pink-100 text-pink-600 border-pink-200' : 'bg-pink-500/20 text-pink-400 border-pink-500/30'}`}>
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${textMain}`}>Immediate Actions</h3>
                                        <p className={`text-xs font-mono mt-0.5 ${textSec}`}>0 - 6 Months</p>
                                    </div>
                                </div>
                                <ul className="space-y-4 flex-1">
                                    {CAREER_GOALS.shortTerm.map((goal, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-sm group/item ${isLightMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            <CheckCircle size={18} className="text-gray-500 mt-0.5 shrink-0 group-hover/item:text-pink-500 transition-colors" />
                                            <span className="leading-snug">{goal}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Medium Term */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-60 transition duration-500 blur"></div>
                            <div className={`relative backdrop-blur-xl p-8 rounded-2xl border h-full flex flex-col shadow-2xl ${cardBg} ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl border shadow-md ${isLightMode ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${textMain}`}>Mid-Term Targets</h3>
                                        <p className={`text-xs font-mono mt-0.5 ${textSec}`}>6 - 12 Months</p>
                                    </div>
                                </div>
                                <ul className="space-y-4 flex-1">
                                    {CAREER_GOALS.mediumTerm.map((goal, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-sm group/item ${isLightMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 group-hover/item:scale-125 transition-transform"></div>
                                            <span className="leading-snug">{goal}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Long Term / Vision */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-60 transition duration-500 blur"></div>
                            <div className={`relative backdrop-blur-xl p-8 rounded-2xl border h-full flex flex-col shadow-2xl ${cardBg} ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl border shadow-md ${isLightMode ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                                        <Flag size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${textMain}`}>Vision & Reach</h3>
                                        <p className={`text-xs font-mono mt-0.5 ${textSec}`}>12+ Months</p>
                                    </div>
                                </div>
                                <ul className="space-y-4 flex-1">
                                    {CAREER_GOALS.dreamProjects.map((project, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-sm group/item ${isLightMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            <StarIcon size={16} className="text-yellow-500 mt-0.5 shrink-0 group-hover/item:rotate-45 transition-transform" />
                                            <span className="leading-snug">{project}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Research Interests Grid */}
                    <div className="mb-16">
                        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${textMain}`}>
                            <Layers className="text-cyan-400" /> Research Focus Areas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {CAREER_GOALS.interests.map((interest, i) => (
                                <div key={i} className={`backdrop-blur-md rounded-xl p-6 transition-all group hover:-translate-y-1 border ${isLightMode ? 'bg-white/60 border-slate-200 hover:border-cyan-400 hover:shadow-md' : 'bg-[#1c1c1e]/60 hover:bg-white/5 border-white/10 hover:border-cyan-500/30'}`}>
                                    <div className={`mb-4 transition-colors p-2 rounded-lg w-fit ${isLightMode ? 'bg-slate-100 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-600' : 'text-gray-400 bg-white/5 group-hover:text-cyan-400 group-hover:bg-cyan-900/20'}`}>
                                        {getIconForInterest(interest.title)}
                                    </div>
                                    <h4 className={`font-bold mb-2 ${textMain}`}>{interest.title}</h4>
                                    <p className={`text-sm leading-relaxed ${textSec}`}>{interest.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Philosophy / Quote */}
                    <div className={`backdrop-blur-xl border rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl ${isLightMode ? 'bg-gradient-to-r from-slate-100 to-white border-slate-200' : 'bg-gradient-to-r from-[#1c1c1e]/80 to-[#0d1117]/80 border-white/10'}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
                        <div className={`absolute -left-10 bottom-0 ${isLightMode ? 'text-slate-200' : 'text-white/5'}`}>
                            <Compass size={120} />
                        </div>
                        <blockquote className={`text-xl md:text-3xl font-medium mb-6 max-w-4xl mx-auto leading-relaxed relative z-10 ${isLightMode ? 'text-slate-800' : 'text-gray-200'}`}>
                            "The only true security is the ability to adapt. My goal is not just to secure systems, but to understand the evolving landscape of threats to build resilient architectures."
                        </blockquote>
                        <p className="text-sm text-pink-500 uppercase tracking-widest font-bold relative z-10">Keamo - 2025</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper for icons based on text
const getIconForInterest = (title: string) => {
    if (title.includes('Network')) return <Zap size={24} />;
    if (title.includes('Vulnerability')) return <Target size={24} />;
    if (title.includes('Defensive')) return <ShieldIcon size={24} />;
    if (title.includes('Cloud')) return <Cpu size={24} />;
    return <Layers size={24} />;
};

const StarIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const ShieldIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

export default CareerGoals;
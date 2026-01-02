
import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle, Clock, Layout, Shield, Target, ExternalLink, GraduationCap, Zap } from 'lucide-react';
import { CERTIFICATIONS, COURSES, SKILLS_MATRIX } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

interface LearningProps {
    initialTab?: 'certs' | 'courses' | 'skills';
}

const Learning: React.FC<LearningProps> = ({ initialTab }) => {
    const [activeTab, setActiveTab] = useState<'certs' | 'courses' | 'skills'>(initialTab || 'certs');
    const { isLightMode } = useTheme();

    useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    // Theme Constants
    const bgMain = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const cardBg = isLightMode ? 'bg-white border-slate-200 shadow-sm hover:shadow-md' : 'bg-[#1c1c1e]/60 border-white/10 hover:bg-white/[0.07]';
    const badgeSuccess = isLightMode ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    const badgeWarning = isLightMode ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    const badgeNeutral = isLightMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white/5 text-gray-400 border-white/10';

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wide ${badgeSuccess}`}>
                    <CheckCircle size={12} /> Verified
                </span>
            );
            case 'in-progress': return (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wide ${badgeWarning}`}>
                    <Clock size={12} /> In Progress
                </span>
            );
            case 'planned': return (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wide ${badgeNeutral}`}>
                    <Target size={12} /> Planned
                </span>
            );
            default: return null;
        }
    };

    return (
        <div className={`h-full w-full flex flex-col ${bgMain} ${textMain} font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-500`}>
            {/* Ambient Backgrounds */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                </>
            )}

            {/* Header */}
            <div className={`relative z-10 backdrop-blur-xl border-b p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${isLightMode ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-white/10 text-yellow-500'}`}>
                        <Award size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight leading-none">Professional Development</h1>
                        <p className={`text-xs font-medium mt-1 ${textSec}`}>Continuous Learning & Certification Tracker</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`flex p-1 rounded-xl border backdrop-blur-sm ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                    {[
                        { id: 'certs', label: 'Certifications', icon: Shield },
                        { id: 'courses', label: 'Courses', icon: BookOpen },
                        { id: 'skills', label: 'Skills', icon: Layout }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                                activeTab === tab.id 
                                    ? (isLightMode ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'bg-white/10 text-white shadow-lg border border-white/10') 
                                    : (isLightMode ? 'text-slate-500 hover:text-slate-800' : 'text-gray-500 hover:text-white')
                            }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                
                {/* CERTIFICATIONS TAB */}
                {activeTab === 'certs' && (
                    <div className="w-full max-w-[1800px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <h3 className={`font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider pl-2 border-l-4 ${isLightMode ? 'text-slate-700 border-amber-500' : 'text-white border-yellow-500'}`}>
                                Active Pursuits
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {CERTIFICATIONS.filter(c => c.status === 'in-progress').map((cert, i) => (
                                    <div key={i} className={`group relative backdrop-blur-xl border rounded-3xl p-6 overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-xl ${cardBg} ${isLightMode ? 'hover:border-cyan-400' : 'hover:border-cyan-500/50'}`}>
                                        <div className="flex items-start justify-between mb-6 relative z-10">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform shadow-inner ${isLightMode ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-white/10 border-white/10 text-cyan-400'}`}>
                                                <Shield size={28} />
                                            </div>
                                            {renderStatusBadge(cert.status)}
                                        </div>

                                        <div className="relative z-10 flex-1 flex flex-col">
                                            <h4 className={`font-bold text-xl mb-1 leading-tight transition-colors ${isLightMode ? 'text-slate-800 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>{cert.name}</h4>
                                            <div className="flex items-center gap-2 mb-6">
                                                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/5 text-gray-400'}`}>{cert.platform}</span>
                                            </div>

                                            <div className="mt-auto space-y-3">
                                                <div className={`flex justify-between text-xs font-bold ${isLightMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                                    <span>Exam Readiness</span>
                                                    <span className={isLightMode ? 'text-cyan-600' : 'text-cyan-400'}>{cert.progress}%</span>
                                                </div>
                                                <div className={`w-full rounded-full h-2 overflow-hidden border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                                    <div 
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                                                        style={{ width: `${cert.progress}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <section>
                            <h3 className={`font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider pl-2 border-l-4 ${isLightMode ? 'text-slate-700 border-slate-400' : 'text-white border-gray-600'}`}>
                                Roadmap & Achievements
                            </h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                {CERTIFICATIONS.filter(c => c.status !== 'in-progress').map((cert, i) => (
                                    <div key={i} className={`backdrop-blur-md border rounded-2xl p-5 flex flex-col transition-all group h-full ${cardBg} ${cert.status === 'completed' ? (isLightMode ? 'hover:border-emerald-400' : 'hover:border-emerald-500/30') : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                                                cert.status === 'completed' 
                                                    ? (isLightMode ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400') 
                                                    : (isLightMode ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-gray-500')
                                            }`}>
                                                {cert.status === 'completed' ? <CheckCircle size={18} /> : <Target size={18} />}
                                            </div>
                                            {cert.status === 'completed' && <span className={`text-[10px] font-mono ${isLightMode ? 'text-emerald-600' : 'text-emerald-500/70'}`}>{cert.completedDate}</span>}
                                        </div>
                                        
                                        <h4 className={`font-bold text-sm mb-1 line-clamp-2 ${cert.status === 'completed' ? (isLightMode ? 'text-slate-800' : 'text-gray-200') : (isLightMode ? 'text-slate-400' : 'text-gray-400')}`}>{cert.name}</h4>
                                        <p className={`text-xs mb-4 ${textSec}`}>{cert.platform}</p>
                                        
                                        <div className="mt-auto">
                                            {renderStatusBadge(cert.status)}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </section>
                    </div>
                )}

                {/* COURSES TAB */}
                {activeTab === 'courses' && (
                     <div className="w-full max-w-[1800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                             {COURSES.map((course, i) => (
                                 <div key={i} className={`backdrop-blur-xl border rounded-3xl p-6 transition-all flex flex-col group relative overflow-hidden ${cardBg} ${isLightMode ? 'hover:border-blue-300' : 'hover:border-blue-500/40'}`}>
                                     
                                     <div className="flex justify-between items-start mb-4 relative z-10">
                                         <div className={`p-3 rounded-xl border transition-transform shadow-lg ${isLightMode ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} group-hover:scale-110`}>
                                             <GraduationCap size={24} />
                                         </div>
                                         {renderStatusBadge(course.status)}
                                     </div>
                                     
                                     <h4 className={`font-bold text-lg mb-1 transition-colors ${isLightMode ? 'text-slate-800 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'}`}>{course.name}</h4>
                                     <p className={`text-sm mb-6 font-medium flex items-center gap-2 ${textSec}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {course.platform}
                                     </p>
                                     
                                     <div className={`mt-auto pt-4 border-t relative z-10 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                                         {course.status === 'in-progress' && (
                                             <div className="space-y-2">
                                                <div className={`flex justify-between text-xs font-bold ${textSec}`}>
                                                    <span>Module Progress</span>
                                                    <span className="text-blue-500">{course.progress}%</span>
                                                </div>
                                                <div className={`w-full rounded-full h-1.5 border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                                                </div>
                                             </div>
                                         )}
                                         {course.status === 'completed' && (
                                             <div className={`flex justify-between items-center text-xs ${textSec}`}>
                                                 <span className={`flex items-center gap-1 font-bold ${isLightMode ? 'text-emerald-600' : 'text-emerald-500/80'}`}><CheckCircle size={12}/> Credential Earned</span>
                                                 <span className={`font-mono px-2 py-0.5 rounded ${isLightMode ? 'bg-slate-100' : 'bg-white/5'}`}>{course.completedDate}</span>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                )}

                {/* SKILLS TAB */}
                {activeTab === 'skills' && (
                    <div className="w-full max-w-[1800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {SKILLS_MATRIX.map((domain, i) => (
                                <div key={i} className={`backdrop-blur-xl border rounded-3xl overflow-hidden h-full flex flex-col transition-colors shadow-lg ${cardBg}`}>
                                    <div className={`px-6 py-4 border-b flex items-center gap-3 ${isLightMode ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                                        <div className={`p-2 rounded-lg border ${isLightMode ? 'bg-cyan-100 border-cyan-200 text-cyan-600' : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-white/10 text-cyan-400'}`}>
                                            <Layout size={18} />
                                        </div>
                                        <h3 className={`font-bold text-sm uppercase tracking-wide ${textMain}`}>{domain.category}</h3>
                                    </div>
                                    <div className="p-6 space-y-6 flex-1">
                                        {domain.skills.map((skill, j) => {
                                            const percentage = (skill.level / skill.max) * 100;
                                            let colorClass = 'bg-blue-500';
                                            
                                            if (percentage >= 80) {
                                                colorClass = isLightMode ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400';
                                            } else if (percentage >= 60) {
                                                colorClass = isLightMode ? 'bg-cyan-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500';
                                            } else {
                                                colorClass = isLightMode ? 'bg-slate-400' : 'bg-gray-600';
                                            }

                                            return (
                                                <div key={j} className="group">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className={`font-bold transition-colors ${isLightMode ? 'text-slate-700 group-hover:text-blue-600' : 'text-gray-200 group-hover:text-white'}`}>{skill.name}</span>
                                                        <span className={`text-xs font-mono transition-colors ${isLightMode ? 'text-slate-400 group-hover:text-cyan-600' : 'text-gray-500 group-hover:text-cyan-400'}`}>
                                                            {percentage >= 80 ? 'Expert' : percentage >= 50 ? 'Proficient' : 'Competent'}
                                                        </span>
                                                    </div>
                                                    <div className={`w-full rounded-full h-2.5 border overflow-hidden ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} 
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Learning;

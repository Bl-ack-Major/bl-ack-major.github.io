
import React from 'react';
import { FileText, Printer, Download, Mail, MapPin, Globe, Zap, GraduationCap, Briefcase, Award, Shield } from 'lucide-react';
import { RESUME_DATA } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

export const ResumeViewer: React.FC = () => {
    const { isLightMode } = useTheme();

    // Theme Config
    const bgClass = isLightMode ? 'bg-[#f3f4f6]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white shadow-sm border-slate-200' : 'bg-white/5 border-white/10';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    
    return (
        <div className={`h-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-500`}>
            {/* Background Ambience */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                </>
            )}

            {/* Toolbar */}
            <div className={`relative z-10 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center shrink-0 shadow-sm ${headerBg}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${isLightMode ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
                        <FileText size={18} />
                    </div>
                    <span className={`font-bold text-sm tracking-wide ${isLightMode ? 'text-slate-700' : 'text-gray-200'}`}>Resume_Keamo_2025.pdf</span>
                </div>
                <div className="flex gap-3">
                    <button 
                        className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-xs font-bold transition-all ${isLightMode ? 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'}`}
                        onClick={() => window.print()}
                    >
                        <Printer size={14} /> Print
                    </button>
                    <button 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${isLightMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-gray-200'}`}
                        onClick={() => window.open('https://drive.google.com/file/d/1DLKUPEC1VHe13CKf_iQ7mp1IdeLWrS0S/view?usp=sharing', '_blank')}
                    >
                        <Download size={14} /> Download PDF
                    </button>
                </div>
            </div>
            
            {/* Document Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                <div className="w-full max-w-[1200px] mx-auto space-y-8">
                    
                    {/* Header Section */}
                    <div className={`${cardBg} backdrop-blur-md border rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none transition-opacity opacity-50 ${isLightMode ? 'bg-gradient-to-br from-blue-100 to-transparent' : 'bg-gradient-to-br from-cyan-500/10 to-transparent'}`}></div>
                        
                        <div>
                            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 ${textMain}`}>
                                {RESUME_DATA.header.name}
                            </h1>
                            <p className={`text-xl font-medium mb-4 ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`}>{RESUME_DATA.header.title}</p>
                            
                            <div className={`flex flex-wrap gap-4 text-sm ${textSec}`}>
                                {[
                                    { icon: Mail, text: RESUME_DATA.header.email, color: isLightMode ? 'text-purple-600' : 'text-purple-400' },
                                    { icon: MapPin, text: RESUME_DATA.header.location, color: isLightMode ? 'text-blue-600' : 'text-blue-400' },
                                    { icon: Globe, text: RESUME_DATA.header.website, color: isLightMode ? 'text-green-600' : 'text-green-400' }
                                ].map((item, i) => (
                                    <span key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors cursor-default ${isLightMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-black/30 border-white/5 hover:border-white/10'}`}>
                                        <item.icon size={14} className={item.color} /> {item.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Sidebar (Skills, Education) */}
                        <div className="md:col-span-4 space-y-8">
                            
                            {/* Skills */}
                            <div className={`${cardBg} backdrop-blur-md border rounded-2xl p-6`}>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b ${isLightMode ? 'border-slate-100 text-slate-400' : 'border-white/5 text-white'}`}>
                                    <Zap size={16} className="text-yellow-400" /> Technical Arsenal
                                </h3>
                                <div className="space-y-6">
                                    {Object.entries(RESUME_DATA.skills).map(([category, skills]) => (
                                        <div key={category}>
                                            <h4 className={`text-xs font-bold uppercase mb-2 ${isLightMode ? 'text-cyan-600' : 'text-cyan-400'}`}>{category}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, i) => (
                                                    <span key={i} className={`px-2.5 py-1 rounded-md text-xs border transition-colors cursor-default ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white' : 'bg-black/40 border-white/5 text-gray-300 hover:text-white'}`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Education */}
                            <div className={`${cardBg} backdrop-blur-md border rounded-2xl p-6`}>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b ${isLightMode ? 'border-slate-100 text-slate-400' : 'border-white/5 text-white'}`}>
                                    <GraduationCap size={16} className="text-purple-400" /> Education
                                </h3>
                                <div className="space-y-6">
                                    {RESUME_DATA.education.map((edu, i) => (
                                        <div key={i} className={`relative pl-4 border-l-2 ${isLightMode ? 'border-purple-200' : 'border-purple-500/30'}`}>
                                            <h4 className={`font-bold text-sm ${textMain}`}>{edu.degree}</h4>
                                            <div className={`text-xs mt-1 mb-2 ${textSec}`}>{edu.school} • {edu.year}</div>
                                            {edu.details && <p className={`text-[11px] leading-relaxed ${isLightMode ? 'text-slate-500' : 'text-gray-500'}`}>{edu.details}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Main Content (Experience) */}
                        <div className="md:col-span-8 space-y-8">
                            
                            {/* Summary */}
                            <div className={`${cardBg} backdrop-blur-md border rounded-2xl p-8 relative`}>
                                <div className="absolute top-6 left-0 w-1 h-8 bg-blue-500 rounded-r-full"></div>
                                <h3 className={`text-lg font-bold mb-4 ${textMain}`}>Professional Profile</h3>
                                <p className={`leading-relaxed text-sm md:text-base ${isLightMode ? 'text-slate-600' : 'text-gray-300'}`}>
                                    {RESUME_DATA.summary}
                                </p>
                            </div>

                            {/* Experience */}
                            <div className={`${cardBg} backdrop-blur-md border rounded-2xl p-8`}>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-2 pb-4 border-b ${isLightMode ? 'border-slate-100 text-slate-400' : 'border-white/5 text-white'}`}>
                                    <Briefcase size={16} className="text-blue-400" /> Experience
                                </h3>
                                
                                <div className="space-y-12">
                                    {RESUME_DATA.experience.map((job, i) => (
                                        <div key={i} className="relative group">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                                <div>
                                                    <h4 className={`text-xl font-bold transition-colors ${isLightMode ? 'text-slate-800 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>{job.role}</h4>
                                                    <div className="text-blue-400 font-medium text-sm mt-1">{job.company}</div>
                                                </div>
                                                <div className={`font-mono text-xs mt-2 md:mt-0 px-3 py-1 rounded-full border w-fit ${isLightMode ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-white/5 text-gray-500 border-white/5'}`}>
                                                    {job.period}
                                                </div>
                                            </div>
                                            
                                            <ul className="space-y-3 mt-4">
                                                {job.achievements.map((ach, j) => (
                                                    <li key={j} className={`flex items-start gap-3 text-sm transition-colors ${isLightMode ? 'text-slate-600 group-hover:text-slate-800' : 'text-gray-300 group-hover:text-gray-200'}`}>
                                                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isLightMode ? 'bg-cyan-500' : 'bg-cyan-500/50'}`}></span>
                                                        <span className="leading-relaxed">{ach}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className={`${cardBg} backdrop-blur-md border rounded-2xl p-8`}>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b ${isLightMode ? 'border-slate-100 text-slate-400' : 'border-white/5 text-white'}`}>
                                    <Award size={16} className="text-green-400" /> Certifications & Badges
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['CCST Networking', 'CCST Cybersecurity', 'Certified in Cybersecurity (CC)'].map((cert, i) => (
                                        <div key={i} className={`border rounded-xl p-4 flex items-center gap-3 transition-colors ${isLightMode ? 'bg-slate-50 border-slate-200 hover:border-green-400/50' : 'bg-black/30 border-white/5 hover:border-green-500/30'}`}>
                                            <div className={`p-2 rounded-lg ${isLightMode ? 'bg-green-100 text-green-600' : 'bg-green-500/10 text-green-400'}`}>
                                                <Shield size={18} />
                                            </div>
                                            <span className={`text-xs font-bold ${textMain}`}>{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeViewer;

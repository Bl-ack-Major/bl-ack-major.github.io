
import React, { useState } from 'react';
import { BookOpen, ChevronLeft, Calendar, Tag, Clock, FileText, CheckCircle, Target, List, Play, Lightbulb, Code, Lock, Eye, ExternalLink, X, ChevronRight, Hash, ArrowRight } from 'lucide-react';
import { WRITEUPS_DATA } from '../../constants';
import { WriteUp } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const Blog: React.FC = () => {
    const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);
    const [activeLevelIndex, setActiveLevelIndex] = useState(0);
    const [showPdf, setShowPdf] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const { isLightMode } = useTheme();

    const categories = ['All', 'Articles & Reports', 'Research', 'CTF Write-ups'];
    const filteredWriteUps = WRITEUPS_DATA.filter(w => activeCategory === 'All' || w.category === activeCategory);

    const handleSelectWriteUp = (w: WriteUp) => {
        setSelectedWriteUp(w);
        setActiveLevelIndex(0);
        setShowPdf(false);
    };

    const handleBack = () => {
        setSelectedWriteUp(null);
        setShowPdf(false);
    };

    // Theme Variables
    const bgClass = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e]/60 border-white/10';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';

    // --- Detail View ---
    if (selectedWriteUp) {
        return (
            <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden transition-colors duration-500`}>
                {/* Background */}
                {isLightMode ? (
                    <>
                        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
                    </>
                ) : (
                    <>
                        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    </>
                )}

                {/* Header / Nav */}
                <div className={`relative z-20 backdrop-blur-xl border-b p-4 flex items-center justify-between shrink-0 shadow-sm ${headerBg}`}>
                    <button 
                        onClick={handleBack}
                        className={`flex items-center gap-2 transition-colors group px-3 py-1.5 rounded-lg ${isLightMode ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                    >
                        <div className={`p-1 rounded-full transition-colors ${isLightMode ? 'bg-slate-200 group-hover:bg-slate-300' : 'bg-white/10 group-hover:bg-white/20'}`}>
                            <ChevronLeft size={16} />
                        </div>
                        <span className="text-sm font-medium">Back to Feed</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${isLightMode ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.2)]'}`}>
                            {selectedWriteUp.status}
                        </span>
                        {showPdf && (
                            <button 
                                onClick={() => setShowPdf(false)}
                                className={`text-xs flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${isLightMode ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 border-white/10 text-gray-200'}`}
                            >
                                <X size={14} /> Close PDF
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden relative z-10">
                    {/* PDF Overlay */}
                    {showPdf && (
                        <div className="absolute inset-0 z-30 bg-[#1a1a1a] flex flex-col">
                            <object
                                data={`${selectedWriteUp.pdfPath}#toolbar=0`}
                                type="application/pdf"
                                className="w-full h-full"
                            >
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <FileText size={48} className="mb-4" />
                                    <p className="mb-4">Unable to embed PDF.</p>
                                    <a href={selectedWriteUp.pdfPath} target="_blank" rel="noreferrer" className="text-cyan-400 underline">Download Here</a>
                                </div>
                            </object>
                        </div>
                    )}

                    {/* Timeline Sidebar (Desktop) */}
                    {!showPdf && selectedWriteUp.levels && selectedWriteUp.levels.length > 0 && (
                        <div className={`w-64 backdrop-blur-md border-r overflow-y-auto hidden lg:block custom-scrollbar shrink-0 ${isLightMode ? 'bg-white/50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <div className={`p-4 border-b ${isLightMode ? 'border-slate-200' : 'border-white/5'}`}>
                                <h3 className={`text-xs font-bold uppercase tracking-widest ${textSec}`}>Attack Chain</h3>
                            </div>
                            <div className="p-2 space-y-1">
                                {selectedWriteUp.levels.map((level, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveLevelIndex(idx)}
                                        className={`w-full text-left p-3 rounded-lg transition-all flex flex-col relative group ${
                                            activeLevelIndex === idx
                                            ? (isLightMode ? 'bg-cyan-50 border-l-2 border-cyan-500 shadow-sm' : 'bg-cyan-500/10 border-l-2 border-cyan-500 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]')
                                            : 'hover:bg-black/5 border-l-2 border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <span className={`text-[10px] uppercase font-bold mb-1 ${activeLevelIndex === idx ? 'text-cyan-500' : textSec}`}>
                                            {level.level}
                                        </span>
                                        <span className={`text-xs font-medium leading-snug ${activeLevelIndex === idx ? textMain : textSec}`}>
                                            {level.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                        <div className="w-full max-w-[1800px] mx-auto space-y-8">
                            
                            {/* Title Block */}
                            <div>
                                <h1 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight ${textMain}`}>
                                    {selectedWriteUp.title}
                                </h1>
                                <div className={`flex flex-wrap items-center gap-4 text-xs font-mono border-b pb-6 ${isLightMode ? 'text-slate-500 border-slate-200' : 'text-gray-400 border-white/10'}`}>
                                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded border ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}><Calendar size={14} className="text-cyan-400"/> {selectedWriteUp.date}</span>
                                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded border ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}><Clock size={14} className="text-purple-400"/> {selectedWriteUp.readingTime}</span>
                                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded border ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}><Hash size={14} className="text-green-400"/> {selectedWriteUp.category}</span>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            {activeLevelIndex === 0 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className={`p-6 backdrop-blur-md rounded-2xl border relative overflow-hidden shadow-xl ${isLightMode ? 'bg-white/60 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                                        <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${textMain}`}>
                                            <Target className="text-cyan-500" size={18} /> Executive Summary
                                        </h3>
                                        <p className={`leading-relaxed text-sm ${isLightMode ? 'text-slate-600' : 'text-gray-300'}`}>
                                            {selectedWriteUp.summary}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {selectedWriteUp.tags.map(tag => (
                                            <span key={tag} className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-default ${isLightMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-black/40 text-gray-300 border-white/10 hover:border-cyan-500/50'}`}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Mobile/Tablet Nav */}
                                    <div className="lg:hidden">
                                        <h3 className={`text-sm font-bold uppercase mb-2 ${textSec}`}>Progression</h3>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {selectedWriteUp.levels.map((lvl, i) => (
                                                <button 
                                                    key={i} 
                                                    onClick={() => setActiveLevelIndex(i)}
                                                    className={`px-4 py-2 rounded border text-xs whitespace-nowrap transition-all ${activeLevelIndex === i ? 'bg-cyan-500/20 border-cyan-500 text-cyan-600' : `bg-transparent ${isLightMode ? 'border-slate-200' : 'border-white/10'} text-gray-400`}`}
                                                >
                                                    {lvl.level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Level Detail View */}
                            {selectedWriteUp.levels && selectedWriteUp.levels.length > 0 && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded text-sm font-bold border ${isLightMode ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]'}`}>
                                            {selectedWriteUp.levels[activeLevelIndex].level}
                                        </div>
                                        <h2 className={`text-2xl font-bold ${textMain}`}>
                                            {selectedWriteUp.levels[activeLevelIndex].title}
                                        </h2>
                                    </div>

                                    <div className="space-y-8">
                                        <section>
                                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textSec}`}>
                                                <Target size={16} className="text-red-400" /> Objective
                                            </h3>
                                            <p className={`text-base leading-relaxed pl-4 border-l-2 border-red-500/50 ${isLightMode ? 'text-slate-700' : 'text-gray-200'}`}>
                                                {selectedWriteUp.levels[activeLevelIndex].objective}
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textSec}`}>
                                                <Lightbulb size={16} className="text-yellow-400" /> Thought Process
                                            </h3>
                                            <div className={`backdrop-blur-md p-5 rounded-xl border text-sm leading-relaxed ${isLightMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-300'}`}>
                                                {selectedWriteUp.levels[activeLevelIndex].thoughtProcess}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textSec}`}>
                                                <List size={16} className="text-blue-400" /> Methodology
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedWriteUp.levels[activeLevelIndex].keySteps.map((step, i) => (
                                                    <div key={i} className={`flex gap-3 p-3 rounded-lg border ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                                                        <span className="text-blue-400 font-mono font-bold text-xs mt-0.5">{i + 1}.</span>
                                                        <span className={`text-sm ${isLightMode ? 'text-slate-700' : 'text-gray-300'}`}>{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textSec}`}>
                                                <Code size={16} className="text-green-400" /> Artifacts & Evidence
                                            </h3>
                                            <div className={`font-mono text-xs p-4 rounded-xl border overflow-x-auto shadow-inner relative ${isLightMode ? 'bg-slate-100 border-slate-200 text-green-700' : 'bg-black/50 border-white/10 text-green-400'}`}>
                                                <div className="absolute top-2 right-2 flex gap-1 opacity-50">
                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                </div>
                                                <pre>{selectedWriteUp.levels[activeLevelIndex].evidence}</pre>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${textSec}`}>
                                                <Lock size={16} className="text-purple-400" /> Lessons Learned
                                            </h3>
                                            <div className={`border p-4 rounded-xl text-sm italic ${isLightMode ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-purple-900/10 border-purple-500/20 text-purple-200 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]'}`}>
                                                "{selectedWriteUp.levels[activeLevelIndex].learned}"
                                            </div>
                                        </section>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className={`flex justify-between pt-8 border-t ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                        <button 
                                            disabled={activeLevelIndex === 0}
                                            onClick={() => setActiveLevelIndex(p => p - 1)}
                                            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${activeLevelIndex === 0 ? 'text-gray-500 cursor-not-allowed' : (isLightMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-white')}`}
                                        >
                                            <ChevronLeft size={16} /> Previous Phase
                                        </button>
                                        <button 
                                            disabled={activeLevelIndex === selectedWriteUp.levels.length - 1}
                                            onClick={() => setActiveLevelIndex(p => p + 1)}
                                            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${activeLevelIndex === selectedWriteUp.levels.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}`}
                                        >
                                            Next Phase <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Full PDF CTA */}
                            <div className={`mt-12 pt-8 border-t ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <div className={`border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${isLightMode ? 'bg-gradient-to-r from-blue-50 to-white border-blue-100 hover:border-blue-200' : 'bg-gradient-to-r from-white/5 to-transparent border-white/10 hover:border-white/20'}`}>
                                    <div>
                                        <h3 className={`font-bold mb-1 ${textMain}`}>Detailed Technical Report</h3>
                                        <p className={`text-xs ${textSec}`}>View the original documentation including screenshots and raw logs.</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowPdf(true)}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${isLightMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                                    >
                                        <Eye size={16} /> View PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- List View ---
    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans relative overflow-hidden selection:bg-cyan-500/30 transition-colors duration-500`}>
            {/* Background Ambience */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-100/60 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                </>
            )}

            {/* Header */}
            <div className={`relative z-20 backdrop-blur-xl border-b p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-sm ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isLightMode ? 'bg-cyan-100 text-cyan-600' : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 text-cyan-400'}`}>
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none">Intelligence Feed</h1>
                        <p className={`text-xs font-medium mt-1 ${textSec}`}>Technical write-ups and research findings.</p>
                    </div>
                </div>
                
                {/* Categories */}
                <div className={`flex p-1 rounded-xl border backdrop-blur-sm ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                activeCategory === cat 
                                    ? (isLightMode ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'bg-white/10 text-white shadow-sm border border-white/5')
                                    : (isLightMode ? 'text-slate-500 hover:text-slate-800' : 'text-gray-500 hover:text-white')
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative z-10">
                <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {filteredWriteUps.map((writeup, i) => (
                        <div 
                            key={writeup.id} 
                            onClick={() => handleSelectWriteUp(writeup)}
                            className={`backdrop-blur-md border rounded-2xl overflow-hidden transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-1 ${cardBg} ${isLightMode ? 'hover:border-cyan-400 hover:shadow-md' : 'hover:border-cyan-500/40 hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]'}`}
                        >
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${isLightMode ? 'bg-blue-50 text-blue-600 border-blue-100' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'}`}>
                                        {writeup.category}
                                    </span>
                                    <span className={`text-[10px] flex items-center gap-1 ${writeup.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                                        {writeup.status === 'Completed' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                    </span>
                                </div>
                                
                                <h3 className={`text-lg font-bold mb-2 transition-colors line-clamp-2 ${isLightMode ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>
                                    {writeup.title}
                                </h3>
                                
                                <p className={`text-sm mb-4 line-clamp-3 flex-1 leading-relaxed ${textSec}`}>
                                    {writeup.summary}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {writeup.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded border ${isLightMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'text-gray-500 bg-black/20 border-white/5'}`}>
                                            <Hash size={10} /> {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className={`flex items-center justify-between pt-4 border-t text-xs font-mono mt-auto ${isLightMode ? 'border-slate-100 text-slate-400' : 'border-white/5 text-gray-500'}`}>
                                    <span>{writeup.date}</span>
                                    <span className={`flex items-center gap-1 transition-colors font-bold ${isLightMode ? 'text-slate-600 group-hover:text-cyan-600' : 'text-gray-400 group-hover:text-white'}`}>
                                        Read <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;

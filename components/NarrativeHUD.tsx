
import React, { useState } from 'react';
import { useNarrative } from '../contexts/NarrativeContext';
import { BookOpen, ChevronDown, ChevronUp, Lock, CheckCircle, CircleDot, Trophy, Download, Award, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { generateCertificate } from '../services/certificateGenerator';

const NarrativeHUD: React.FC = () => {
    const { currentChapter, chapters, clues } = useNarrative();
    const { account } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    const isCampaignComplete = currentChapter > chapters.length;

    // Determine which chapter to display data for (active or last completed)
    const displayChapterId = isCampaignComplete ? chapters.length : currentChapter;
    const currentChapterData = chapters.find(c => c.id === displayChapterId);

    // Calculate clue progress for the active chapter
    const activeClues = clues.filter(c => c.chapter === displayChapterId);
    const discoveredCount = activeClues.filter(c => c.discovered).length;

    const handleDownloadCertificate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!account) return;
        const dataUrl = generateCertificate(account.displayName || account.username, new Date().toLocaleDateString());
        const link = document.createElement('a');
        link.download = `CTF_Certificate_${account.username}.png`;
        link.href = dataUrl;
        link.click();
    };

    // Minimized Completed State
    if (isCampaignComplete && !isOpen) {
        return (
            <div
                onClick={() => setIsOpen(true)}
                className="fixed top-16 right-4 z-[100] cursor-pointer bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md border border-blue-500/50 p-2 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center gap-3 pr-4 animate-in fade-in slide-in-from-right duration-500 group hover:scale-105 transition-transform"
            >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shadow-inner">
                    <Trophy size={14} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">Mission Complete</span>
            </div>
        );
    }

    return (
        <div
            className={`fixed top-16 right-4 md:right-4 z-[100] w-[calc(100vw-2rem)] md:w-80 bg-black/80 backdrop-blur-md border border-[#367BF0]/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] text-gray-200 transition-all duration-300 font-sans ${isOpen ? 'max-h-[600px]' : 'max-h-[62px]'}`}
        >
            {/* Header */}
            <div
                className={`px-4 py-3.5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors select-none ${isOpen ? 'border-b border-white/10' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="text-[#367BF0] drop-shadow-[0_0_8px_rgba(54,123,240,0.5)]">
                        <BookOpen size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold leading-tight">Case File</span>
                        <span className="text-sm font-bold text-white leading-tight flex items-center gap-2">
                            {isCampaignComplete ? 'Campaign Report' : `Ch.${currentChapter}: ${currentChapterData?.title}`}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Progress Dots (Only active during campaign) */}
                    {!isCampaignComplete && (
                        <div className="flex gap-1.5">
                            {activeClues.map((clue, idx) => (
                                <div
                                    key={clue.id}
                                    title={clue.title}
                                    className={`w-2 h-2 rounded-full transition-all duration-500 ${clue.discovered
                                            ? 'bg-[#367BF0] shadow-[0_0_8px_#367BF0] scale-110'
                                            : 'bg-gray-700'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                    <div className="text-gray-500 hover:text-white transition-colors">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                {/* Completion View */}
                {isCampaignComplete ? (
                    <div className="p-6 text-center bg-gradient-to-b from-[#367BF0]/10 to-transparent">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse">
                            <Trophy size={32} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2 tracking-tight">System Secured</h2>
                        <p className="text-xs text-gray-400 mb-6 px-2 leading-relaxed">
                            You have successfully uncovered the breach, identified the insider, and neutralized the exfiltration attempt.
                        </p>
                        <button
                            onClick={handleDownloadCertificate}
                            className="w-full py-2.5 bg-[#367BF0] hover:bg-[#2d6cdb] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#367BF0]/40"
                        >
                            <Download size={14} /> Download Certificate
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Chapter List */}
                        <div className="p-2 space-y-0.5 bg-black/20">
                            {chapters.map((chapter) => {
                                const isCurrent = chapter.id === currentChapter;
                                const isLocked = !chapter.isUnlocked;
                                const isDone = chapter.isCompleted;

                                // Clues for this specific chapter in the list
                                const chapClues = clues.filter(c => c.chapter === chapter.id);
                                const chapFound = chapClues.filter(c => c.discovered).length;

                                return (
                                    <div
                                        key={chapter.id}
                                        className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${isCurrent
                                                ? 'bg-[#367BF0]/10 border border-[#367BF0]/20'
                                                : 'hover:bg-white/5 border border-transparent'
                                            } ${isLocked ? 'opacity-40' : 'opacity-100'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-5 h-5 flex items-center justify-center
                                                ${isDone ? 'text-green-400' : isCurrent ? 'text-[#367BF0] animate-pulse' : 'text-gray-600'}
                                            `}>
                                                {isDone ? <CheckCircle size={16} /> : isLocked ? <Lock size={14} /> : <CircleDot size={16} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-medium ${isCurrent ? 'text-white font-bold' : 'text-gray-400'}`}>
                                                    {chapter.id}. {chapter.title}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Indicator */}
                                        {isCurrent && (
                                            <span className="text-[10px] font-mono text-[#367BF0] font-bold bg-[#367BF0]/10 px-1.5 py-0.5 rounded">
                                                {chapFound}/{chapClues.length}
                                            </span>
                                        )}
                                        {isDone && (
                                            <div className="flex items-center gap-1 text-[9px] text-green-500 font-bold uppercase tracking-wider bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                                <Award size={10} /> Complete
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Current Objective */}
                        <div className="p-4 border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#367BF0] mb-2 flex items-center gap-2">
                                <AlertCircle size={12} /> Objective
                            </h4>
                            <p className="text-xs text-gray-300 leading-relaxed font-light">
                                {currentChapterData?.description}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NarrativeHUD;

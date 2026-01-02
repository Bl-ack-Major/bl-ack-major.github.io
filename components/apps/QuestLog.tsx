
import React, { useState } from 'react';
import { Target, CheckCircle, Award, Lock, Zap, Trophy, Activity, Crosshair, Terminal, Gift, Unlock } from 'lucide-react';
import { useQuest } from '../../contexts/QuestContext';
import { useTheme } from '../../contexts/ThemeContext';

const QuestLog: React.FC = () => {
    const { quests, rewards, xp, level, claimReward } = useQuest();
    const [activeTab, setActiveTab] = useState<'main' | 'side' | 'rewards'>('main');
    const { isLightMode } = useTheme();

    const mainStoryQuests = quests.filter(q => q.category === 'Main Story');
    const sideOpsQuests = quests.filter(q => q.category === 'Side Op');
    
    // XP Progress to next level
    const XP_PER_LEVEL = 250;
    const currentLevelBaseXP = (level - 1) * XP_PER_LEVEL;
    const progressInLevel = Math.max(0, xp - currentLevelBaseXP);
    const requiredInLevel = XP_PER_LEVEL;
    const xpProgress = Math.min(100, (progressInLevel / requiredInLevel) * 100);
    const isMaxLevel = level === 5;

    // Theme Variables
    const bgClass = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e]/60 border-white/10 shadow-xl';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    
    const strokeDasharray = `${xpProgress}, 100`;

    const renderMainQuestCard = (quest: any) => {
        const progressPercent = Math.min(100, Math.round((quest.progress / quest.requirements[0].count) * 100));
        
        return (
            <div key={quest.id} className={`group relative backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 ${cardBg} ${quest.isCompleted ? 'opacity-60 hover:opacity-100 border-green-500/20' : (isLightMode ? 'hover:border-cyan-400 hover:shadow-md' : 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]')}`}>
                
                {quest.isCompleted && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center rounded-2xl overflow-hidden">
                        <div className={`border-2 px-4 py-1 font-black text-4xl uppercase opacity-20 -rotate-12 select-none ${isLightMode ? 'text-green-600 border-green-600' : 'text-green-500 border-green-500/20'}`}>
                            Completed
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${
                            quest.isCompleted 
                                ? (isLightMode ? 'bg-green-100 text-green-600 border-green-200' : 'bg-green-500/10 border-green-500/30 text-green-500') 
                                : (isLightMode ? 'bg-cyan-100 text-cyan-600 border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400')
                        }`}>
                            {quest.isCompleted ? <CheckCircle size={20} /> : <Target size={20} />}
                        </div>
                        <div>
                            <div className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 font-bold ${isLightMode ? 'text-cyan-600' : 'text-cyan-500/70'}`}>Primary Objective</div>
                            <h3 className={`font-bold text-lg ${textMain}`}>{quest.title}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-xs font-bold font-mono px-3 py-1.5 rounded-lg border ${
                            quest.isCompleted 
                                ? (isLightMode ? 'bg-green-50 text-green-600 border-green-200' : 'bg-green-500/10 border-green-500/20 text-green-400') 
                                : (isLightMode ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400')
                        }`}>
                            {quest.xp} XP
                        </div>
                    </div>
                </div>

                <p className={`text-sm mb-6 pl-14 leading-relaxed border-l-2 ml-5 ${isLightMode ? 'text-slate-600 border-slate-200' : 'text-gray-400 border-white/5'}`}>
                    {quest.description}
                </p>

                <div className="pl-14 pr-2 relative z-10">
                    <div className={`flex justify-between text-[9px] uppercase font-bold mb-2 font-mono ${textSec}`}>
                        <span>Progress Status</span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-200 border-slate-300' : 'bg-black/40 border-white/5'}`}>
                        <div 
                            className={`h-full transition-all duration-700 ease-out relative ${quest.isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        >
                            {!quest.isCompleted && <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSideOpCard = (quest: any) => {
        const progressPercent = Math.min(100, Math.round((quest.progress / quest.requirements[0].count) * 100));
        const typeLabel = quest.requirements[0].type ? quest.requirements[0].type.split('_')[0] : 'GENERIC';

        return (
            <div key={quest.id} className={`backdrop-blur-md border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between h-full group hover:-translate-y-1 shadow-lg ${cardBg} ${quest.isCompleted ? 'opacity-60 hover:opacity-100' : (isLightMode ? 'hover:border-purple-300' : 'hover:border-purple-500/40')}`}>
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border font-bold ${
                            quest.isCompleted 
                                ? (isLightMode ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-500/10 border-green-500/20 text-green-500') 
                                : (isLightMode ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-purple-500/10 border-purple-500/20 text-purple-400')
                        }`}>
                            {typeLabel}
                        </span>
                        <span className={`text-[10px] font-bold transition-colors ${textSec} group-hover:${textMain}`}>{quest.xp} XP</span>
                    </div>
                    <h4 className={`text-sm font-bold mb-1 leading-tight ${textMain}`}>{quest.title}</h4>
                    <p className={`text-[10px] mb-4 line-clamp-2 leading-relaxed ${textSec}`}>{quest.description}</p>
                </div>
                
                <div className="mt-auto">
                    <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-200 border-slate-300' : 'bg-black/40 border-white/5'}`}>
                        <div 
                            className={`h-full ${quest.isCompleted ? 'bg-green-600' : 'bg-purple-600'}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-500`}>
            {isLightMode ? (
                <>
                    <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-cyan-100/60 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/60 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] left-[-20%] w-[700px] h-[700px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                </>
            )}

            <div className={`relative z-20 p-6 border-b backdrop-blur-xl shrink-0 shadow-sm ${headerBg}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className={isLightMode ? "text-slate-200" : "text-white/10"} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path 
                                    className="text-cyan-500" 
                                    strokeDasharray={strokeDasharray} 
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className={`text-[10px] font-mono font-bold ${textSec}`}>LVL</span>
                                <span className={`text-xl font-black leading-none ${textMain}`}>{level}</span>
                            </div>
                        </div>
                        
                        <div>
                            <h1 className={`text-xl font-bold tracking-tight uppercase flex items-center gap-2 ${textMain}`}>
                                <Activity className="text-cyan-500" size={20} /> Mission Control
                            </h1>
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className={`h-2 w-32 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-200 border-slate-300' : 'bg-black/40 border-white/5'}`}>
                                    <div className="h-full bg-cyan-500" style={{ width: isMaxLevel ? '100%' : `${xpProgress}%` }}></div>
                                </div>
                                <span className={`text-[10px] font-mono font-bold ${textSec}`}>
                                    {isMaxLevel ? 'MAX RANK' : `${Math.floor(progressInLevel)}/${requiredInLevel} XP`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`hidden md:block text-right px-4 py-2 rounded-xl border backdrop-blur-sm ${isLightMode ? 'bg-white/60 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <div className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 ${textSec}`}>Total Score</div>
                        <div className={`text-2xl font-black font-mono ${textMain}`}>{xp.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className={`flex border-b backdrop-blur-sm shrink-0 ${isLightMode ? 'bg-white/50 border-slate-200' : 'bg-black/20 border-white/10'}`}>
                <button 
                    onClick={() => setActiveTab('main')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-b-2 ${activeTab === 'main' ? (isLightMode ? 'border-cyan-500 text-cyan-600 bg-cyan-50' : 'border-cyan-500 text-white bg-cyan-500/10') : 'border-transparent text-gray-500 hover:text-gray-400'}`}
                >
                    <Crosshair size={14} /> Operations
                </button>
                <button 
                    onClick={() => setActiveTab('side')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-b-2 ${activeTab === 'side' ? (isLightMode ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-purple-500 text-white bg-purple-500/10') : 'border-transparent text-gray-500 hover:text-gray-400'}`}
                >
                    <Terminal size={14} /> Side Ops
                </button>
                <button 
                    onClick={() => setActiveTab('rewards')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-b-2 ${activeTab === 'rewards' ? (isLightMode ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-yellow-500 text-white bg-yellow-500/10') : 'border-transparent text-gray-500 hover:text-gray-400'}`}
                >
                    <Gift size={14} /> Vault
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                <div className="w-full max-w-[1800px] mx-auto">
                    {activeTab === 'main' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${textSec}`}>Active Campaign</span>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isLightMode ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : 'bg-cyan-900/20 text-cyan-400 border-cyan-900/30'}`}>
                                    {mainStoryQuests.filter(q => q.isCompleted).length}/{mainStoryQuests.length} Completed
                                </span>
                            </div>
                            {mainStoryQuests.map(q => renderMainQuestCard(q))}
                        </div>
                    )}

                    {activeTab === 'side' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {sideOpsQuests.map(q => renderSideOpCard(q))}
                        </div>
                    )}

                    {activeTab === 'rewards' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className={`border p-5 rounded-2xl flex items-center gap-4 mb-6 shadow-sm ${isLightMode ? 'bg-amber-50 border-amber-200' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                                <div className={`p-2 rounded-xl ${isLightMode ? 'bg-amber-100 text-amber-600' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    <Trophy className="shrink-0" size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold ${isLightMode ? 'text-amber-800' : 'text-yellow-100'}`}>Asset Vault</h3>
                                    <p className={`text-xs mt-0.5 ${isLightMode ? 'text-amber-600' : 'text-yellow-500/70'}`}>Level up to decrypt restricted system assets.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {rewards.map((reward) => {
                                    const isUnlocked = level >= reward.unlockLevel;
                                    return (
                                        <div key={reward.id} className={`group relative backdrop-blur-md border rounded-xl p-1 transition-all ${cardBg} ${isUnlocked ? (isLightMode ? 'border-yellow-300 hover:border-yellow-400' : 'border-yellow-500/30 hover:border-yellow-500/60') : 'opacity-60'}`}>
                                            <div className="flex items-stretch">
                                                <div className={`w-20 flex flex-col items-center justify-center border-r ${
                                                    isUnlocked 
                                                        ? (isLightMode ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-500/10 border-yellow-500/20') 
                                                        : (isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/5')
                                                }`}>
                                                    {isUnlocked ? <Unlock size={24} className="text-yellow-500 drop-shadow-md" /> : <Lock size={24} className="text-gray-500" />}
                                                    <span className="text-[10px] font-bold mt-2 font-mono text-gray-500">LVL {reward.unlockLevel}</span>
                                                </div>
                                                <div className="flex-1 p-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm font-bold ${isUnlocked ? textMain : 'text-gray-500'}`}>{reward.title}</h4>
                                                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${isLightMode ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-black/40 text-gray-400 border border-white/10'}`}>{reward.type}</span>
                                                    </div>
                                                    <p className={`text-xs mb-4 leading-relaxed ${textSec}`}>{reward.description}</p>
                                                    
                                                    {isUnlocked ? (
                                                        <button 
                                                            onClick={() => claimReward(reward.id)}
                                                            disabled={reward.isClaimed}
                                                            className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                                reward.isClaimed 
                                                                    ? (isLightMode ? 'bg-green-100 text-green-700 border border-green-200 cursor-default' : 'bg-green-500/10 text-green-500 cursor-default border border-green-500/20')
                                                                    : (isLightMode ? 'bg-yellow-400 hover:bg-yellow-300 text-white shadow-md' : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]')
                                                            }`}
                                                        >
                                                            {reward.isClaimed ? 'Decrypted & Available' : 'Decrypt Asset'}
                                                        </button>
                                                    ) : (
                                                        <div className={`w-full py-2 border rounded-lg text-center text-[10px] font-mono uppercase tracking-widest font-bold ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-black/20 border-white/5 text-gray-600'}`}>
                                                            Access Denied
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestLog;

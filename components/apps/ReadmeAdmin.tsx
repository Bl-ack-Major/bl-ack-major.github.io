
import React from 'react';
import { Trophy, Unlock, Terminal, Code, CheckCircle, AlertTriangle, Gift, Shield, Cpu, Zap, Ghost, Activity, Eye, Network, Lock, Fingerprint, FileText, ExternalLink } from 'lucide-react';
import { AppId } from '../../types';

interface ReadmeAdminProps {
    onOpenApp?: (id: AppId) => void;
}

export const ReadmeAdmin: React.FC<ReadmeAdminProps> = ({ onOpenApp }) => {
    
    const handleOpen = (id: AppId) => {
        if (onOpenApp) onOpenApp(id);
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] text-gray-200 font-sans selection:bg-purple-500/30 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-blue-900/30 p-6 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
                        <Shield size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-2">
                            Administrator Dashboard
                            <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">ROOT</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-mono mt-1">System Integrity: 100% Verified</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3 text-xs font-mono text-purple-500/70">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-900/10 rounded-full border border-purple-900/30">
                        <Fingerprint size={12} /> SESSION_SECURE
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                <div className="max-w-6xl mx-auto space-y-12">
                    
                    {/* Hero Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                <Trophy size={180} />
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    <CheckCircle size={12} /> Challenge Completed
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4 py-1">Access Granted, Administrator.</h2>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
                                    You have successfully navigated the security layers, decrypted the artifacts, and reconstructed the master key. 
                                    The system is now fully unlocked.
                                </p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleOpen(AppId.HIRE_ME)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                                    >
                                        <Terminal size={16} /> Recruit Keamo
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity size={14} /> Attack Chain Summary
                            </h3>
                            <div className="space-y-4 font-mono text-xs">
                                <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded border border-gray-800">
                                    <span className="text-gray-400">Fragment 1</span>
                                    <span className="text-green-400 font-bold">DECODED</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded border border-gray-800">
                                    <span className="text-gray-400">Fragment 2</span>
                                    <span className="text-green-400 font-bold">DECRYPTED</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded border border-gray-800">
                                    <span className="text-gray-400">Fragment 3</span>
                                    <span className="text-green-400 font-bold">REVERSED</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                                <span className="text-white font-bold text-lg tracking-wider">yOuHaveHAckedM3</span>
                                <p className="text-[10px] text-gray-500 mt-1">MASTER KEY VERIFIED</p>
                            </div>
                        </div>
                    </div>

                    {/* Unlocked Tools Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Unlock className="text-purple-500" size={20} /> Unlocked Capabilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { 
                                    id: AppId.SOURCE_VIEWER, 
                                    label: "Source Code", 
                                    icon: Math.random() > 0.5 ? Code : Activity, // Use Code for consistency
                                    color: "text-purple-400", 
                                    desc: "Authentication Logic exposed."
                                },
                                { 
                                    id: AppId.WIRESHARK, 
                                    label: "Network Sniffer", 
                                    icon: Network, 
                                    color: "text-blue-400", 
                                    desc: "Full packet capture data."
                                },
                                { 
                                    id: AppId.TERMINAL, 
                                    label: "Root Shell", 
                                    icon: Terminal, 
                                    color: "text-gray-200", 
                                    desc: "Sudo privileges enabled."
                                },
                                { 
                                    id: AppId.DEV_NOTES, 
                                    label: "Dev Secrets", 
                                    icon: FileText, 
                                    color: "text-yellow-400", 
                                    desc: "Unredacted developer logs."
                                }
                            ].map((tool, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleOpen(tool.id)}
                                    className="bg-[#121212] hover:bg-[#1a1a1a] border border-gray-800 hover:border-purple-500/30 p-5 rounded-xl text-left transition-all group flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-[#1f1f1f] rounded-lg group-hover:bg-purple-900/10 transition-colors">
                                            <tool.icon size={20} className={`${tool.color} group-hover:text-purple-400 transition-colors`} />
                                        </div>
                                        <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="mt-auto">
                                        <h4 className="text-white font-bold text-sm mb-1">{tool.label}</h4>
                                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{tool.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Easter Eggs */}
                    <div className="bg-[#121212] border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Ghost size={120} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Gift className="text-pink-500" /> Hidden Features
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { cmd: "cowsay", desc: "Moo." },
                                    { cmd: "sl", desc: "Steam Locomotive" },
                                    { cmd: "cmatrix", desc: "The Matrix" },
                                    { cmd: "neofetch", desc: "Sys Info" }
                                ].map((egg, i) => (
                                    <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-lg hover:border-pink-500/30 transition-colors group">
                                        <code className="text-pink-400 font-bold block mb-1 font-mono group-hover:text-pink-300">$ {egg.cmd}</code>
                                        <p className="text-[10px] text-gray-500">{egg.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-pink-900/10 border border-pink-900/20 rounded-lg flex items-center gap-3">
                                <Zap size={16} className="text-pink-500" />
                                <span className="text-xs text-pink-200/80">
                                    Try running these commands in the Terminal for some classic Linux fun.
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

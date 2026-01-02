
import React, { useState } from 'react';
import { Server, Shield, Activity, Cpu, Network, Lock, AlertTriangle, Terminal, Database, Cloud, Wifi, Monitor, HardDrive, Router, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const HomeLab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'topology' | 'scenarios' | 'specs'>('topology');
    const { isLightMode } = useTheme();

    // Lab Nodes Configuration
    const nodes = [
        { id: 'kali', name: 'Kali Linux', role: 'Attacker / C2', ip: '192.168.1.15', icon: Terminal, color: 'text-red-500', bg: isLightMode ? 'bg-red-100 border-red-200' : 'bg-red-500/10 border-red-500/30', border: isLightMode ? 'border-red-200' : 'border-red-500/30', status: 'Online' },
        { id: 'pfsense', name: 'pfSense', role: 'Firewall / Gateway', ip: '192.168.1.1', icon: Shield, color: 'text-orange-500', bg: isLightMode ? 'bg-orange-100 border-orange-200' : 'bg-orange-500/10 border-orange-500/30', border: isLightMode ? 'border-orange-200' : 'border-orange-500/30', status: 'Online' },
        { id: 'dc01', name: 'DC-01', role: 'Domain Controller', ip: '192.168.10.2', icon: Server, color: 'text-blue-500', bg: isLightMode ? 'bg-blue-100 border-blue-200' : 'bg-blue-500/10 border-blue-500/30', border: isLightMode ? 'border-blue-200' : 'border-blue-500/30', status: 'Online' },
        { id: 'siem', name: 'Wazuh Manager', role: 'SIEM & Monitoring', ip: '192.168.10.5', icon: Activity, color: 'text-green-500', bg: isLightMode ? 'bg-green-100 border-green-200' : 'bg-green-500/10 border-green-500/30', border: isLightMode ? 'border-green-200' : 'border-green-500/30', status: 'Online' },
        { id: 'win10', name: 'Workstation-01', role: 'Target Client', ip: '192.168.10.101', icon: Monitor, color: 'text-cyan-500', bg: isLightMode ? 'bg-cyan-100 border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/30', border: isLightMode ? 'border-cyan-200' : 'border-cyan-500/30', status: 'Vulnerable' },
        { id: 'ubuntusrv', name: 'File Server', role: 'SMB / NFS', ip: '192.168.10.20', icon: Database, color: 'text-purple-500', bg: isLightMode ? 'bg-purple-100 border-purple-200' : 'bg-purple-500/10 border-purple-500/30', border: isLightMode ? 'border-purple-200' : 'border-purple-500/30', status: 'Online' },
    ];

    const scenarios = [
        { title: 'AD Enumeration & Exploitation', description: 'Simulating BloodHound analysis to identify attack paths to Domain Admin.', status: 'Active', difficulty: 'High', type: 'Red Team' },
        { title: 'Golden Ticket Attack', description: 'Forging Kerberos TGTs to maintain persistence after compromising the KRBTGT account.', status: 'Completed', difficulty: 'Expert', type: 'Persistence' },
        { title: 'Ransomware Simulation', description: 'Executing benign ransomware payload to test SIEM alert rules and EDR response.', status: 'Planned', difficulty: 'Medium', type: 'Blue Team' },
        { title: 'Log4j Exploitation', description: 'Reproducing CVE-2021-44228 against a vulnerable Java application container.', status: 'Completed', difficulty: 'Medium', type: 'Exploit' },
    ];

    // Theme Variables
    const bgClass = isLightMode ? 'bg-[#f0f4f8]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-[#0d1117]/80 border-white/10 shadow-lg';
    const nodeCardBg = isLightMode ? 'bg-white border-slate-200 shadow-md hover:shadow-lg' : 'bg-[#0d1117]/80 border border-white/10 shadow-lg';
    
    // Specific Maps Styles
    const mapContainerBg = isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-[#1c1c1e]/40 border-white/10';
    const mapLabelBg = isLightMode ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-gray-400';

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-blue-500/30 relative overflow-hidden transition-colors duration-500`}>
            {/* Chromomorphism / Ambient Backgrounds */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[5000ms]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                </>
            )}
            
            {/* Glass Header */}
            <div className={`relative z-10 backdrop-blur-xl border-b p-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 shadow-lg ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border ${isLightMode ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/10 text-blue-400'}`}>
                        <Server className="drop-shadow-md" size={24} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold tracking-tight leading-none ${textMain}`}>Home Lab Environment</h1>
                        <p className={`text-xs font-medium mt-1 ${textSec}`}>Virtualization • Active Directory • Security Operations</p>
                    </div>
                </div>

                {/* Navigation Pills */}
                <div className={`flex p-1 rounded-xl border backdrop-blur-sm ${isLightMode ? 'bg-slate-200/50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                    {[
                        { id: 'topology', label: 'Network Map', icon: Network },
                        { id: 'scenarios', label: 'Simulations', icon: AlertTriangle },
                        { id: 'specs', label: 'Hardware', icon: Cpu }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                                activeTab === tab.id 
                                    ? (isLightMode ? 'bg-white text-blue-600 shadow-sm' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/50')
                                    : (isLightMode ? 'text-slate-500 hover:text-slate-800' : 'text-gray-400 hover:text-white hover:bg-white/5')
                            }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                <div className="w-full max-w-[1800px] mx-auto space-y-8">
                    
                    {/* TOPOLOGY TAB */}
                    {activeTab === 'topology' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            
                            {/* Network Diagram Container */}
                            <div className={`backdrop-blur-md border rounded-3xl p-8 relative overflow-hidden ${mapContainerBg}`}>
                                <div className={`absolute top-0 right-0 p-4 rounded-bl-2xl border-b border-l text-xs font-mono ${mapLabelBg}`}>
                                    Subnet: 192.168.10.0/24 (VLAN 10)
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 relative z-10">
                                    {/* External / Attacker */}
                                    <div className="col-span-full mb-4">
                                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${textSec}`}>
                                            <Wifi size={14} /> External Network (WAN)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {nodes.filter(n => n.id === 'kali' || n.id === 'pfsense').map(node => (
                                                <div key={node.id} className={`backdrop-blur-xl border ${node.border} rounded-2xl p-5 flex items-center gap-4 transition-all group ${nodeCardBg} ${isLightMode ? 'hover:border-blue-400' : 'hover:bg-white/5'}`}>
                                                    <div className={`p-3 rounded-xl border ${node.bg} ${node.color} shadow-inner`}>
                                                        <node.icon size={24} />
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold text-lg transition-colors ${textMain} ${isLightMode ? 'group-hover:text-blue-600' : 'group-hover:text-blue-400'}`}>{node.name}</div>
                                                        <div className={`text-xs font-mono mb-1 ${textSec}`}>{node.ip}</div>
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${isLightMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-gray-300 border-white/5'}`}>
                                                            {node.role}
                                                        </div>
                                                    </div>
                                                    <div className={`ml-auto w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse'}`}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Internal Network Line Visual */}
                                    <div className={`col-span-full h-px bg-gradient-to-r from-transparent to-transparent my-2 ${isLightMode ? 'via-blue-300' : 'via-blue-500/50'}`}></div>

                                    {/* Internal Nodes */}
                                    <div className="col-span-full">
                                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${textSec}`}>
                                            <Lock size={14} /> Internal Laboratory (LAN)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {nodes.filter(n => n.id !== 'kali' && n.id !== 'pfsense').map(node => (
                                                <div key={node.id} className={`backdrop-blur-xl border ${node.border} rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group h-full ${nodeCardBg}`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`p-3 rounded-xl border ${node.bg} ${node.color}`}>
                                                            <node.icon size={24} />
                                                        </div>
                                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${node.status === 'Vulnerable' 
                                                            ? (isLightMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-500/10 text-red-400 border-red-500/20') 
                                                            : (isLightMode ? 'bg-green-50 text-green-600 border-green-200' : 'bg-green-500/10 text-green-400 border-green-500/20')
                                                        }`}>
                                                            {node.status}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold text-base mb-1 transition-colors ${textMain} ${isLightMode ? 'group-hover:text-blue-600' : 'group-hover:text-blue-400'}`}>{node.name}</div>
                                                        <div className={`text-xs font-mono px-2 py-1 rounded w-fit mb-2 ${isLightMode ? 'bg-slate-100 text-slate-600' : 'bg-black/40 text-gray-500'}`}>{node.ip}</div>
                                                        <p className={`text-xs ${textSec}`}>{node.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCENARIOS TAB */}
                    {activeTab === 'scenarios' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {scenarios.map((scenario, i) => (
                                    <div key={i} className={`backdrop-blur-xl border rounded-2xl p-6 transition-all group relative overflow-hidden ${cardBg} ${isLightMode ? 'hover:border-red-300' : 'hover:border-red-500/30'}`}>
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl rounded-bl-full pointer-events-none ${isLightMode ? 'from-red-100 to-transparent' : 'from-red-500/10 to-transparent'}`}></div>
                                        
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                                                scenario.type === 'Red Team' 
                                                    ? (isLightMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-500/10 text-red-400 border-red-500/20')
                                                    : scenario.type === 'Blue Team'
                                                        ? (isLightMode ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20')
                                                        : (isLightMode ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/20')
                                            }`}>
                                                {scenario.type}
                                            </div>
                                            <span className={`text-[10px] font-bold ${scenario.status === 'Active' ? 'text-green-500 animate-pulse' : textSec}`}>
                                                {scenario.status}
                                            </span>
                                        </div>

                                        <h3 className={`text-lg font-bold mb-2 transition-colors ${textMain} ${isLightMode ? 'group-hover:text-red-600' : 'group-hover:text-red-400'}`}>{scenario.title}</h3>
                                        <p className={`text-sm leading-relaxed mb-6 ${textSec}`}>{scenario.description}</p>

                                        <div className={`flex items-center justify-between pt-4 border-t relative z-10 ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                                            <div className={`flex items-center gap-2 text-xs ${textSec}`}>
                                                <AlertTriangle size={14} className={scenario.difficulty === 'Expert' ? 'text-red-500' : 'text-yellow-500'} />
                                                Difficulty: <span className={textMain}>{scenario.difficulty}</span>
                                            </div>
                                            <button className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${isLightMode ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}>
                                                View Logs
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SPECS TAB */}
                    {activeTab === 'specs' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`backdrop-blur-xl border rounded-3xl p-8 ${cardBg}`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`p-3 rounded-xl border ${isLightMode ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                                        <Server size={32} />
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-bold ${textMain}`}>Hypervisor Host</h2>
                                        <p className={`text-sm ${textSec}`}>Proxmox VE 8.1 (Debian Bookworm)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className={`border rounded-2xl p-6 flex flex-col items-center text-center ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                        <Cpu size={32} className={`mb-4 ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`} />
                                        <h3 className={`text-lg font-bold mb-1 ${textMain}`}>Intel Core i7</h3>
                                        <p className={`text-xs uppercase tracking-widest ${textSec}`}>Processor</p>
                                        <div className={`mt-4 w-full rounded-full h-2 ${isLightMode ? 'bg-slate-200' : 'bg-white/5'}`}>
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <p className={`text-xs mt-2 ${textSec}`}>12 Cores / 24 Threads</p>
                                    </div>

                                    <div className={`border rounded-2xl p-6 flex flex-col items-center text-center ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                        <Database size={32} className={`mb-4 ${isLightMode ? 'text-purple-600' : 'text-purple-400'}`} />
                                        <h3 className={`text-lg font-bold mb-1 ${textMain}`}>64GB DDR4</h3>
                                        <p className={`text-xs uppercase tracking-widest ${textSec}`}>Memory</p>
                                        <div className={`mt-4 w-full rounded-full h-2 ${isLightMode ? 'bg-slate-200' : 'bg-white/5'}`}>
                                            <div className="bg-purple-500 h-full rounded-full" style={{ width: '72%' }}></div>
                                        </div>
                                        <p className={`text-xs mt-2 ${textSec}`}>46GB Used (ZFS Cache)</p>
                                    </div>

                                    <div className={`border rounded-2xl p-6 flex flex-col items-center text-center ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                        <HardDrive size={32} className={`mb-4 ${isLightMode ? 'text-green-600' : 'text-green-400'}`} />
                                        <h3 className={`text-lg font-bold mb-1 ${textMain}`}>2TB NVMe</h3>
                                        <p className={`text-xs uppercase tracking-widest ${textSec}`}>Storage Pool</p>
                                        <div className={`mt-4 w-full rounded-full h-2 ${isLightMode ? 'bg-slate-200' : 'bg-white/5'}`}>
                                            <div className="bg-green-500 h-full rounded-full" style={{ width: '30%' }}></div>
                                        </div>
                                        <p className={`text-xs mt-2 ${textSec}`}>ZFS Mirror Configuration</p>
                                    </div>
                                </div>

                                <div className={`mt-8 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-4 ${isLightMode ? 'border-slate-200' : 'border-white/5'}`}>
                                    <div className={`flex items-center justify-between p-4 rounded-xl border ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <Router size={20} className={textSec} />
                                            <span className={`text-sm font-bold ${textMain}`}>Network Bridge</span>
                                        </div>
                                        <span className="text-xs font-mono text-green-500">vmbr0 (Active)</span>
                                    </div>
                                    <div className={`flex items-center justify-between p-4 rounded-xl border ${isLightMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <Cloud size={20} className={textSec} />
                                            <span className={`text-sm font-bold ${textMain}`}>Cloud Backup</span>
                                        </div>
                                        <span className="text-xs font-mono text-blue-500">Synced 2h ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HomeLab;

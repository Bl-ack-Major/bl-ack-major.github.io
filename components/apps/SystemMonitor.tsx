
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Server, Layers, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Helper to generate realistic historical noise
const generateHistoricalData = (length: number, base: number, variance: number) => {
    return Array.from({ length }, () => Math.max(0, Math.min(100, base + (Math.random() * variance - (variance / 2)))));
};

const SystemMonitor: React.FC = () => {
    const { isLightMode } = useTheme();

    // Initialize with pre-filled data to simulate the system has been running
    const [history, setHistory] = useState<{
        cpu: number[];
        ram: number[];
        netIn: number[];
        netOut: number[];
    }>(() => ({
        cpu: generateHistoricalData(60, 15, 20), // Avg 15% CPU
        ram: generateHistoricalData(60, 42, 2),  // Avg 42% RAM, very stable
        netIn: generateHistoricalData(60, 5, 40), // Low baseline, occasional spikes
        netOut: generateHistoricalData(60, 2, 5)  // Low outbound
    }));

    // Simulated Processes
    const [processes, setProcesses] = useState([
        { pid: 1120, name: 'nmap', user: 'root', cpu: 45.2, mem: 1.1, status: 'R' },
        { pid: 3001, name: 'chrome', user: 'keamo', cpu: 12.5, mem: 14.5, status: 'S' },
        { pid: 4421, name: 'code', user: 'keamo', cpu: 5.1, mem: 8.4, status: 'S' },
        { pid: 5102, name: 'node', user: 'keamo', cpu: 2.3, mem: 3.2, status: 'S' },
        { pid: 1442, name: 'Xorg', user: 'root', cpu: 1.8, mem: 2.5, status: 'S' },
        { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, mem: 0.4, status: 'S' },
        { pid: 993, name: 'containerd', user: 'root', cpu: 0.5, mem: 1.8, status: 'S' },
        { pid: 882, name: 'kworker/u4:2', user: 'root', cpu: 0.0, mem: 0.0, status: 'I' },
    ]);

    // File Systems
    const fileSystems = [
        { mount: '/', type: 'ext4', size: '120GB', used: '45GB', percent: 37 },
        { mount: '/home', type: 'ext4', size: '500GB', used: '312GB', percent: 62 },
        { mount: '/boot/efi', type: 'vfat', size: '512MB', used: '12MB', percent: 2 },
    ];

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setHistory(prev => {
                const lastCpu = prev.cpu[prev.cpu.length - 1];
                const lastRam = prev.ram[prev.ram.length - 1];
                
                // Random fluctuation logic
                const newCpu = Math.max(5, Math.min(100, lastCpu + (Math.random() * 20 - 10)));
                const newRam = Math.max(20, Math.min(95, lastRam + (Math.random() * 4 - 2)));
                
                // Network spikes
                const spike = Math.random() > 0.9;
                const newNetIn = spike ? Math.random() * 80 + 20 : Math.random() * 10;
                const newNetOut = Math.random() * 5;

                return {
                    cpu: [...prev.cpu.slice(1), newCpu],
                    ram: [...prev.ram.slice(1), newRam],
                    netIn: [...prev.netIn.slice(1), newNetIn],
                    netOut: [...prev.netOut.slice(1), newNetOut]
                };
            });

            // Update processes
            setProcesses(prev => prev.map(p => ({
                ...p,
                cpu: p.status === 'R' ? Math.max(0, p.cpu + (Math.random() * 10 - 5)) : Math.max(0, p.cpu + (Math.random() * 2 - 1)),
            })).sort((a, b) => b.cpu - a.cpu));

        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Helper to draw SVG lines
    const drawGraph = (data: number[], color: string, maxVal = 100) => {
        const height = 50;
        const width = 100;
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (Math.min(val, maxVal) / maxVal) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M0,${height} ${points} L${width},${height}`} fill={`url(#grad-${color.replace('#', '')})`} />
                <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    const currentCpu = Math.round(history.cpu[history.cpu.length - 1]);
    const currentRam = Math.round(history.ram[history.ram.length - 1]);
    const currentNetIn = history.netIn[history.netIn.length - 1].toFixed(1);
    const currentNetOut = history.netOut[history.netOut.length - 1].toFixed(1);

    // --- Theme Variables ---
    const bgClass = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-300';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-[#1c1c1e]/60 border-white/10 shadow-xl';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const processHeaderBg = isLightMode ? 'bg-slate-100 text-slate-600' : 'bg-black/20 text-gray-400';
    const borderCol = isLightMode ? 'border-slate-200' : 'border-white/5';

    // Graph Colors
    const cpuColor = isLightMode ? '#2563eb' : '#367BF0';
    const ramColor = isLightMode ? '#9333ea' : '#a855f7';
    const netInColor = isLightMode ? '#16a34a' : '#22c55e';
    const netOutColor = isLightMode ? '#ea580c' : '#f97316';

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans selection:bg-[#367BF0] selection:text-white relative overflow-hidden transition-colors duration-500`}>
            {/* Chromomorphism Background */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                </>
            )}

            {/* Glass Header */}
            <div className={`relative z-20 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between shadow-lg shrink-0 ${headerBg}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${isLightMode ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-blue-500/20 border-blue-500/30 text-blue-400'}`}>
                        <Activity size={20} />
                    </div>
                    <div>
                        <span className={`font-bold text-lg tracking-tight block leading-none ${textMain}`}>System Resources</span>
                        <span className={`text-[10px] font-mono uppercase ${textSec}`}>Localhost</span>
                    </div>
                </div>
                <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border backdrop-blur-sm ${isLightMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'text-gray-400 bg-black/30 border-white/5'}`}>
                    Uptime: 2 days, 4:20:31
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-10">
                <div className="w-full max-w-[1800px] mx-auto space-y-6">
                    
                    {/* Top Row: Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* CPU Card */}
                        <div className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col ${cardBg}`}>
                            <div className="flex justify-between items-center mb-6">
                                <div className={`flex items-center gap-3 text-sm font-bold ${isLightMode ? 'text-slate-700' : 'text-gray-200'}`}>
                                    <div className={`p-2 rounded-lg shadow-sm ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}><Cpu size={18} /></div>
                                    Processor Load
                                </div>
                                <span className={`text-2xl font-mono font-bold drop-shadow-sm ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`}>{currentCpu}%</span>
                            </div>
                            <div className="flex-1 h-24 mb-6">
                                {drawGraph(history.cpu, cpuColor)}
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-auto">
                                {[1, 2, 3, 4].map(core => (
                                    <div key={core} className={`h-12 rounded-lg relative overflow-hidden border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`} title={`Core ${core}`}>
                                        <div 
                                            className={`absolute bottom-0 w-full transition-all duration-300 ${isLightMode ? 'bg-blue-500 shadow-sm' : 'bg-blue-600/80 shadow-[0_0_10px_#2563eb]'}`}
                                            style={{ height: `${Math.max(5, currentCpu + (Math.random() * 20 - 10))}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Memory Card */}
                        <div className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col ${cardBg}`}>
                            <div className="flex justify-between items-center mb-6">
                                <div className={`flex items-center gap-3 text-sm font-bold ${isLightMode ? 'text-slate-700' : 'text-gray-200'}`}>
                                    <div className={`p-2 rounded-lg shadow-sm ${isLightMode ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'}`}><Layers size={18} /></div>
                                    Memory & Swap
                                </div>
                                <span className={`text-2xl font-mono font-bold drop-shadow-sm ${isLightMode ? 'text-purple-600' : 'text-purple-400'}`}>{currentRam}%</span>
                            </div>
                            <div className="flex-1 h-24 mb-6 relative">
                                {drawGraph(history.ram, ramColor)}
                            </div>
                            <div className="mt-auto space-y-3 text-xs">
                                <div className={`flex justify-between ${textSec}`}>
                                    <span>RAM Usage</span>
                                    <span className={`font-mono ${textMain}`}>{Math.round(currentRam * 0.32)} GB / 32 GB</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                    <div className={`h-full transition-all duration-500 ${isLightMode ? 'bg-purple-500' : 'bg-purple-500 shadow-[0_0_8px_#a855f7]'}`} style={{ width: `${currentRam}%` }}></div>
                                </div>
                                <div className={`flex justify-between ${textSec} pt-1`}>
                                    <span>Swap Space</span>
                                    <span className={`font-mono ${textMain}`}>2.1 GB / 8 GB</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                    <div className={`h-full transition-all duration-500 ${isLightMode ? 'bg-purple-700' : 'bg-purple-900/80'}`} style={{ width: '26%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Network Card */}
                        <div className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col ${cardBg}`}>
                            <div className="flex justify-between items-center mb-6">
                                <div className={`flex items-center gap-3 text-sm font-bold ${isLightMode ? 'text-slate-700' : 'text-gray-200'}`}>
                                    <div className={`p-2 rounded-lg shadow-sm ${isLightMode ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}><Wifi size={18} /></div>
                                    Network I/O
                                </div>
                                <div className="flex flex-col items-end gap-1 text-xs font-mono">
                                    <span className={`flex items-center gap-1 font-bold ${isLightMode ? 'text-green-600' : 'text-green-400'}`}><ArrowDown size={10}/> {currentNetIn} KB/s</span>
                                    <span className={`flex items-center gap-1 font-bold ${isLightMode ? 'text-orange-600' : 'text-orange-400'}`}><ArrowUp size={10}/> {currentNetOut} KB/s</span>
                                </div>
                            </div>
                            <div className="flex-1 h-32 relative">
                                <div className="absolute inset-0 opacity-60">{drawGraph(history.netIn, netInColor, 100)}</div>
                                <div className="absolute inset-0 opacity-60">{drawGraph(history.netOut, netOutColor, 50)}</div>
                            </div>
                            <div className={`mt-auto text-right text-[10px] pt-3 border-t font-mono ${textSec} ${borderCol}`}>
                                Interface: eth0 (1000Mb/s) :: IPv4
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* File Systems */}
                        <div className={`md:col-span-1 backdrop-blur-md border rounded-2xl p-6 ${cardBg}`}>
                            <div className={`flex items-center gap-3 text-sm font-bold mb-6 ${isLightMode ? 'text-slate-700' : 'text-gray-200'}`}>
                                <HardDrive size={18} className={textSec} /> Storage Volumes
                            </div>
                            <div className="space-y-5">
                                {fileSystems.map(fs => (
                                    <div key={fs.mount}>
                                        <div className={`flex justify-between text-xs mb-2 font-mono ${textSec}`}>
                                            <span className={`font-bold text-sm sans ${textMain}`}>{fs.mount}</span>
                                            <span>{fs.used} / {fs.size}</span>
                                        </div>
                                        <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                            <div 
                                                className={`h-full transition-all duration-500 ${fs.percent > 80 ? 'bg-red-500' : 'bg-blue-500'} ${isLightMode ? '' : 'shadow-[0_0_8px_currentColor]'}`} 
                                                style={{ width: `${fs.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Process Table */}
                        <div className={`md:col-span-3 backdrop-blur-md border rounded-2xl overflow-hidden flex flex-col ${cardBg}`}>
                            <div className={`px-6 py-4 border-b flex items-center gap-3 text-sm font-bold ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white'}`}>
                                <Server size={18} className="text-yellow-500" /> Active Processes
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead className={`${processHeaderBg}`}>
                                        <tr>
                                            <th className="px-6 py-3 font-medium">PID</th>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">User</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium text-right">CPU%</th>
                                            <th className="px-6 py-3 font-medium text-right">MEM%</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isLightMode ? 'divide-slate-200' : 'divide-white/5'}`}>
                                        {processes.map((proc, i) => (
                                            <tr key={proc.pid} className={`${isLightMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'} transition-colors`}>
                                                <td className="px-6 py-3 text-blue-500">{proc.pid}</td>
                                                <td className={`px-6 py-3 font-bold ${textMain}`}>{proc.name}</td>
                                                <td className={`px-6 py-3 ${textSec}`}>{proc.user}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                        proc.status === 'R' 
                                                            ? (isLightMode ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-500/10 text-green-400 border-green-500/20') 
                                                            : (isLightMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white/5 text-gray-400 border-white/10')
                                                    }`}>
                                                        {proc.status}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-3 text-right ${proc.cpu > 20 ? 'text-red-500 font-bold' : textSec}`}>
                                                    {proc.cpu.toFixed(1)}%
                                                </td>
                                                <td className={`px-6 py-3 text-right ${textSec}`}>{proc.mem.toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SystemMonitor;

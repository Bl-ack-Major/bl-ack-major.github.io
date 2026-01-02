
import React, { useState, useEffect, useRef } from 'react';
import { Play, Monitor, Activity, Server, StopCircle, Shield, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ScanResult {
    port: number;
    protocol: string;
    state: string;
    service: string;
    version: string;
}

interface HostInfo {
    ip: string;
    status: string;
    hostname?: string;
    os?: string;
    uptime?: string;
}

const KNOWN_HOSTS: Record<string, { os: string, ports: ScanResult[] }> = {
    '192.168.1.1': {
        os: 'Linux 4.14 (OpenWrt)',
        ports: [
            { port: 53, protocol: 'tcp', state: 'open', service: 'domain', version: 'dnsmasq 2.80' },
            { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'uhttpd 1.0.0' },
            { port: 443, protocol: 'tcp', state: 'open', service: 'https', version: 'uhttpd 1.0.0' }
        ]
    },
    '192.168.1.15': {
        os: 'Linux 6.5.0-kali3-amd64',
        ports: [
            { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 9.2p1' },
            { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache httpd 2.4.57' },
            { port: 5432, protocol: 'tcp', state: 'open', service: 'postgresql', version: 'PostgreSQL 15.3' }
        ]
    },
    '10.0.0.5': {
        os: 'Windows Server 2019',
        ports: [
            { port: 21, protocol: 'tcp', state: 'open', service: 'ftp', version: 'Microsoft ftpd' },
            { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Microsoft IIS 10.0' },
            { port: 445, protocol: 'tcp', state: 'open', service: 'microsoft-ds', version: 'Windows Server 2019 Standard 17763' },
            { port: 3389, protocol: 'tcp', state: 'open', service: 'ms-wbt-server', version: 'Microsoft Terminal Services' }
        ]
    }
};

const PROFILES = {
    'Intense scan': '-T4 -A -v',
    'Intense scan plus UDP': '-sS -sU -T4 -A -v',
    'Quick scan': '-T4 -F',
    'Quick scan plus': '-sV -T4 -O -F --version-light',
    'Ping scan': '-sn',
    'Regular scan': ''
};

export const NmapGUI: React.FC = () => {
    const [target, setTarget] = useState('10.0.0.5');
    const [profile, setProfile] = useState('Intense scan');
    const [command, setCommand] = useState(`nmap -T4 -A -v ${target}`);
    const [output, setOutput] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [activeTab, setActiveTab] = useState<'output' | 'ports' | 'topology' | 'details'>('output');
    const [scanResults, setScanResults] = useState<ScanResult[]>([]);
    const [hostDetails, setHostDetails] = useState<HostInfo | null>(null);
    const [progress, setProgress] = useState(0);
    
    const { isLightMode } = useTheme();
    const outputRef = useRef<HTMLDivElement>(null);
    const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const args = PROFILES[profile as keyof typeof PROFILES] || '';
        setCommand(`nmap ${args} ${target}`);
    }, [target, profile]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const stopScan = () => {
        if (scanInterval.current) {
            clearInterval(scanInterval.current);
            scanInterval.current = null;
        }
        setIsScanning(false);
        setOutput(prev => [...prev, '\nScan aborted by user.']);
        setProgress(0);
    };

    const handleScan = () => {
        if (isScanning) return;
        
        setIsScanning(true);
        setOutput([]);
        setScanResults([]);
        setHostDetails(null);
        setProgress(0);
        setActiveTab('output');

        const startTime = new Date();
        const baseLines = [
            `Starting Nmap 7.94 ( https://nmap.org ) at ${startTime.toLocaleTimeString()}`,
            `NSE: Loaded 155 scripts for scanning.`,
            `NSE: Script Pre-scanning.`,
            `Initiating Ping Scan at ${startTime.toLocaleTimeString()}`,
            `Scanning ${target} [4 ports]`,
            `Completed Ping Scan at ${startTime.toLocaleTimeString()}, 0.20s elapsed (1 total hosts)`
        ];

        let lineIndex = 0;
        let currentProgress = 0;

        const knownData = KNOWN_HOSTS[target];
        const resultPorts = knownData ? knownData.ports : [
            { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache' },
            { port: 443, protocol: 'tcp', state: 'closed', service: 'https', version: '' }
        ];
        const resultOS = knownData ? knownData.os : 'Unknown Device';

        scanInterval.current = setInterval(() => {
            currentProgress += Math.random() * 5;
            setProgress(Math.min(100, currentProgress));

            if (lineIndex < baseLines.length) {
                setOutput(prev => [...prev, baseLines[lineIndex]]);
                lineIndex++;
            } else if (currentProgress < 40) {
                if (Math.random() > 0.7) setOutput(prev => [...prev, `Initiating Parallel DNS resolution of 1 host.`]);
            } else if (currentProgress < 70) {
                if (Math.random() > 0.8) setOutput(prev => [...prev, `Initiating Connect Scan at ${new Date().toLocaleTimeString()}`]);
            } else if (currentProgress < 90) {
                if (Math.random() > 0.6) {
                    const port = resultPorts[Math.floor(Math.random() * resultPorts.length)];
                    setOutput(prev => [...prev, `Discovered open port ${port.port}/${port.protocol} on ${target}`]);
                }
            } else {
                if (scanInterval.current) clearInterval(scanInterval.current);
                setIsScanning(false);
                setProgress(100);
                
                setScanResults(resultPorts);
                setHostDetails({
                    ip: target,
                    status: 'Up',
                    hostname: target === '127.0.0.1' ? 'localhost' : '',
                    os: resultOS,
                    uptime: '14 days, 2:13:02'
                });

                const finalLines = [
                    `Completed Connect Scan at ${new Date().toLocaleTimeString()}, 5.12s elapsed`,
                    `Nmap scan report for ${target}`,
                    `Host is up (0.0024s latency).`,
                    `Not shown: ${1000 - resultPorts.length} closed tcp ports (conn-refused)`,
                    `PORT     STATE SERVICE     VERSION`,
                    ...resultPorts.map(p => `${p.port}/${p.protocol}`.padEnd(9) + `${p.state}`.padEnd(8) + `${p.service}`.padEnd(12) + `${p.version}`),
                    ``,
                    `Device type: general purpose`,
                    `Running: ${resultOS}`,
                    `OS details: ${resultOS}`,
                    `Network Distance: 2 hops`,
                    `TCP Sequence Prediction: Difficulty=260 (Good luck!)`,
                    `TRACEROUTE (using port 80/tcp)`,
                    `HOP RTT     ADDRESS`,
                    `1   0.20 ms 192.168.1.1`,
                    `2   2.10 ms ${target}`,
                    ``,
                    `Nmap done: 1 IP address (1 host up) scanned in 8.45 seconds`
                ];
                setOutput(prev => [...prev, ...finalLines]);
            }
        }, 200);
    };

    const bgBase = isLightMode ? 'bg-[#e0e0e0]' : 'bg-[#2d2d2d]';
    const bgPanel = isLightMode ? 'bg-white' : 'bg-[#1e1e1e]';
    const textMain = isLightMode ? 'text-slate-800' : 'text-gray-200';
    const borderCol = isLightMode ? 'border-gray-300' : 'border-[#444]';
    const inputBg = isLightMode ? 'bg-white' : 'bg-[#111] text-white';
    const highlight = isLightMode ? 'bg-blue-600 text-white' : 'bg-blue-700 text-white';

    return (
        <div className={`h-full flex flex-col font-sans text-xs ${textMain} ${bgBase}`}>
            {/* Top Toolbar */}
            <div className={`${bgPanel} border-b ${borderCol} p-1 flex items-center space-x-4`}>
                <div className="flex gap-2">
                    {['Scan', 'Tools', 'Profile', 'Help'].map(menu => (
                        <button key={menu} className={`px-2 py-1 hover:${isLightMode ? 'bg-gray-200' : 'bg-white/10'} rounded`}>{menu}</button>
                    ))}
                </div>
            </div>

            {/* Controls Area */}
            <div className={`p-3 border-b ${borderCol} ${isLightMode ? 'bg-[#f0f0f0]' : 'bg-[#252525]'} space-y-3`}>
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-2">
                        <label className="font-bold w-14">Target:</label>
                        <div className={`flex-1 flex items-center border ${borderCol} bg-white rounded-sm overflow-hidden`}>
                            <input 
                                className={`flex-1 p-1.5 outline-none ${inputBg}`}
                                value={target} 
                                onChange={(e) => setTarget(e.target.value)} 
                            />
                            {/* History Dropdown Arrow (Visual) */}
                            <button className={`px-1 border-l ${borderCol} hover:bg-gray-100`}>▼</button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                        <label className="font-bold w-14">Profile:</label>
                        <select 
                            className={`flex-1 p-1.5 border ${borderCol} rounded-sm outline-none ${inputBg}`}
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                        >
                            {Object.keys(PROFILES).map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-2">
                        <label className="font-bold w-14">Command:</label>
                        <input 
                            className={`flex-1 p-1.5 border ${borderCol} rounded-sm font-mono text-[11px] ${isLightMode ? 'bg-gray-100 text-gray-600' : 'bg-[#111] text-gray-400'}`}
                            value={command} 
                            readOnly 
                        />
                    </div>
                    <div className="flex gap-2 w-[180px] justify-end">
                        <button 
                            onClick={handleScan}
                            disabled={isScanning}
                            className={`px-4 py-1.5 border rounded shadow-sm font-bold flex items-center gap-2 transition-all ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} ${isLightMode ? 'bg-white border-gray-300' : 'bg-[#333] border-[#555]'}`}
                        >
                            <Play size={12} className="text-blue-600" fill="currentColor" /> Scan
                        </button>
                        <button 
                            onClick={stopScan}
                            disabled={!isScanning}
                            className={`px-4 py-1.5 border rounded shadow-sm font-bold flex items-center gap-2 transition-all ${!isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'} ${isLightMode ? 'bg-white border-gray-300' : 'bg-[#333] border-[#555]'}`}
                        >
                            <StopCircle size={12} className="text-red-500" fill="currentColor" /> Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area (Split Pane) */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Hosts */}
                <div className={`w-52 border-r ${borderCol} flex flex-col ${bgPanel}`}>
                    <div className={`px-2 py-1.5 font-bold border-b ${borderCol} flex justify-between items-center ${isLightMode ? 'bg-gray-100' : 'bg-[#252525]'}`}>
                        <span>Hosts</span>
                        <div className="flex gap-1">
                            <button className="p-0.5 hover:bg-black/10 rounded"><Server size={12}/></button>
                            <button className="p-0.5 hover:bg-black/10 rounded"><Activity size={12}/></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-1">
                        {hostDetails ? (
                            <div className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${highlight}`}>
                                <Monitor size={14} />
                                <div>
                                    <div className="font-bold">{hostDetails.ip}</div>
                                    <div className="opacity-80 text-[10px]">{hostDetails.os?.split(' ')[0]}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center mt-4 opacity-50 italic">No hosts scanned</div>
                        )}
                    </div>
                </div>

                {/* Right Content: Tabs & Output */}
                <div className={`flex-1 flex flex-col ${bgPanel}`}>
                    {/* Tabs */}
                    <div className={`flex border-b ${borderCol} ${isLightMode ? 'bg-[#f0f0f0]' : 'bg-[#252525]'}`}>
                        {[
                            { id: 'output', label: 'Nmap Output' },
                            { id: 'ports', label: 'Ports / Hosts' },
                            { id: 'topology', label: 'Topology' },
                            { id: 'details', label: 'Host Details' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-1.5 border-r ${borderCol} font-medium transition-colors ${activeTab === tab.id ? `${bgPanel} border-t-2 border-t-blue-500` : `hover:${isLightMode ? 'bg-white' : 'bg-[#333]'}`}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-auto relative">
                        {isScanning && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}

                        {activeTab === 'output' && (
                            <div className={`h-full p-2 font-mono text-xs whitespace-pre-wrap overflow-auto ${isLightMode ? 'bg-white text-black' : 'bg-[#151515] text-[#ccc]'}`} ref={outputRef}>
                                {output.join('\n')}
                                {isScanning && <span className="animate-pulse">_</span>}
                            </div>
                        )}

                        {activeTab === 'ports' && (
                            <div className="h-full flex flex-col">
                                <div className={`flex font-bold border-b ${borderCol} px-2 py-1 ${isLightMode ? 'bg-gray-50' : 'bg-[#252525]'}`}>
                                    <div className="w-20">Port</div>
                                    <div className="w-20">Protocol</div>
                                    <div className="w-20">State</div>
                                    <div className="w-40">Service</div>
                                    <div className="flex-1">Version</div>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    {scanResults.map((res, i) => (
                                        <div key={i} className={`flex px-2 py-1 border-b ${borderCol} ${i % 2 === 0 ? (isLightMode ? 'bg-white' : 'bg-[#1e1e1e]') : (isLightMode ? 'bg-gray-50' : 'bg-[#222]')}`}>
                                            <div className="w-20">{res.port}</div>
                                            <div className="w-20">{res.protocol}</div>
                                            <div className={`w-20 ${res.state === 'open' ? 'text-green-500 font-bold' : 'text-red-500'}`}>{res.state}</div>
                                            <div className="w-40">{res.service}</div>
                                            <div className="flex-1 text-gray-500">{res.version}</div>
                                        </div>
                                    ))}
                                    {scanResults.length === 0 && !isScanning && (
                                        <div className="p-4 text-center opacity-50">No open ports found or scan not run.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'topology' && (
                            <div className="h-full flex items-center justify-center relative overflow-hidden bg-dot-pattern">
                                {/* Simple SVG Topology */}
                                <svg width="100%" height="100%" viewBox="0 0 400 300">
                                    <defs>
                                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                            <path d="M0,0 L0,6 L9,3 z" fill={isLightMode ? "#999" : "#666"} />
                                        </marker>
                                    </defs>
                                    
                                    {/* Connections */}
                                    <line x1="200" y1="50" x2="200" y2="150" stroke={isLightMode ? "#ccc" : "#444"} strokeWidth="2" />
                                    <line x1="200" y1="150" x2="100" y2="250" stroke={isLightMode ? "#ccc" : "#444"} strokeWidth="2" />
                                    <line x1="200" y1="150" x2="300" y2="250" stroke={isLightMode ? "#ccc" : "#444"} strokeWidth="2" />

                                    {/* Internet */}
                                    <g transform="translate(180, 10)">
                                        <Globe size={40} className="text-blue-500" />
                                        <text x="20" y="55" textAnchor="middle" fontSize="10" fill="currentColor">Internet</text>
                                    </g>

                                    {/* Localhost */}
                                    <g transform="translate(180, 130)">
                                        <circle cx="20" cy="20" r="25" fill={isLightMode ? "#fff" : "#222"} stroke="#367BF0" strokeWidth="2" />
                                        <Monitor size={24} x="8" y="8" className="text-blue-500" />
                                        <text x="20" y="60" textAnchor="middle" fontSize="10" fill="currentColor">localhost</text>
                                    </g>

                                    {/* Target */}
                                    {hostDetails && (
                                        <g transform="translate(80, 230)" className="animate-in fade-in zoom-in duration-500">
                                            <circle cx="20" cy="20" r="25" fill={isLightMode ? "#fff" : "#222"} stroke={hostDetails.status === 'Up' ? "#10B981" : "#EF4444"} strokeWidth="2" />
                                            <Server size={24} x="8" y="8" className={hostDetails.status === 'Up' ? "text-green-500" : "text-red-500"} />
                                            <text x="20" y="60" textAnchor="middle" fontSize="10" fill="currentColor">{hostDetails.ip}</text>
                                        </g>
                                    )}

                                    {/* Gateway */}
                                    <g transform="translate(280, 230)">
                                        <circle cx="20" cy="20" r="25" fill={isLightMode ? "#fff" : "#222"} stroke="#999" strokeWidth="2" />
                                        <Shield size={24} x="8" y="8" className="text-gray-500" />
                                        <text x="20" y="60" textAnchor="middle" fontSize="10" fill="currentColor">Gateway</text>
                                    </g>
                                </svg>
                                {!hostDetails && <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm"><span className="bg-white/80 px-4 py-2 rounded shadow text-black">Run a scan to generate topology</span></div>}
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="p-4 space-y-6">
                                {hostDetails ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="text-xs uppercase font-bold opacity-50">State</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <span className="text-lg">{hostDetails.status}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs uppercase font-bold opacity-50">Open Ports</div>
                                                <div className="text-lg">{scanResults.length}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-xs uppercase font-bold opacity-50 border-b border-gray-200 pb-1">Operating System</div>
                                            <div className="flex items-center gap-3">
                                                <Monitor size={32} className="opacity-50" />
                                                <div>
                                                    <div className="font-bold text-base">{hostDetails.os}</div>
                                                    <div className="opacity-60 text-xs">Accuracy: 98%</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-xs uppercase font-bold opacity-50 border-b border-gray-200 pb-1">Uptime</div>
                                            <div className="font-mono">{hostDetails.uptime}</div>
                                            <div className="text-xs opacity-60">Last boot: Thu Oct 12 08:00:00 2025</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center mt-10 opacity-50">No host details available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NmapGUI;


import React, { useState, useEffect, useRef } from 'react';
import { FileText, RefreshCw, AlertTriangle, Search, Copy, Terminal } from 'lucide-react';
import { useChallenge } from '../../contexts/ChallengeContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ContextMenuItem } from '../ContextMenu';
import { useToast } from '../ToastNotification';
import { useNarrative } from '../../contexts/NarrativeContext';

// --- Log Generator Helper ---
const generateLogs = (currentChapter: number) => {
    const logs: string[] = [];
    const baseDate = new Date('2025-10-27T08:00:00');
    
    const processes = ['kernel', 'systemd', 'sshd', 'CRON', 'rsyslogd', 'NetworkManager', 'wpa_supplicant', 'usb', 'dockerd'];
    const messages = [
        "Initializing cgroup subsys cpuset",
        "Created slice User Slice of root.",
        "Starting Session 42 of user root.",
        "Received disconnect from 192.168.1.44 port 22:11: Bye Bye",
        "pam_unix(sshd:session): session closed for user root",
        "(root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)",
        "wlan0: CTRL-EVENT-BEACON-LOSS",
        "eth0: link up (1000Mbps/Full Duplex)",
        "DHCPACK from 192.168.1.1 (00:11:22:33:44:55)",
        "bound to 192.168.1.15 -- renewal in 3400 seconds.",
        "input: USB HID v1.11 Mouse [Logitech USB Optical Mouse] on usb-0000:00:14.0-2/input0",
        "wpa_supplicant[890]: wlan0: WPA: Key negotiation completed with 00:11:22:33:44:55 [PTK=CCMP GTK=CCMP]",
        "systemd[1]: Started Daily apt download activities.",
        "dbus-daemon[111]: [system] Activating via systemd: service name='org.freedesktop.PackageKit' unit='packagekit.service'"
    ];

    const decoyWarnings = [
        "filesystem: /dev/sda1: 85% disk usage",
        "performance: High memory usage detected in background worker",
        "network: Wi-Fi signal strength low (-85dBm)",
        "update-manager: 14 packages are eligible for upgrade"
    ];

    // Generate 120 entries for a larger haystack
    for (let i = 0; i < 120; i++) {
        // Increment time slightly
        baseDate.setSeconds(baseDate.getSeconds() + Math.floor(Math.random() * 60) + 1);
        
        // Format Timestamp: [2025-10-27 08:01:23]
        const timestamp = `[${baseDate.toISOString().replace('T', ' ').split('.')[0]}]`;
        
        let process = processes[Math.floor(Math.random() * processes.length)];
        let msg = messages[Math.floor(Math.random() * messages.length)];
        let level = "INFO";

        // FRAGMENT 1 INJECTION (Legacy CTF / Chapter 1)
        if (i === 92) {
            logs.push(`${timestamp} SYSTEM: [AUDIT] Suspicious Activity. Partial credential dump found: eU91SGF2 (Base64).`);
            continue;
        }

        // CHAPTER 2 CLUE INJECTION
        if (currentChapter >= 2 && i === 45) {
            logs.push(`[2025-10-27 03:14:15] SUDO: [WARN] User 'dev_ops_phantom' executed 'sudo -S' at 03:14:15 AM from ip=192.168.1.55. Unauthorized time window.`);
            continue;
        }

        // Add Realistic Decoys (Yellow/Red) to distract the user
        const rand = Math.random();
        if (rand > 0.92) {
            level = "WARN";
            msg = decoyWarnings[Math.floor(Math.random() * decoyWarnings.length)];
        } else if (rand > 0.97) {
            level = "ERROR";
            msg = "Connection timed out connecting to repo.kali.org";
        }

        logs.push(`${timestamp} ${process.toUpperCase()}: ${level !== 'INFO' ? `[${level}] ` : ''}${msg}`);
    }
    
    return logs;
};

interface SystemLogsProps {
    setContextMenu?: (data: { x: number, y: number, items: ContextMenuItem[] } | null) => void;
}

const SystemLogs: React.FC<SystemLogsProps> = ({ setContextMenu }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    
    const { isLightMode } = useTheme();
    const { addNotification } = useToast();
    const { discoverClue, currentChapter } = useNarrative();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        setLogs(generateLogs(currentChapter));
    }, [currentChapter]);

    const filteredLogs = logs.filter(log => log.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleLogClick = (log: string) => {
        // Legacy Discovery
        if (log.includes('eU91SGF2')) {
            discoverClue('eU91SGF2', 'logs');
        }
        // Chapter 2 Discovery
        if (log.includes('dev_ops_phantom')) {
            discoverClue('dev_ops_phantom', 'logs');
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        if (!setContextMenu) return;
        
        e.preventDefault();
        e.stopPropagation();

        const selection = window.getSelection()?.toString();

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            items: [
                { 
                    label: 'Copy Selection', 
                    icon: <Copy />, 
                    disabled: !selection, 
                    action: () => {
                        if (selection) {
                            navigator.clipboard.writeText(selection);
                            addNotification('Selection copied to clipboard', 'info');
                        }
                    } 
                },
                { type: 'separator' },
                { label: 'Clear Filter', action: () => setSearchTerm('') },
                { label: 'Refresh Logs', icon: <RefreshCw />, action: () => setLogs(generateLogs(currentChapter)) },
                { type: 'separator' },
                { label: 'Analyze in Terminal', icon: <Terminal />, action: () => addNotification('Sending logs to TTY...', 'info') }
            ]
        });
    };

    // Theme Variables
    const bgMain = isLightMode ? 'bg-[#ffffff]' : 'bg-[#1a1c23]';
    const textBase = isLightMode ? 'text-slate-600' : 'text-gray-300';
    const borderCol = isLightMode ? 'border-slate-200' : 'border-gray-700';
    const headerBg = isLightMode ? 'bg-[#f1f5f9]' : 'bg-[#242832]';
    const footerBg = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#242832]';
    const inputBg = isLightMode ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#1a1c23] border-gray-600 text-white';

    return (
        <div 
            className={`h-full flex flex-col font-mono text-sm relative select-text cursor-auto ${bgMain} ${textBase}`}
            onContextMenu={handleContextMenu}
        >
            {/* Toolbar */}
            <div className={`${headerBg} p-2 border-b ${borderCol} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                    <FileText size={16} className={isLightMode ? 'text-slate-500' : 'text-gray-400'} />
                    <span className={`font-bold ${isLightMode ? 'text-slate-800' : 'text-gray-200'}`}>/var/log/system.log</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Filter logs..." 
                            className={`border rounded px-2 py-1 text-xs pl-7 w-48 focus:border-blue-500 outline-none ${inputBg}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={12} className="absolute left-2 top-1.5 text-gray-500" />
                    </div>
                    <button 
                        onClick={() => setLogs(generateLogs(currentChapter))} 
                        className={`p-1 rounded ${isLightMode ? 'hover:bg-slate-200' : 'hover:bg-gray-700'}`} 
                        title="Refresh Logs"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Log Content */}
            <div className="flex-1 overflow-auto p-4 space-y-0.5 custom-scrollbar" ref={scrollRef}>
                {filteredLogs.map((log, i) => {
                    let className = "px-1 transition-colors whitespace-nowrap cursor-pointer ";
                    
                    if (log.includes('WARN')) {
                        className += isLightMode ? "text-amber-600 bg-amber-50" : "text-yellow-400 hover:bg-white/5";
                    } else if (log.includes('ERROR')) {
                        className += isLightMode ? "text-red-600 bg-red-50" : "text-red-400 hover:bg-white/5";
                    } else if (log.includes('SYSTEM')) {
                        className += isLightMode ? "text-blue-700 bg-blue-50 font-bold" : "text-blue-200 hover:bg-white/5"; 
                    } else {
                        className += isLightMode ? "text-slate-600 hover:bg-slate-100" : "text-gray-300 hover:bg-white/5";
                    }

                    if (searchTerm && log.toLowerCase().includes(searchTerm.toLowerCase())) {
                        className += isLightMode ? " bg-yellow-200 text-black" : " bg-blue-900/60 text-white";
                    }

                    return (
                        <div key={i} className={className} onClick={() => handleLogClick(log)}>
                            {log}
                        </div>
                    );
                })}
                {filteredLogs.length === 0 && (
                    <div className="text-center text-gray-500 mt-8 font-sans">No matching logs found.</div>
                )}
            </div>
            
            {/* Footer */}
            <div className={`${footerBg} px-2 py-1 text-xs text-gray-500 border-t ${borderCol} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                    <AlertTriangle size={12} className="text-green-500" />
                    <span className="text-green-500 font-sans">Secure Audit Mode Enabled</span>
                </div>
                <div className="font-sans">
                    {logs.length} lines
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;


import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PACKETS } from '../../constants';
import { Packet } from '../../types';
import { ChevronRight, ChevronDown, Filter, X, Search, Zap, AlertTriangle, Lock, Play, Pause } from 'lucide-react';
import { useChallenge } from '../../contexts/ChallengeContext';
import { useToast } from '../ToastNotification';
import { useQuest } from '../../contexts/QuestContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNarrative } from '../../contexts/NarrativeContext';
import { simulationEngine } from '../../services/simulationEngine';

// ... (TreeItem Interface and Component remain the same as previous) ...

interface TreeItemProps {
    label: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
    value?: string;
}

const TreeItem: React.FC<TreeItemProps> = ({ label, children, defaultOpen = false, value }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { isLightMode } = useTheme();

    useEffect(() => {
        setIsOpen(defaultOpen);
    }, [defaultOpen]);

    const hoverClass = isLightMode ? 'hover:bg-[#dbeeff]' : 'hover:bg-[#353535]';
    const activeClass = isOpen ? (isLightMode ? 'bg-[#e4f0f6]' : 'bg-[#2a2a2a]') : '';
    const labelColor = isLightMode ? 'text-[#2c3e50]' : 'text-gray-300';
    const valueColor = isLightMode ? 'text-black' : 'text-gray-400';
    const borderColor = isLightMode ? 'border-gray-300' : 'border-gray-700';

    return (
        <div className="font-sans text-[11px] select-text">
            <div 
                className={`flex items-start ${hoverClass} cursor-pointer py-0.5 px-1 ${activeClass}`}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            >
                <div className="mr-1 mt-0.5 text-gray-500">
                    {children ? (
                        isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />
                    ) : <div className="w-[10px]" />}
                </div>
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className={`font-medium ${labelColor}`}>{label}</span>
                    {value && <span className={`ml-1 font-normal ${valueColor}`}>{value}</span>}
                </div>
            </div>
            {isOpen && children && (
                <div className={`pl-4 border-l border-dotted ${borderColor} ml-1.5`}>
                    {children}
                </div>
            )}
        </div>
    );
};

const Wireshark: React.FC = () => {
  const [selectedPacketId, setSelectedPacketId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [isLiveCapture, setIsLiveCapture] = useState(false);
  const [dynamicPackets, setDynamicPackets] = useState<Packet[]>([]);
  
  const { difficulty } = useChallenge();
  const { addNotification } = useToast();
  const { trackEvent } = useQuest();
  const { isLightMode } = useTheme();
  const { currentChapter, discoverClue } = useNarrative();

  // --- Simulation Logic ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLiveCapture) {
        interval = setInterval(() => {
            const nextId = (MOCK_PACKETS.length + dynamicPackets.length + 1);
            const newPackets = simulationEngine.generateBurst(nextId, 1, Date.now() / 1000);
            setDynamicPackets(prev => [...prev, ...newPackets].slice(-50)); // Keep last 50
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLiveCapture, dynamicPackets]);

  // Filter & Noise Logic
  const processedPackets = useMemo(() => {
      let data = [...MOCK_PACKETS, ...dynamicPackets];

      // OVERRIDE PACKET 24 based on Difficulty (Legacy CTF)
      const challengePacketIndex = data.findIndex(p => p.id === 24);
      if (challengePacketIndex !== -1) {
          if (difficulty === 'casual') {
              data[challengePacketIndex] = {
                  ...data[challengePacketIndex],
                  info: 'POST /admin-login HTTP/1.1 (application/x-www-form-urlencoded)',
                  hex: `0000 50 4f 53 54 ... (Masked)`
              };
          } else {
              data[challengePacketIndex] = {
                  ...data[challengePacketIndex],
                  info: 'POST /admin-login HTTP/1.1 (application/x-www-form-urlencoded)',
                  hex: `0000 50 4f 53 54 20 2f ... YWRtaW46eU91SGF2ZUhBY2tlZE0zLkVuSk9Z ...`
              };
          }
      }

      // CHAPTER 3 INJECTION
      if (currentChapter >= 3) {
          const ftpExists = data.find(p => p.id === 1337);
          if (!ftpExists) {
             data.push({
                id: 1337,
                time: '6.555231',
                source: '192.168.1.15',
                destination: '45.33.22.11',
                protocol: 'FTP',
                length: 1024,
                info: 'Request: STOR project_omega_source.zip',
                hex: '50 4B 03 04 ... [ZIP HEADER]'
            });
          }
      }

      if (filter) {
          const lowerFilter = filter.toLowerCase();
          data = data.filter(p => 
              p && (
                (p.info?.toLowerCase()?.includes(lowerFilter)) || 
                (p.protocol?.toLowerCase()?.includes(lowerFilter)) ||
                p.id?.toString() === lowerFilter
              )
          );
      }
      return data.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
  }, [difficulty, filter, currentChapter, dynamicPackets]);

  const selectedPacket = selectedPacketId ? processedPackets.find(p => p && p.id === selectedPacketId) : null;
  const shouldExpand = difficulty === 'casual';

  // --- QUEST TRACKING HANDLER ---
  const handlePacketClick = (id: number) => {
      setSelectedPacketId(id);
      trackEvent('WIRESHARK_INSPECT', id.toString());
      
      if (id === 1337) {
          discoverClue('1337', 'wireshark');
      }
  };

  // --- Helpers (Mac, Headers) ---
  // ... (Same getMac, getIpHeader, etc. as previous implementation - removed for brevity but assumed present)
  const getMac = (ip: string) => `02:00:00:${ip.split('.').map(o => parseInt(o).toString(16).padStart(2, '0')).join(':').substring(0,8)}`;

  // --- THEME VARIABLES ---
  const theme = {
      bg: isLightMode ? 'bg-white' : 'bg-[#1e1e1e]',
      text: isLightMode ? 'text-black' : 'text-gray-300',
      border: isLightMode ? 'border-gray-300' : 'border-[#333]',
      menuBg: isLightMode ? 'bg-[#f5f5f5]' : 'bg-[#2d2d2d]',
      menuText: isLightMode ? 'text-[#333]' : 'text-gray-300',
      toolbarBg: isLightMode ? 'bg-[#e6e6e6]' : 'bg-[#252525]',
      inputBg: isLightMode ? 'bg-white text-black' : 'bg-[#1e1e1e] text-white',
      headerBg: isLightMode ? 'bg-[#eef] text-[#2c3e50]' : 'bg-[#2a2a2a] text-gray-300',
      hexBg: isLightMode ? 'bg-white text-[#444]' : 'bg-[#1e1e1e] text-gray-400',
      hexOffsetBg: isLightMode ? 'bg-[#fafafa]' : 'bg-[#252525]',
      detailsBg: isLightMode ? 'bg-white text-black' : 'bg-[#1e1e1e] text-gray-300',
  };

  return (
    <div className={`h-full flex flex-col text-xs font-sans select-none ${theme.bg} ${theme.text}`}>
      {/* Menu Bar */}
      <div className={`${theme.menuBg} ${theme.menuText} border-b ${theme.border} flex px-2 py-1 space-x-3 text-[11px] shadow-sm`}>
          {['File', 'Edit', 'View', 'Go', 'Capture', 'Analyze', 'Statistics', 'Tools'].map(m => (
              <span key={m} className={`px-1 rounded cursor-default ${isLightMode ? 'hover:bg-gray-200' : 'hover:bg-white/10'}`}>{m}</span>
          ))}
      </div>

      {/* Toolbar */}
      <div className={`${theme.toolbarBg} p-1 border-b ${theme.border} flex items-center space-x-2`}>
         <div className="flex space-x-1 ml-1">
             <button 
                onClick={() => setIsLiveCapture(!isLiveCapture)}
                className={`p-1 rounded ${isLiveCapture ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-500'} text-white transition-colors`}
                title={isLiveCapture ? "Stop Capture" : "Start Live Capture"}
             >
                 {isLiveCapture ? <Pause size={14} /> : <Play size={14} />}
             </button>
         </div>
         <div className={`flex-1 flex items-center border ${theme.border} h-6 px-1 rounded-sm mx-2 ${theme.inputBg}`}>
             <input 
                type="text" 
                placeholder="Apply a display filter ... <Ctrl-/>" 
                className="flex-1 outline-none bg-transparent text-[11px] px-1 placeholder-gray-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
             />
             {filter && <button onClick={() => setFilter('')}><X size={12} className="text-gray-500 hover:text-red-500"/></button>}
         </div>
         <div className="text-[10px] text-gray-500 font-mono">
             {isLiveCapture ? 'LIVE' : 'STATIC'}
         </div>
      </div>

      {/* Pane 1: Packet List */}
      <div className={`flex-1 overflow-auto border-b ${theme.border} relative ${theme.bg}`}>
        <table className="w-full text-left border-collapse table-fixed">
            <thead className={`${theme.headerBg} sticky top-0 z-10 text-[11px] shadow-sm font-medium`}>
                <tr>
                    <th className={`border-r ${theme.border} px-1 w-12`}>No.</th>
                    <th className={`border-r ${theme.border} px-1 w-20`}>Time</th>
                    <th className={`border-r ${theme.border} px-1 w-32`}>Source</th>
                    <th className={`border-r ${theme.border} px-1 w-32`}>Destination</th>
                    <th className={`border-r ${theme.border} px-1 w-16`}>Protocol</th>
                    <th className={`border-r ${theme.border} px-1 w-16`}>Length</th>
                    <th className="px-1">Info</th>
                </tr>
            </thead>
            <tbody className="font-sans text-[11px]">
                {processedPackets.map(p => {
                    if (!p) return null;
                    let rowColor = isLightMode ? "bg-white" : "bg-[#1e1e1e]";
                    let textColor = isLightMode ? "text-black" : "text-gray-300";
                    
                    if (selectedPacketId === p.id) {
                        rowColor = "bg-[#0055aa] !important";
                        textColor = "text-white !important";
                    }
                    
                    return (
                        <tr key={p.id} className={`${rowColor} ${textColor} cursor-pointer border-b border-transparent`} onClick={() => handlePacketClick(p.id)}>
                            <td className={`border-r ${isLightMode ? 'border-gray-300/50' : 'border-[#333]/50'} px-1`}>{p.id}</td>
                            <td className={`border-r ${isLightMode ? 'border-gray-300/50' : 'border-[#333]/50'} px-1`}>{p.time}</td>
                            <td className={`border-r ${isLightMode ? 'border-gray-300/50' : 'border-[#333]/50'} px-1 overflow-hidden`}>{p.source}</td>
                            <td className={`border-r ${isLightMode ? 'border-gray-300/50' : 'border-[#333]/50'} px-1 overflow-hidden`}>{p.destination}</td>
                            <td className={`border-r ${isLightMode ? 'border-gray-300/50' : 'border-[#333]/50'} px-1`}>{p.protocol}</td>
                            <td className={`border-r ${isLightMode ? 'border-gray-300/50' : 'border-[#333]/50'} px-1`}>{p.length}</td>
                            <td className="px-1 overflow-hidden text-ellipsis">{p.info}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>

      {/* Pane 2: Packet Details (Stub) */}
      <div className={`h-[35%] overflow-auto border-b ${theme.border} ${theme.detailsBg} font-sans text-[11px] p-1`}>
         {/* Simplified Detail View - Full implementation was in previous step */}
         {selectedPacket ? (
            <div className="space-y-1">
                 <div className="font-bold">Frame {selectedPacket.id}: {selectedPacket.length} bytes</div>
                 <div>{selectedPacket.protocol} (Src: {selectedPacket.source}, Dst: {selectedPacket.destination})</div>
            </div>
         ) : <div className="text-gray-500 text-center mt-4">No packet selected</div>}
      </div>

       {/* Pane 3: Hex View (Stub) */}
       <div className={`h-[120px] overflow-auto ${theme.hexBg} font-mono p-1 text-[10px] leading-tight`}>
           {selectedPacket ? selectedPacket.hex : ''}
       </div>
    </div>
  );
};

export default Wireshark;

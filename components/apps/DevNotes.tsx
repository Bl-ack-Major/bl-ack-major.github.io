
import React from 'react';
import { FileText, CheckCircle, Lock } from 'lucide-react';
import { useChallenge } from '../../contexts/ChallengeContext';
import { useTheme } from '../../contexts/ThemeContext';

const DevNotes: React.FC = () => {
    const { stage } = useChallenge();
    const { isLightMode } = useTheme();

    // Stage 0: Locked
    if (stage < 1) {
        return (
            <div className={`h-full flex flex-col items-center justify-center p-8 text-center ${isLightMode ? 'bg-slate-50 text-slate-500' : 'bg-[#111] text-red-500'}`}>
                <Lock size={64} className="mb-4 animate-pulse" />
                <h1 className="text-2xl font-bold mb-2">ACCESS DENIED</h1>
                <p className={isLightMode ? 'text-slate-400' : 'text-gray-400'}>Security Clearance Level 1 Required.</p>
                <p className="text-xs mt-4 opacity-70">System integrity check failed. Verify logs for authorization.</p>
            </div>
        );
    }

    // Theme Variables
    const bgMain = isLightMode ? 'bg-[#ffffea]' : 'bg-[#1e1e1e]';
    const textMain = isLightMode ? 'text-gray-800' : 'text-gray-300';
    const headerBg = isLightMode ? 'bg-[#f0f0d0]' : 'bg-[#252526]';
    const borderCol = isLightMode ? 'border-[#d0d0b0]' : 'border-[#333]';
    const noteHighlight = isLightMode ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-[#2d2d2d] border-[#444] text-gray-400';
    const warningBg = isLightMode ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-yellow-900/20 border-yellow-700/50 text-yellow-500';

    return (
        <div className={`h-full flex flex-col font-mono text-sm ${bgMain} ${textMain}`}>
            <div className={`${headerBg} p-2 border-b ${borderCol} flex items-center justify-between`}>
                <span className="font-bold flex items-center gap-2"><FileText size={14}/> .dev_notes</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={12}/> DECRYPTED
                    </span>
                </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <p className="font-bold underline">TODO LIST - Jan 2024</p>
                
                <ul className="list-disc pl-5 space-y-2">
                    <li className="line-through opacity-60">Fix login screen responsiveness on mobile</li>
                    <li className="line-through opacity-60">Update simulated kernel version</li>
                    <li>
                        <span>Investigate random crash in Auth Module.</span>
                        <p className="text-xs opacity-70 mt-1 italic">
                            Dev Note: The token generator seems to be leaking raw memory addresses instead of hashing properly. 
                            Found this weird output in the stack trace yesterday. Not sure if it's junk data or a pattern.
                        </p>
                        
                        {/* HAYSTACK / NOISE SECTION */}
                        <div className={`mt-2 border p-3 rounded font-mono text-xs select-text cursor-text ${noteHighlight}`}>
                            <p className={`font-bold border-b mb-1 ${isLightMode ? 'border-gray-300' : 'border-[#444]'}`}>core_dump.log</p>
                            <p>0x00A1: [45, 12, 99, 21]</p>
                            <p>0x00A2: [00, 14, 00, 11]</p>
                            <p>0x00A3: [101, 72, 65, 99] &lt;-- Check bounds?</p>
                            <p>0x00A4: [12, 44, 66, 88]</p>
                            <p>0x00A5: [FF, FF, 0A, 0D]</p>
                        </div>
                    </li>
                    <li>Investigate memory leak in SystemMonitor</li>
                </ul>

                <hr className={`my-4 ${isLightMode ? 'border-gray-400' : 'border-gray-700'}`} />

                <p className="font-bold">SECURITY NOTICE</p>
                <div className={`border p-2 text-xs rounded ${warningBg}`}>
                    Warning: Do not leave debug data exposed. Use the 'ascii' converter tool in the terminal to verify if any sensitive strings are leaking in the dump above.
                </div>
            </div>
        </div>
    );
};

export default DevNotes;

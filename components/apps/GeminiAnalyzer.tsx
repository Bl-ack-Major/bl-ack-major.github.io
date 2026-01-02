import React, { useState, useEffect, useRef } from 'react';
import { analyzeLogWithGemini } from '../../services/geminiService';
import { SECURITY_LOGS } from '../../constants';
import { Bot, RefreshCw, Play, AlertTriangle, Shield, Activity, Terminal, Copy, Check, Zap, Cpu } from 'lucide-react';
import { useQuest } from '../../contexts/QuestContext';
import { useTheme } from '../../contexts/ThemeContext';

const GeminiAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [displayedAnalysis, setDisplayedAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN'>('UNKNOWN');
  
  const { trackEvent } = useQuest();
  const { isLightMode } = useTheme();
  const outputRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for AI response
  useEffect(() => {
    if (analysis) {
        let i = 0;
        const speed = 10; // ms per char
        setDisplayedAnalysis('');
        const interval = setInterval(() => {
            setDisplayedAnalysis(analysis.substring(0, i));
            i++;
            if (i > analysis.length) clearInterval(interval);
            // Auto scroll
            if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }, speed);
        return () => clearInterval(interval);
    }
  }, [analysis]);

  const handleAnalyze = async () => {
    if (!inputText) return;
    setLoading(true);
    setAnalysis('');
    setDisplayedAnalysis('');
    setThreatLevel('UNKNOWN');
    
    trackEvent('GEMINI_ANALYZE', inputText.substring(0, 50)); 

    const result = await analyzeLogWithGemini(inputText);
    
    // Simple heuristic to determine threat level based on keywords
    if (result.toLowerCase().includes('critical') || result.toLowerCase().includes('high severity')) {
        setThreatLevel('HIGH');
    } else if (result.toLowerCase().includes('warning') || result.toLowerCase().includes('suspicious')) {
        setThreatLevel('MEDIUM');
    } else {
        setThreatLevel('LOW');
    }

    setAnalysis(result);
    setLoading(false);
  };

  const loadExample = () => {
    const log = SECURITY_LOGS[1];
    setInputText(`${log.timestamp} ${log.level} ${log.source}: ${log.message}`);
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // Theme Config
  const theme = {
      bg: isLightMode ? 'bg-slate-50' : 'bg-[#0b0f15]',
      panelBg: isLightMode ? 'bg-white border-slate-200' : 'bg-[#151921] border-white/10',
      headerBg: isLightMode ? 'bg-white/80 border-slate-200' : 'bg-[#151921]/90 border-white/5',
      textMain: isLightMode ? 'text-slate-800' : 'text-gray-200',
      textSec: isLightMode ? 'text-slate-500' : 'text-gray-500',
      accent: isLightMode ? 'text-blue-600' : 'text-cyan-400',
      accentBorder: isLightMode ? 'border-blue-200' : 'border-cyan-500/30',
      inputBg: isLightMode ? 'bg-slate-50 text-slate-800 border-slate-300' : 'bg-black/30 text-gray-300 border-white/10',
      outputBg: isLightMode ? 'bg-slate-900 text-green-400' : 'bg-black text-green-500',
  };

  // Dynamic status color
  const getStatusColor = () => {
      if (loading) return 'text-yellow-500';
      if (threatLevel === 'HIGH') return 'text-red-500';
      if (threatLevel === 'MEDIUM') return 'text-orange-500';
      if (threatLevel === 'LOW') return 'text-green-500';
      return isLightMode ? 'text-slate-400' : 'text-gray-500';
  };

  return (
    <div className={`h-full flex flex-col ${theme.bg} font-sans transition-colors duration-300`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between backdrop-blur-md ${theme.headerBg} z-10`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${isLightMode ? 'bg-blue-50 border-blue-200' : 'bg-cyan-950/30 border-cyan-500/20'}`}>
                <Bot className={theme.accent} size={20} />
            </div>
            <div>
                <h2 className={`font-bold text-sm tracking-wide uppercase ${theme.textMain}`}>Neural Defense Core</h2>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                    {/* Updated UI version to match backend gemini-3-flash-preview model */}
                    <p className={`text-[10px] font-mono ${theme.textSec}`}>GEMINI-3-FLASH // ONLINE</p>
                </div>
            </div>
        </div>
        
        <div className={`px-3 py-1 rounded border text-xs font-mono font-bold flex items-center gap-2 ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-black/40 border-white/10 text-gray-400'}`}>
            <Activity size={12} className={getStatusColor()} />
            STATUS: {loading ? 'ANALYZING...' : threatLevel === 'UNKNOWN' ? 'IDLE' : `THREAT: ${threatLevel}`}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        
        {/* Input Sector */}
        <div className={`flex-1 flex flex-col rounded-xl border overflow-hidden transition-all duration-300 ${theme.panelBg}`}>
            <div className={`px-4 py-2 border-b flex justify-between items-center ${isLightMode ? 'bg-slate-50/50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.textSec}`}>
                    <Terminal size={12} /> Data Ingestion
                </span>
                <button 
                    onClick={loadExample} 
                    className={`text-[10px] px-2 py-1 rounded border transition-colors flex items-center gap-1 ${isLightMode ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400'}`}
                >
                    <RefreshCw size={10} /> Load Sample
                </button>
            </div>
            
            <div className="flex-1 p-4 flex flex-col">
                <textarea
                    className={`flex-1 w-full rounded-lg p-3 font-mono text-xs resize-none outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all ${theme.inputBg}`}
                    placeholder="// Paste server logs, packet dumps, or suspicious code here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    spellCheck={false}
                />
                
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !inputText}
                        className={`
                            px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg
                            ${loading 
                                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                : isLightMode 
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200' 
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20'
                            }
                        `}
                    >
                        {loading ? <Cpu className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                        {loading ? 'Processing...' : 'Analyze Pattern'}
                    </button>
                </div>
            </div>
        </div>

        {/* Output Sector */}
        <div className={`flex-1 flex flex-col rounded-xl border overflow-hidden relative ${theme.panelBg} ${threatLevel === 'HIGH' ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''}`}>
             
             {/* Loading Overlay */}
             {loading && (
                 <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                     <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                     <p className="text-cyan-400 font-mono text-xs animate-pulse">ESTABLISHING NEURAL LINK...</p>
                 </div>
             )}

             <div className={`px-4 py-2 border-b flex justify-between items-center ${isLightMode ? 'bg-slate-50/50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme.textSec}`}>
                    <Shield size={12} className={threatLevel === 'HIGH' ? 'text-red-500' : ''} /> Intelligence Report
                </span>
                {analysis && (
                    <button 
                        onClick={handleCopy}
                        className={`text-gray-400 hover:text-white transition-colors ${copied ? 'text-green-500' : ''}`}
                        title="Copy Report"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                )}
             </div>

             <div 
                ref={outputRef}
                className={`flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap shadow-inner ${theme.outputBg}`}
             >
                {displayedAnalysis ? (
                    <div>
                        <div className="opacity-50 mb-4 pb-2 border-b border-white/10 flex justify-between">
                            <span>Target: Input_Buffer_0xA1</span>
                            {/* Updated UI version to match backend gemini-3-flash-preview model */}
                            <span>Model: Gemini-3-Flash</span>
                        </div>
                        {displayedAnalysis}
                        {!loading && displayedAnalysis.length === analysis.length && (
                            <div className="mt-4 text-cyan-500 animate-pulse">_</div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                        <Zap size={48} className="mb-2" />
                        <p>Awaiting Input Data</p>
                    </div>
                )}
             </div>
        </div>

      </div>
    </div>
  );
};

export default GeminiAnalyzer;
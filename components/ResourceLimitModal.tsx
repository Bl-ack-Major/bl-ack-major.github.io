
import React from 'react';
import { AlertTriangle, X, Layout } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ResourceLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResourceLimitModal: React.FC<ResourceLimitModalProps> = ({ isOpen, onClose }) => {
    const { isLightMode } = useTheme();

    if (!isOpen) return null;

    const cardBg = isLightMode 
        ? 'bg-white/90 backdrop-blur-2xl border-red-200 shadow-xl' 
        : 'bg-[#1a1a1a]/95 backdrop-blur-2xl border-red-500/30 shadow-2xl';
    
    const textMain = isLightMode ? 'text-slate-900' : 'text-white';
    const textSec = isLightMode ? 'text-slate-600' : 'text-gray-400';

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-300">
            <div className={`relative w-full max-w-md rounded-3xl border p-8 overflow-hidden ${cardBg}`}>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                    <Layout size={200} />
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <AlertTriangle className="text-red-500" size={32} />
                    </div>

                    <h2 className={`text-2xl font-bold mb-3 tracking-tight ${textMain}`}>
                        Resource Limit Reached
                    </h2>
                    
                    <p className={`text-sm leading-relaxed mb-8 ${textSec}`}>
                        To maintain system stability and performance, you can only have <span className="font-bold text-red-500">4 apps</span> open at once.
                        <br /><br />
                        Please <span className="font-bold">close a few tabs before opening more</span>.
                    </p>

                    <button 
                        onClick={onClose}
                        className={`
                            w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all
                            ${isLightMode 
                                ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95' 
                                : 'bg-white text-black hover:bg-gray-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            }
                        `}
                    >
                        Acknowledge
                    </button>
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-gray-500"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default ResourceLimitModal;

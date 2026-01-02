
import React, { useEffect } from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
    const { isLightMode } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const shortcuts = [
        { keys: ['Meta / Win'], desc: 'Toggle Start Menu' },
        { keys: ['Alt', 'F4'], desc: 'Close Active Window' },
        { keys: ['Esc'], desc: 'Close Modals / Menus' },
        { keys: ['Shift', '?'], desc: 'Toggle Shortcuts Help' },
    ];

    const bgClass = isLightMode 
        ? "bg-white/90 border-slate-200 text-slate-800" 
        : "bg-[#1a1c23]/95 border-white/10 text-white";

    return (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${bgClass}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-lg font-bold">
                        <Keyboard size={20} className="text-blue-500" />
                        <h2>Keyboard Shortcuts</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded hover:bg-black/10 transition-colors"><X size={18} /></button>
                </div>

                <div className="space-y-3">
                    {shortcuts.map((s, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isLightMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                            <span className="text-sm font-medium opacity-80">{s.desc}</span>
                            <div className="flex gap-1">
                                {s.keys.map((k, j) => (
                                    <kbd key={j} className={`px-2 py-1 rounded text-xs font-mono font-bold shadow-sm border-b-2 ${isLightMode ? 'bg-white border-slate-300 text-slate-600' : 'bg-[#2a2d35] border-black text-gray-300'}`}>
                                        {k}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShortcutsModal;

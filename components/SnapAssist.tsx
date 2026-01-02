
import React from 'react';
import { AppId, WindowState } from '../types';
import { APP_CONFIGS_META } from '../constants';

interface SnapAssistProps {
    side: 'left' | 'right';
    windows: WindowState[];
    activeWindowId: AppId | null;
    onSelect: (id: AppId) => void;
    onCancel: () => void;
}

const SnapAssist: React.FC<SnapAssistProps> = ({ side, windows, activeWindowId, onSelect, onCancel }) => {
    // Filter windows: must be open, not minimized, and not the currently active (already snapped) window
    const availableWindows = windows.filter(w => !w.isMinimized && w.id !== activeWindowId);

    if (availableWindows.length === 0) {
        return null; // Nothing to show
    }

    return (
        <div 
            className="absolute top-0 bottom-10 bg-black/40 backdrop-blur-md z-[60] flex flex-col p-8 animate-in fade-in duration-200"
            style={{
                left: side === 'left' ? 0 : '50%',
                width: '50%',
            }}
            onClick={onCancel} // Click background to cancel snap assist
        >
            <div className="text-white font-bold text-xl mb-6 pl-2">Select a window to snap</div>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {availableWindows.map(w => {
                    const config = APP_CONFIGS_META[w.id];
                    return (
                        <div 
                            key={w.id}
                            onClick={(e) => { e.stopPropagation(); onSelect(w.id); }}
                            className="bg-[#1f2229] border border-gray-700 hover:border-[#367BF0] rounded-lg p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-xl group flex flex-col items-center justify-center aspect-video"
                        >
                            <div className="mb-3 transform scale-150 text-gray-400 group-hover:text-white transition-colors">
                                {config.icon}
                            </div>
                            <span className="text-gray-300 font-medium text-sm group-hover:text-[#367BF0]">{w.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SnapAssist;

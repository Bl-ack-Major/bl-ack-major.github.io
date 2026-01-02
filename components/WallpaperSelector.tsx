import React from 'react';
import { X, Image as ImageIcon, Play, Clock, Shuffle } from 'lucide-react';
import { WALLPAPERS } from '../constants';
import { Wallpaper } from '../types';

interface WallpaperSelectorProps {
  currentId: string;
  onSelect: (wallpaper: Wallpaper) => void;
  onClose: () => void;
  isSlideshow: boolean;
  onToggleSlideshow: () => void;
  onToggleRandom: () => void;
}

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ 
  currentId, 
  onSelect, 
  onClose, 
  isSlideshow, 
  onToggleSlideshow,
  onToggleRandom
}) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1f2229] border border-gray-700 rounded-lg shadow-2xl w-[800px] max-w-[95vw] h-[600px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#161b22]">
          <div className="flex items-center gap-2 text-white font-bold">
            <ImageIcon className="text-[#367BF0]" size={20} />
            <h2>Desktop Background</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-700 bg-[#0d1117] text-sm">
           <button 
             onClick={onToggleSlideshow}
             className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${isSlideshow ? 'bg-[#367BF0] border-[#367BF0] text-white' : 'bg-[#1f2229] border-gray-600 text-gray-300 hover:border-gray-400'}`}
           >
             <Play size={14} className={isSlideshow ? "fill-current" : ""} /> Slideshow (5m)
           </button>
           <button 
             onClick={onToggleRandom}
             className="flex items-center gap-2 px-3 py-1.5 rounded border bg-[#1f2229] border-gray-600 text-gray-300 hover:border-gray-400 transition-all hover:text-white"
           >
             <Shuffle size={14} /> Pick Random
           </button>
           <div className="h-4 w-px bg-gray-700 mx-2"></div>
           <span className="text-gray-500 flex items-center gap-2">
             <Clock size={14} /> Dynamic Mode: {new Date().getHours() > 19 || new Date().getHours() < 6 ? 'Night' : 'Day'}
           </span>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117] custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {WALLPAPERS.map((wp) => (
              <div 
                key={wp.id}
                className={`group relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${currentId === wp.id ? 'border-[#367BF0] shadow-[0_0_15px_rgba(54,123,240,0.3)]' : 'border-transparent hover:border-gray-500'}`}
                onClick={() => onSelect(wp)}
              >
                <img 
                  src={wp.url} 
                  alt={wp.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                  <span className="text-white text-xs font-bold">{wp.name}</span>
                  {currentId === wp.id && <span className="bg-[#367BF0] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">ACTIVE</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#161b22] border-t border-gray-700 text-xs text-gray-500 flex justify-between">
           <span>{WALLPAPERS.length} Wallpapers Available</span>
           <span>Right-click desktop to change anytime</span>
        </div>
      </div>
    </div>
  );
};

export default WallpaperSelector;
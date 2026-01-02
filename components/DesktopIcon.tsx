import React, { useRef, forwardRef } from 'react';
import { AppId, AppMeta } from '../types';
import { useSound } from '../contexts/SoundContext';
import { SOUND_KEYS } from '../constants';
import { Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DesktopIconProps {
    id: AppId;
    config: AppMeta;
    isSelected: boolean;
    isLocked?: boolean;
    onSelect: (id: AppId) => void;
    onOpen: (id: AppId) => void;
    onContextMenu: (e: React.MouseEvent | React.TouchEvent, id: AppId) => void;
}

const DesktopIcon = forwardRef<HTMLButtonElement, DesktopIconProps>(({
    id,
    config,
    isSelected,
    isLocked = false,
    onSelect,
    onOpen,
    onContextMenu
}, ref) => {
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { playSound } = useSound();
    const { isLightMode } = useTheme();
    const isMobile = window.innerWidth < 768;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isLocked) return;
        playSound(SOUND_KEYS.CLICK);
        onSelect(id);
        longPressTimer.current = setTimeout(() => {
            onContextMenu(e, id);
        }, 600);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLocked) {
            playSound(SOUND_KEYS.ERROR);
            return;
        }
        playSound(SOUND_KEYS.CLICK);
        onSelect(id);
        if (isMobile) {
            onOpen(id);
        }
    };

    const handleDoubleClick = () => {
        if (!isLocked && !isMobile) onOpen(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isLocked) onOpen(id);
            else playSound(SOUND_KEYS.ERROR);
        }
    };

    const iconColor = isLightMode
        ? 'text-slate-600'
        : config.color.replace('bg-', 'text-').replace('-900', '-500');

    const containerClasses = isLightMode
        ? `bg-white/80 backdrop-blur-md shadow-sm border border-white/50 rounded-[1.2rem] p-3 md:p-3.5 mb-1.5 transition-all duration-300 ${isSelected ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/30' : 'hover:bg-white hover:shadow-md hover:-translate-y-1'}`
        : `mb-1 p-2 relative transition-transform duration-200 ${isSelected && !isLocked ? 'scale-105 drop-shadow-[0_0_8px_rgba(54,123,240,0.5)]' : ''} ${!isLocked ? 'group-hover:scale-105' : ''}`;

    const wrapperSelectionClass = isSelected && !isLocked && !isLightMode
        ? 'bg-white/10 border-white/20'
        : '';

    // Use focus-visible for keyboard-only focus rings, improving accessibility without cluttering UI for mouse users
    const focusRingClass = isLightMode
        ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-lg"
        : "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-cyan-400 rounded-lg";


    return (
        <button
            ref={ref}
            className={`
                flex flex-col items-center justify-start group cursor-pointer w-[85px] md:w-[100px] p-1.5 md:p-2 rounded border border-transparent transition-all duration-200
                ${wrapperSelectionClass}
                ${focusRingClass}
                ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'active:scale-95'}
            `}
            onClick={handleClick}
            onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(); }}
            onContextMenu={(e) => !isLocked && onContextMenu(e, id)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            aria-label={`Open Application: ${config.name}${isLocked ? ' (Access Denied)' : ''}`}
            aria-disabled={isLocked}
            role="button"
        >
            <div className={containerClasses}>
                {React.cloneElement(config.icon as React.ReactElement<any>, {
                    size: isLightMode ? (isMobile ? 28 : 32) : (isMobile ? 40 : 48),
                    className: iconColor,
                    strokeWidth: isLightMode ? 1.5 : 2
                })}

                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/10 backdrop-blur-[1px]">
                        <div className="bg-black/70 p-1 md:p-1.5 rounded-full border border-gray-500 shadow-lg">
                            <Lock size={isMobile ? 12 : 14} className="text-gray-200" />
                        </div>
                    </div>
                )}
            </div>

            <span
                className={`
                    text-[10px] md:text-xs text-center font-medium font-sans leading-tight px-1.5 md:px-2 py-0.5 rounded max-w-full whitespace-nowrap
                    ${isLightMode
                        ? (isSelected ? 'text-blue-700 font-bold bg-blue-100/50' : 'text-slate-700 font-semibold drop-shadow-sm')
                        : (isSelected ? 'bg-[#367BF0] text-white' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]')
                    }
                `}
                style={{
                    textShadow: isLightMode ? 'none' : (isSelected ? 'none' : '0px 1px 3px black')
                }}
            >
                {config.name}
            </span>
        </button>
    );
});

export default DesktopIcon;
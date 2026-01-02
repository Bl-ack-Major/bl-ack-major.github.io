
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Minus, ChevronsLeftRight } from 'lucide-react';
import { WindowState, AppId } from '../types';
import { useSound } from '../contexts/SoundContext';
import { useTheme } from '../contexts/ThemeContext';
import { SOUND_KEYS } from '../constants';

interface WindowFrameProps {
  windowState: WindowState;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onSnap?: (side: 'left' | 'right' | null) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  onSnap,
  onContextMenu
}) => {
  // UseRefs for high-performance updates bypassing React render cycle during drag
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const currentPos = useRef({ x: windowState.position.x, y: windowState.position.y });
  
  const [ghostSnap, setGhostSnap] = useState<'left' | 'right' | null>(null);
  
  const { playSound } = useSound();
  const { isLightMode } = useTheme();

  const isMobile = window.innerWidth < 768;

  // Sync ref with props when they change externally (e.g. snap assist)
  useEffect(() => {
    if (!isDragging.current) {
        currentPos.current = { x: windowState.position.x, y: windowState.position.y };
    }
  }, [windowState.position]);

  const handleClose = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    playSound(SOUND_KEYS.CLOSE);
    onClose();
  };

  const handleMinimize = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    playSound(SOUND_KEYS.UI_CLICK);
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    playSound(SOUND_KEYS.UI_CLICK);
    onMaximize();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized || isMobile) return;
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - currentPos.current.x,
      y: e.clientY - currentPos.current.y
    };
    onFocus();
    
    // Disable transition during drag for instant response
    if (windowRef.current) windowRef.current.style.transition = 'none';
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (windowState.isMaximized || isMobile) return;
    
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: windowState.size.width,
      height: windowState.size.height
    };
    onFocus();
    document.body.style.cursor = 'se-resize';
    if (windowRef.current) windowRef.current.style.transition = 'none';
  };

  // 60FPS Drag Loop using requestAnimationFrame
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && !windowState.isMaximized && !isMobile) {
        e.preventDefault();
        
        // Calculate new position
        const rawX = e.clientX - dragOffset.current.x;
        const rawY = e.clientY - dragOffset.current.y;

        const maxX = window.innerWidth - windowState.size.width;
        const maxY = window.innerHeight - windowState.size.height - 40;

        const x = Math.max(0, Math.min(rawX, maxX > 0 ? maxX : 0));
        const y = Math.max(0, Math.min(rawY, maxY > 0 ? maxY : 0));

        currentPos.current = { x, y };

        // Snap Logic
        const SNAP_THRESHOLD = 20;
        if (e.clientX < SNAP_THRESHOLD) setGhostSnap('left');
        else if (e.clientX > window.innerWidth - SNAP_THRESHOLD) setGhostSnap('right');
        else setGhostSnap(null);

        // Visual update via RAF
        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(() => {
                if (windowRef.current) {
                    windowRef.current.style.top = `${y}px`;
                    windowRef.current.style.left = `${x}px`;
                }
                rafRef.current = null;
            });
        }
      }
      
      if (isResizing.current && !windowState.isMaximized && !isMobile) {
        e.preventDefault();
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        
        let newWidth = Math.max(300, resizeStart.current.width + deltaX);
        let newHeight = Math.max(200, resizeStart.current.height + deltaY);

        const maxWidth = window.innerWidth - currentPos.current.x;
        const maxHeight = window.innerHeight - currentPos.current.y - 40;

        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(() => {
                if (windowRef.current) {
                    windowRef.current.style.width = `${newWidth}px`;
                    windowRef.current.style.height = `${newHeight}px`;
                }
                rafRef.current = null;
            });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
          isDragging.current = false;
          // Commit final position to React State
          onMove(currentPos.current.x, currentPos.current.y);
          
          if (ghostSnap && onSnap) {
              onSnap(ghostSnap);
              setGhostSnap(null);
          }
          
          // Re-enable transition
          if (windowRef.current) windowRef.current.style.transition = '';
      }
      
      if (isResizing.current) {
          isResizing.current = false;
          document.body.style.cursor = '';
          // We need to sync the size back to React state, but we don't have the final size in a ref here easily without querying DOM
          if (windowRef.current) {
              onResize(windowRef.current.offsetWidth, windowRef.current.offsetHeight);
              windowRef.current.style.transition = '';
          }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [windowState.isMaximized, windowState.size, ghostSnap, onMove, onResize, onSnap, isMobile]);

  if (windowState.isMinimized) return null;

  // On mobile, windows are always effectively maximized
  const style: React.CSSProperties = (windowState.isMaximized || isMobile)
    ? { 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: 'calc(100% - 72px)', 
        zIndex: windowState.zIndex, 
        borderRadius: 0 
      }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      };

  const baseClasses = isLightMode
    ? `absolute flex flex-col bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl overflow-hidden font-sans transition-all duration-300 ${isMobile ? '' : 'rounded-xl'}`
    : `absolute flex flex-col bg-[#1e1e1e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden font-sans transition-all duration-300 ${isMobile ? '' : 'rounded-xl'}`;

  return (
    <>
        {ghostSnap && isDragging.current && !isMobile && (
            <div 
                className="absolute top-0 bottom-10 bg-white/10 border-2 border-white/30 backdrop-blur-sm z-50 rounded-lg pointer-events-none"
                style={{ left: ghostSnap === 'left' ? 0 : '50%', width: '50%', height: 'calc(100% - 80px)' }}
            />
        )}

        <div
            ref={windowRef}
            id={`window-${windowState.id}`}
            className={baseClasses}
            style={style}
            onMouseDown={!isMobile ? onFocus : undefined}
            onContextMenu={onContextMenu}
            tabIndex={-1}
            role="dialog"
            aria-labelledby={`window-title-${windowState.id}`}
            aria-modal="false"
        >
        <div
            className={`h-12 md:h-10 flex items-center px-4 select-none border-b relative shrink-0 ${isLightMode ? 'bg-slate-100/50 border-slate-200/50' : 'bg-black/20 border-white/5'} ${isMobile ? '' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            role="toolbar"
            aria-label="Window Controls"
        >
            {/* Window Controls - Redesign to show all on mobile as well */}
            <div className="flex items-center gap-2 group z-10 absolute left-4">
                <button 
                    onClick={handleClose} 
                    className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-black/50 hover:text-black/80"
                    aria-label="Close"
                    title="Close"
                >
                    <X size={isMobile ? 10 : 8} className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
                <button 
                    onClick={handleMinimize} 
                    className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-black/50 hover:text-black/80"
                    aria-label="Minimize"
                    title="Minimize"
                >
                    <Minus size={isMobile ? 10 : 8} className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
                <button 
                    onClick={handleMaximize} 
                    className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-black/50 hover:text-black/80"
                    aria-label="Maximize"
                    title="Maximize"
                >
                    <ChevronsLeftRight size={isMobile ? 10 : 8} className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 rotate-45'}`} />
                </button>
            </div>
            <div className="w-full flex items-center justify-center pointer-events-none">
                <span id={`window-title-${windowState.id}`} className={`text-xs md:text-sm font-bold md:font-medium ${isLightMode ? 'text-slate-600' : 'text-white/80'}`}>{windowState.title}</span>
            </div>
        </div>
        <div className={`flex-1 overflow-hidden relative ${isLightMode ? 'bg-white/20' : 'bg-[#0d1117]/90'}`}>
            {children}
        </div>
        {!windowState.isMaximized && !isMobile && (
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" 
                onMouseDown={handleResizeMouseDown} 
                aria-label="Resize Window"
            />
        )}
        </div>
    </>
  );
};

export default WindowFrame;

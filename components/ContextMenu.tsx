import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface ContextMenuItem {
  label?: string;
  icon?: React.ReactNode;
  action?: () => void;
  type?: 'separator';
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const { isLightMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => {
                const newIndex = prev + 1;
                return newIndex >= items.length ? 0 : newIndex;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => {
                const newIndex = prev - 1;
                return newIndex < 0 ? items.length - 1 : newIndex;
            });
        } else if (e.key === 'Enter') {
            if (activeIndex !== -1) {
                const item = items[activeIndex];
                if (item && !item.disabled && item.action) {
                    item.action();
                    onClose();
                }
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, items, activeIndex]);

  // Adjust position if menu goes off screen
  const menuWidth = 180;
  const menuHeight = items.length * 32;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  const bgClass = isLightMode 
    ? 'bg-white/90 border-slate-200 shadow-xl text-slate-800' 
    : 'bg-[#1a1c23]/95 border-white/10 shadow-2xl text-gray-200';

  return (
    <div 
      ref={menuRef}
      className={`fixed z-[10001] border backdrop-blur-xl rounded-xl py-1.5 min-w-[180px] text-xs font-sans animate-in fade-in zoom-in-95 duration-100 ${bgClass}`}
      style={{ top: adjustedY, left: adjustedX }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className={`h-px my-1 mx-2 ${isLightMode ? 'bg-slate-200' : 'bg-white/10'}`} />;
        }
        
        const isActive = index === activeIndex;

        return (
          <button
            key={index}
            disabled={item.disabled}
            className={`
              w-full text-left px-3 py-2 flex items-center gap-3 transition-colors rounded-md mx-1
              ${item.disabled 
                ? 'opacity-30 cursor-not-allowed' 
                : isActive 
                  ? (isLightMode ? 'bg-blue-500 text-white' : 'bg-[#367BF0] text-white')
                  : (isLightMode ? 'hover:bg-blue-500 hover:text-white' : 'hover:bg-[#367BF0] hover:text-white')
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              item.action?.();
              onClose();
            }}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className={`shrink-0 opacity-70 transition-opacity ${isActive ? 'opacity-100' : 'group-hover:opacity-100'}`}>
              {item.icon && React.cloneElement(item.icon as React.ReactElement<any>, { size: 14 })}
            </span>
            <span className="flex-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;
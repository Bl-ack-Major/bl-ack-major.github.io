
import { useState, useCallback } from 'react';
import { AppId, WindowState } from '../types';
import { APP_CONFIGS_META, SOUND_KEYS } from '../constants';
import { useSound } from '../contexts/SoundContext';
import { useAuth } from '../auth/AuthContext';
import { hasPermission } from '../auth/permissions';
import { useToast } from '../components/ToastNotification';

const MAX_WINDOWS = 4;

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [snapAssistState, setSnapAssistState] = useState<{ side: 'left' | 'right', primaryWindowId: AppId } | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  const { playSound } = useSound();
  const { account } = useAuth();
  const { addNotification } = useToast();

  const focusWindow = useCallback((id: AppId) => {
    if (activeWindowId === id) return; 

    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
  }, [activeWindowId, nextZIndex]);

  const openApp = useCallback((id: AppId, props?: any) => {
    // 1. Check if the app is already open
    const existingWindow = windows.find(w => w.id === id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
          setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, props: props ? { ...w.props, ...props } : w.props } : w));
      } else if (props) {
          setWindows(prev => prev.map(w => w.id === id ? { ...w, props: { ...w.props, ...props } } : w));
      }
      focusWindow(id);
      return;
    }

    // 2. Check Permission
    if (account && !hasPermission(id, account.accountType)) {
        playSound(SOUND_KEYS.ERROR);
        addNotification(`Access Denied: ${account.accountType} account cannot access ${APP_CONFIGS_META[id].name}.`, 'error');
        return;
    }

    // 3. Check Window Limit (MAX 4)
    if (windows.length >= MAX_WINDOWS) {
        playSound(SOUND_KEYS.ERROR);
        setShowLimitWarning(true);
        return;
    }

    playSound(SOUND_KEYS.OPEN);
    const config = APP_CONFIGS_META[id];
    const offset = windows.length * 20;
    const isMobile = window.innerWidth < 768;
    
    const newWindow: WindowState = {
      id,
      title: config.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobile, 
      position: { x: 50 + offset, y: 50 + offset },
      size: isMobile 
        ? { width: window.innerWidth, height: window.innerHeight - 40 } 
        : (config.defaultSize || { width: 800, height: 600 }),
      zIndex: nextZIndex,
      props: props
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(id);
  }, [account, windows, nextZIndex, playSound, addNotification, focusWindow]);

  const closeWindow = useCallback((id: AppId) => {
    playSound(SOUND_KEYS.CLOSE);
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
        setActiveWindowId(null);
    }
    if (snapAssistState?.primaryWindowId === id) {
        setSnapAssistState(null);
    }
  }, [activeWindowId, playSound, snapAssistState]);

  const toggleMinimize = useCallback((id: AppId) => {
    playSound(SOUND_KEYS.CLICK);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  }, [playSound]);

  const toggleMaximize = useCallback((id: AppId) => {
    playSound(SOUND_KEYS.CLICK);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  }, [playSound, focusWindow]);

  const moveWindow = useCallback((id: AppId, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y }, isMaximized: false } : w));
  }, []);

  const resizeWindow = useCallback((id: AppId, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height }, isMaximized: false } : w));
  }, []);

  const snapWindow = useCallback((id: AppId, side: 'left' | 'right') => {
      playSound(SOUND_KEYS.CLICK);
      const width = window.innerWidth / 2;
      const height = window.innerHeight - 40; 
      const x = side === 'left' ? 0 : width;
      const y = 0;

      setWindows(prev => prev.map(w => w.id === id ? {
          ...w,
          position: { x, y },
          size: { width, height },
          isMaximized: false
      } : w));

      const assistSide = side === 'left' ? 'right' : 'left';
      setSnapAssistState({ side: assistSide, primaryWindowId: id });

  }, [playSound]);

  return {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    focusWindow,
    moveWindow,
    resizeWindow,
    snapWindow,
    snapAssistState,
    setSnapAssistState,
    showLimitWarning,
    setShowLimitWarning,
    setWindows,
    setActiveWindowId
  };
};

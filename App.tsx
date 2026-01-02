
import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { AppId, BootStage, Wallpaper } from './types';
import { APP_CONFIGS_META, SOUND_KEYS, WALLPAPERS } from './constants';
import BootSequence from './components/BootSequence';
import LoginScreen from './components/LoginScreen';
import Taskbar from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import WindowFrame from './components/WindowFrame';
import DesktopIcon from './components/DesktopIcon';
import ContextMenu, { ContextMenuItem } from './components/ContextMenu';
import { ToastProvider, useToast } from './components/ToastNotification';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeModal from './components/WelcomeModal';
import LevelUpModal from './components/LevelUpModal';
import ResourceLimitModal from './components/ResourceLimitModal';
import SnapAssist from './components/SnapAssist';
import AdminWelcomeModal from './components/AdminWelcomeModal';
import DesktopWelcome from './components/DesktopWelcome';
import NarrativeHUD from './components/NarrativeHUD';
import LiveRegion, { announce } from './components/LiveRegion'; // New Import
import ShortcutsModal from './components/ShortcutsModal'; // New Import
import { AppSkeleton, TerminalSkeleton } from './components/LoadingSkeletons'; // New Import
import { Loader2, RefreshCw, Maximize, Wallpaper as WallIcon, Monitor, Info, Copy } from 'lucide-react';
import { SoundProvider, useSound } from './contexts/SoundContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { hasPermission } from './auth/permissions';
import { AccountType } from './auth/accountTypes';
import { ChallengeProvider, useChallenge } from './contexts/ChallengeContext';
import { useWindowManager } from './hooks/useWindowManager';
import { FileSystemProvider } from './contexts/FileSystemContext';
import { QuestProvider } from './contexts/QuestContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { NarrativeProvider } from './contexts/NarrativeContext';

// Lazy load applications
const Terminal = lazy(() => import('./components/apps/Terminal'));
const BurpSuite = lazy(() => import('./components/apps/BurpSuite'));
const Wireshark = lazy(() => import('./components/apps/Wireshark'));
const Readme = lazy(() => import('./components/apps/Readme'));
const Learning = lazy(() => import('./components/apps/Learning'));
const AboutMe = lazy(() => import('./components/apps/AboutMe').then(module => ({ default: module.AboutMe })));
const ResumeViewer = lazy(() => import('./components/apps/ResumeViewer').then(module => ({ default: module.ResumeViewer })));
const NmapGUI = lazy(() => import('./components/apps/NmapGUI').then(module => ({ default: module.NmapGUI })));
const ContactMe = lazy(() => import('./components/apps/ContactMe').then(module => ({ default: module.ContactMe })));
const CTFChallenges = lazy(() => import('./components/apps/CTFChallenges'));
const HomeLab = lazy(() => import('./components/apps/HomeLab'));
const Blog = lazy(() => import('./components/apps/Blog'));
const QuestLog = lazy(() => import('./components/apps/QuestLog'));
const FileManager = lazy(() => import('./components/apps/FileManager'));
const SystemMonitor = lazy(() => import('./components/apps/SystemMonitor'));
const ToolsInventory = lazy(() => import('./components/apps/ToolsInventory'));
const CareerGoals = lazy(() => import('./components/apps/CareerGoals'));
const PortfolioMeta = lazy(() => import('./components/apps/PortfolioMeta'));
const HireMe = lazy(() => import('./components/apps/HireMe'));
const SystemLogs = lazy(() => import('./components/apps/SystemLogs'));
const DevNotes = lazy(() => import('./components/apps/DevNotes'));
const SourceViewer = lazy(() => import('./components/apps/SourceViewer'));

const GUEST_DESKTOP_ICONS = [AppId.README];
const RECRUITER_DESKTOP_ICONS = [AppId.README];
const ADMIN_DESKTOP_ICONS = [AppId.README];
const GUEST_PINNED_APPS: AppId[] = [];
const RECRUITER_PINNED_APPS: AppId[] = [];
const ADMIN_PINNED_APPS: AppId[] = [];

const DesktopEnvironment: React.FC<{ bootStage: BootStage; setBootStage: (stage: BootStage) => void; isRecruiterSafeMode: boolean; }> = ({ bootStage, setBootStage, isRecruiterSafeMode }) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, items: ContextMenuItem[] } | null>(null);
  const [showWelcomeChoice, setShowWelcomeChoice] = useState(false);
  const [showAdminWelcome, setShowAdminWelcome] = useState(false);
  const [showRecruiterWelcome, setShowRecruiterWelcome] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const { addNotification } = useToast();
  const { playSound } = useSound();
  const { account } = useAuth();
  const { isLightMode } = useTheme();
  const { difficulty } = useChallenge(); // Hook to check difficulty (Hacker vs Casual)
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const {
    windows, activeWindowId, openApp, closeWindow, toggleMinimize, toggleMaximize,
    focusWindow, moveWindow, resizeWindow, snapWindow, snapAssistState,
    setSnapAssistState, showLimitWarning, setShowLimitWarning
  } = useWindowManager();

  const getDesktopIcons = () => {
    if (!account) return [];
    if (account.accountType === AccountType.ADMINISTRATOR) return ADMIN_DESKTOP_ICONS;
    if (account.accountType === AccountType.RECRUITER) return RECRUITER_DESKTOP_ICONS;
    return GUEST_DESKTOP_ICONS;
  };

  const getPinnedApps = () => {
    if (!account) return [];
    if (account.accountType === AccountType.ADMINISTRATOR) return ADMIN_PINNED_APPS;
    if (account.accountType === AccountType.RECRUITER) return RECRUITER_PINNED_APPS;
    return GUEST_PINNED_APPS;
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        e.preventDefault();
        setIsStartMenuOpen(prev => !prev);
        announce(isStartMenuOpen ? "Start menu closed" : "Start menu open");
        return;
      }
      if (e.key === 'Escape') {
        if (contextMenu) setContextMenu(null);
        else if (isStartMenuOpen) setIsStartMenuOpen(false);
        else if (selectedIcon) setSelectedIcon(null);
        else if (showShortcuts) setShowShortcuts(false);
        return;
      }
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isStartMenuOpen, contextMenu, selectedIcon, showShortcuts]);

  useEffect(() => {
    if (bootStage === BootStage.DESKTOP) {
      if (account?.accountType === AccountType.GUEST) setShowWelcomeChoice(true);
      else if (account?.accountType === AccountType.ADMINISTRATOR) setShowAdminWelcome(true);
      else if (account?.accountType === AccountType.RECRUITER) setShowRecruiterWelcome(true);
    }
  }, [bootStage, account]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.desktop) {
      setSelectedIcon(null);
      setContextMenu(null);
      setIsStartMenuOpen(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      { label: 'Refresh System', icon: <RefreshCw />, action: () => window.location.reload() },
      { label: 'Change Background', icon: <WallIcon />, action: () => openApp(AppId.FILE_MANAGER) },
      { type: 'separator' },
      { label: 'System Info', icon: <Info />, action: () => openApp(AppId.SYS_MONITOR) },
    ];
    setContextMenu({ x: e.clientX, y: e.clientY, items });
  };

  const handleIconContextMenu = (e: React.MouseEvent | React.TouchEvent, id: AppId) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      { label: 'Open', icon: <Maximize />, action: () => openApp(id) },
      { label: 'Copy Path', icon: <Copy />, action: () => addNotification(`Path: /bin/${id}`, 'info') },
    ];
    let clientX = 0;
    let clientY = 0;
    if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    } else {
      const touchEvent = e as React.TouchEvent;
      if (touchEvent.touches && touchEvent.touches[0]) {
        clientX = touchEvent.touches[0].clientX;
        clientY = touchEvent.touches[0].clientY;
      }
    }
    setContextMenu({ x: clientX, y: clientY, items });
  };

  const wallpaper = WALLPAPERS.find(w => w.id === (isLightMode ? 'wp1' : 'wp4')) || WALLPAPERS[0];

  return (
    <div
      className="h-full w-full relative overflow-hidden bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${wallpaper.url})` }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      data-desktop="true"
    >
      {/* Live Region for Screen Readers */}
      <LiveRegion />

      {/* Narrative Overlay HUD - Only visible in Hacker Mode (hard difficulty) */}
      {account?.accountType === AccountType.GUEST && difficulty === 'hard' && <NarrativeHUD />}

      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 pb-24 md:p-8 flex flex-col flex-wrap content-start gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2 overflow-y-auto md:overflow-hidden no-scrollbar" data-desktop="true">
        {getDesktopIcons().map(id => (
          <div key={id} className="pointer-events-auto">
            <DesktopIcon
              ref={(el) => { iconRefs.current[id] = el; }}
              id={id}
              config={APP_CONFIGS_META[id]}
              isSelected={selectedIcon === id}
              onSelect={() => setSelectedIcon(id)}
              onOpen={() => openApp(id)}
              onContextMenu={handleIconContextMenu}
            />
          </div>
        ))}
      </div>

      {/* Windows Rendering with Suspense Skeletons */}
      {windows.map(win => (
        <WindowFrame
          key={win.id}
          windowState={win}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => toggleMinimize(win.id)}
          onMaximize={() => toggleMaximize(win.id)}
          onFocus={() => focusWindow(win.id)}
          onMove={(x, y) => moveWindow(win.id, x, y)}
          onResize={(w, h) => resizeWindow(win.id, w, h)}
          onSnap={(side) => snapWindow(win.id, side!)}
        >
          <Suspense fallback={win.id === AppId.TERMINAL ? <TerminalSkeleton /> : <AppSkeleton />}>
            {win.id === AppId.TERMINAL && <Terminal />}
            {win.id === AppId.BURP && <BurpSuite />}
            {win.id === AppId.WIRESHARK && <Wireshark />}
            {win.id === AppId.README && <Readme onOpenApp={openApp} />}
            {win.id === AppId.ABOUT && <AboutMe initialTab={win.props?.initialTab} onOpenApp={openApp} />}
            {win.id === AppId.RESUME && <ResumeViewer />}
            {win.id === AppId.PROJECTS && <AboutMe initialTab="repositories" onOpenApp={openApp} />}
            {win.id === AppId.CONTACT && <ContactMe />}
            {win.id === AppId.LEARNING && <Learning initialTab={win.props?.initialTab} />}
            {win.id === AppId.CTF && <CTFChallenges />}
            {win.id === AppId.HOME_LAB && <HomeLab />}
            {win.id === AppId.BLOG && <Blog />}
            {win.id === AppId.SYS_MONITOR && <SystemMonitor />}
            {win.id === AppId.QUESTS && <QuestLog />}
            {win.id === AppId.FILE_MANAGER && <FileManager />}
            {win.id === AppId.TOOLS && <ToolsInventory />}
            {win.id === AppId.CAREER && <CareerGoals />}
            {win.id === AppId.PORTFOLIO_META && <PortfolioMeta />}
            {win.id === AppId.HIRE_ME && <HireMe />}
            {win.id === AppId.SYSTEM_LOGS && <SystemLogs setContextMenu={setContextMenu} />}
            {win.id === AppId.DEV_NOTES && <DevNotes />}
            {win.id === AppId.SOURCE_VIEWER && <SourceViewer />}
            {win.id === AppId.NMAP && <NmapGUI />}
          </Suspense>
        </WindowFrame>
      ))}

      {/* Snap Assist Feature */}
      {snapAssistState && (
        <SnapAssist
          side={snapAssistState.side}
          windows={windows}
          activeWindowId={activeWindowId}
          onSelect={(id) => {
            snapWindow(id, snapAssistState.side);
            setSnapAssistState(null);
          }}
          onCancel={() => setSnapAssistState(null)}
        />
      )}

      {/* Primary Navigation */}
      <Taskbar
        openApps={windows.map(w => w.id)}
        pinnedApps={getPinnedApps()}
        activeApp={activeWindowId}
        onAppClick={(id) => openApp(id)}
        onStartClick={(e) => {
          e.stopPropagation();
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
      />

      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} onAppClick={(id) => openApp(id)} />

      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />
      )}

      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      {showWelcomeChoice && <WelcomeModal onClose={() => setShowWelcomeChoice(false)} />}
      <ResourceLimitModal isOpen={showLimitWarning} onClose={() => setShowLimitWarning(false)} />
      <LevelUpModal />
      <AdminWelcomeModal isOpen={showAdminWelcome} onClose={() => setShowAdminWelcome(false)} />
      {showRecruiterWelcome && <DesktopWelcome onClose={() => setShowRecruiterWelcome(false)} />}
    </div>
  );
};

const MainContent: React.FC = () => {
  const [bootStage, setBootStage] = useState<BootStage>(BootStage.BIOS_POST);
  const [isRecruiterSafeMode, setIsRecruiterSafeMode] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && bootStage === BootStage.DESKTOP) {
      setBootStage(BootStage.LOGIN);
    }
  }, [isAuthenticated, bootStage]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black select-none">
      {bootStage !== BootStage.DESKTOP ? (
        <>
          {bootStage !== BootStage.LOGIN && (
            <BootSequence
              onComplete={() => setBootStage(BootStage.LOGIN)}
              onSafeModeSelect={() => {
                setIsRecruiterSafeMode(true);
                setBootStage(BootStage.LOGIN);
              }}
            />
          )}
          {bootStage === BootStage.LOGIN && (
            <LoginScreen
              onLoginSuccess={() => setBootStage(BootStage.DESKTOP)}
              isRecruiterSafeMode={isRecruiterSafeMode}
            />
          )}
        </>
      ) : (
        <DesktopEnvironment
          bootStage={bootStage}
          setBootStage={setBootStage}
          isRecruiterSafeMode={isRecruiterSafeMode}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary appName="Portfolio Root">
      <SoundProvider>
        <ToastProvider>
          <AuthProvider>
            <ChallengeProvider>
              <FileSystemProvider>
                <ThemeProvider>
                  <QuestProvider>
                    <NarrativeProvider>
                      <MainContent />
                    </NarrativeProvider>
                  </QuestProvider>
                </ThemeProvider>
              </FileSystemProvider>
            </ChallengeProvider>
          </AuthProvider>
        </ToastProvider>
      </SoundProvider>
    </ErrorBoundary>
  );
};

export default App;

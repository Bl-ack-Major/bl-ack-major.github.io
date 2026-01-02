import React, { useState, useEffect, useRef } from 'react';
import { SOUND_KEYS, GRUB_OPTIONS } from '../constants';
import { BootStage } from '../types';
import { useSound } from '../contexts/SoundContext';
import { Settings, Activity, Shield, Cpu as CpuIcon, Zap, ChevronRight, ArrowLeft, AlertTriangle, Power } from 'lucide-react';

interface BootSequenceProps {
    onComplete: () => void;
    onSafeModeSelect?: () => void;
}

// --- UEFI/BIOS Simulation Component ---
const UEFISetupUI: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Main');
    const tabs = ['Main', 'Advanced', 'Security', 'Boot', 'Exit'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Advanced':
                return (
                    <div className="p-6 text-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Advanced Settings</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center"><span>CPU Configuration</span> <span className="text-blue-400 font-mono">&gt;</span></div>
                            <div className="flex justify-between items-center"><span>SATA Configuration</span> <span className="text-blue-400 font-mono">&gt;</span></div>
                            <div className="flex justify-between items-center"><span>USB Configuration</span> <span className="text-blue-400 font-mono">&gt;</span></div>
                            <div className="flex justify-between items-center text-gray-500"><span>Onboard Devices</span> <span className="font-mono">&gt;</span></div>
                            <div className="flex justify-between items-center text-gray-500"><span>Virtualization Tech</span> <span className="text-blue-400 font-mono">[Enabled]</span></div>
                        </div>
                    </div>
                );
            case 'Security':
                return (
                    <div className="p-6 text-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Security</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center"><span>Admin Password</span> <span className="text-gray-500 font-mono">[Not Set]</span></div>
                            <div className="flex justify-between items-center"><span>Secure Boot</span> <span className="text-blue-400 font-mono">[Enabled]</span></div>
                            <div className="flex justify-between items-center"><span>TPM 2.0 Device</span> <span className="text-blue-400 font-mono">[Active]</span></div>
                        </div>
                    </div>
                );
            case 'Boot':
                return (
                    <div className="p-6 text-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Boot Priority</h3>
                        <div className="space-y-2 font-mono">
                            <div className="bg-blue-600/20 border border-blue-500 p-2 rounded">1. UEFI OS (NVMe: KALI_OS_DRV)</div>
                            <div className="bg-white/5 p-2 rounded">2. USB Device</div>
                            <div className="bg-white/5 p-2 rounded">3. PXE Network Boot</div>
                        </div>
                    </div>
                );
            case 'Exit':
                return (
                    <div className="p-6 text-sm text-center">
                        <h3 className="text-lg font-bold text-white mb-8">Exit Options</h3>
                        <div className="space-y-3 max-w-sm mx-auto">
                            <button className="w-full text-left p-3 bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500 rounded transition-colors">Save Changes & Reboot</button>
                            <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded transition-colors">Discard Changes & Reboot</button>
                            <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded transition-colors">Load UEFI Defaults</button>
                        </div>
                    </div>
                );
            default: // Main
                return (
                    <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div>
                            <h3 className="text-base font-bold text-blue-400 mb-2">BIOS Version</h3>
                            <p>KLI-OS-2025.v1.2a (Latest)</p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-blue-400 mb-2">Build Date</h3>
                            <p>01/01/2025</p>
                        </div>
                        <div className="col-span-2 border-t border-white/10 pt-4">
                            <h3 className="text-base font-bold text-blue-400 mb-2">Processor Info</h3>
                            <p>Virtual CPU @ 4.20GHz (4 Cores)</p>
                            <p className="text-gray-500 text-xs">VT-x/AMD-V: Supported, Active</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-base font-bold text-blue-400 mb-2">Memory Info</h3>
                            <p>32768 MB (DDR5 6000MHz)</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-screen bg-[#1a1c23] text-gray-300 font-sans p-4 md:p-6 flex flex-col gap-4 select-none overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                    <Settings className="text-blue-400" size={24} />
                    <h1 className="text-lg font-bold uppercase tracking-widest">UEFI BIOS UTILITY</h1>
                </div>
                <div className="text-xs font-mono text-gray-500">
                    <span className="text-white">v2025.1.2a</span> // Advanced Mode
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-48 flex flex-col gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left font-bold text-sm px-4 py-3 rounded-lg transition-all duration-200 border-l-4 ${activeTab === tab ? 'bg-blue-600/20 text-white border-blue-500' : 'bg-transparent text-gray-500 hover:bg-white/5 border-transparent'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 bg-black/20 border border-white/5 rounded-lg overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </div>

            <div className="text-center text-[10px] opacity-40 uppercase tracking-widest mt-2">
                [ESC] TO DISCARD CHANGES AND REBOOT
            </div>
        </div>
    );
};

// --- Memory Diagnostic Simulation ---
const MemTestUI: React.FC = () => {
    const [progress, setProgress] = useState({ pass: 0, test: 0, testNum: 1 });
    const [elapsed, setElapsed] = useState(0);
    const [pattern, setPattern] = useState('00000000');

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(prev => prev + 1);
            setProgress(prev => {
                let newTest = prev.test + (Math.random() * 4 + 1);
                let newPass = prev.pass;
                let newTestNum = prev.testNum;
                if (newTest >= 100) {
                    newTest = 0;
                    newTestNum++;
                }
                if (newTestNum > 8) {
                    newTestNum = 1;
                    newPass++;
                }
                return { pass: newPass % 100, test: newTest, testNum: newTestNum };
            });
            setPattern(Math.random().toString(16).substring(2, 10).toUpperCase());
        }, 200);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="h-screen w-screen bg-[#0000AA] text-white font-mono p-2 flex flex-col text-sm select-none overflow-hidden">
            <div className="bg-[#BDBDBD] text-black text-center font-bold">
                MemTest86+ v6.20 (Portfolio Edition)
            </div>

            <div className="flex justify-between mt-1">
                <span>CPU: Virtual CPU @ 4.2GHz</span>
                <span>RAM: 6000MHz</span>
                <span>L1 Cache: 32K</span>
            </div>
            <div className="flex justify-between">
                <span>L2 Cache: 256K</span>
                <span>L3 Cache: 8192K</span>
            </div>
            <div className="border-t-2 border-b-2 border-white my-1 py-0.5 flex justify-between">
                <span>RAM: 32768M (32GB)</span>
                <span>Chipset: Virtual (VT-x)</span>
            </div>

            <div className="flex flex-1 mt-1">
                <div className="w-1/2 pr-2">
                    <div className="flex justify-between">
                        <span>Time: {formatTime(elapsed)}</span>
                        <span>Pass: {Math.floor(progress.pass)}%</span>
                        <span>Test: {Math.floor(progress.test)}%</span>
                    </div>
                    <div className="bg-black h-4 w-full mt-1 border-2 border-white p-0.5">
                        <div className="bg-[#00AA00] h-full" style={{ width: `${progress.pass}%` }}></div>
                    </div>
                    <div className="bg-black h-4 w-full mt-1 border-2 border-white p-0.5">
                        <div className="bg-[#00AA00] h-full" style={{ width: `${progress.test}%` }}></div>
                    </div>

                    <div className="mt-2 text-center">
                        Test #{progress.testNum} [{Math.random() > 0.5 ? 'Moving Inversions' : 'Random Data'}]
                    </div>
                </div>
                <div className="w-1/2 pl-2 border-l-2 border-white">
                    <div>Test Addr: 0x{Math.floor(Math.random() * 0xFFFFFFF).toString(16).toUpperCase()}</div>
                    <div className="mt-1">
                        <p>Pattern: {pattern}</p>
                        <p>Testing: 16K - 32768M</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#BDBDBD] text-black text-center mt-auto">
                Press [ESC] to exit
            </div>
        </div>
    );
};
// --- Background Kernel Logs Component ---
const BackgroundKernelLogs: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const technicalTerms = [
            '[ OK ] Reached target multi-user.target',
            '[ INFO ] Initializing Cryptographic layers...',
            '[ OK ] Found device KALI_OS_DRV',
            '[ WARN ] USB 3.0 controller standby',
            '[ OK ] Mounting /dev/nvme0n1p2 on /',
            '[ INFO ] Loading kernel module: nft_rect',
            '[ OK ] Setting up network interface: eth0',
            '[ INFO ] Starting OpenSSH server daemon...',
            '[ OK ] Target Graphic Interface reached',
            '[ INFO ] Synchronizing time via NTP...',
            '[ OK ] Active: systemd-journal-flush.service',
            '[ INFO ] Entropy source: RND_CORE_V1',
            '[ OK ] Reached target Host and Network Name Lookups',
            '[ INFO ] Starting Kali Security Module...',
        ];

        const interval = setInterval(() => {
            setLogs(prev => {
                const nextLogs = [...prev, technicalTerms[Math.floor(Math.random() * technicalTerms.length)]];
                return nextLogs.slice(-6); // Keep few logs to not clutter
            });
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-10 left-0 right-0 z-0 flex flex-col items-center gap-1 font-mono text-[10px] text-[#9fe8ff] opacity-40 pointer-events-none select-none">
            {logs.map((log, i) => (
                <div key={i} className="whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-300">
                    {log}
                </div>
            ))}
        </div>
    );
};

// --- Kali 2025 Splash Animation Component ---
const KaliSplashAnimation: React.FC<{ progress: number }> = ({ progress }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);
    const [animationPhase, setAnimationPhase] = useState<'reveal' | 'idle'>('reveal');

    // Calculate path length for stroke animation
    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    // Transition to idle phase after reveal completes
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationPhase('idle');
        }, 2200); // Match reveal duration
        return () => clearTimeout(timer);
    }, []);

    // Dragon path data
    const dragonPath = "M12.778 5.943s-1.97-.13-5.327.92c-3.42 1.07-5.36 2.587-5.36 2.587s5.098-2.847 10.852-3.008zm7.351 3.095.257-.017s-1.468-1.78-4.278-2.648c1.58.642 2.954 1.493 4.021 2.665zm.42.74c.039-.068.166.217.263.337.004.024.01.039-.045.027-.005-.025-.013-.032-.013-.032s-.135-.08-.177-.137c-.041-.057-.049-.157-.028-.195zm3.448 8.479s.312-3.578-5.31-4.403a18.277 18.277 0 0 0-2.524-.187c-4.506.06-4.67-5.197-1.275-5.462 1.407-.116 3.087.643 4.73 1.408-.007.204.002.385.136.552.134.168.648.35.813.445.164.094.691.43 1.014.85.07-.131.654-.512.654-.512s-.14.003-.465-.119c-.326-.122-.713-.49-.722-.511-.01-.022-.015-.055.06-.07.059-.049-.072-.207-.13-.265-.058-.058-.445-.716-.454-.73-.009-.016-.012-.031-.04-.05-.085-.027-.46.04-.46.04s-.575-.283-.774-.893c.003.107-.099.224 0 .469-.3-.127-.558-.344-.762-.88-.12.305 0 .499 0 .499s-.707-.198-.82-.85c-.124.293 0 .469 0 .469s-1.153-.602-3.069-.61c-1.283-.118-1.55-2.374-1.43-2.754 0 0-1.85-.975-5.493-1.406-3.642-.43-6.628-.065-6.628-.065s6.45-.31 11.617 1.783c.176.785.704 2.094.989 2.723-.815.563-1.733 1.092-1.876 2.97-.143 1.878 1.472 3.53 3.474 3.58 1.9.102 3.214.116 4.806.942 1.52.84 2.766 3.4 2.89 5.703.132-1.709-.509-5.383-3.5-6.498 4.181.732 4.549 3.832 4.549 3.832zM12.68 5.663l-.15-.485s-2.484-.441-5.822-.204C3.37 5.211 0 6.38 0 6.38s6.896-1.735 12.68-.717z";

    // Generate particles with consistent positions
    const particles = useRef(
        Array.from({ length: 50 }).map(() => ({
            size: Math.random() * 3 + 1,
            left: Math.random() * 100,
            top: Math.random() * 120 + 10, // Start below screen and move up
            duration: Math.random() * 15 + 20,
            delay: Math.random() * 10,
            opacity: Math.random() * 0.06 + 0.02
        }))
    ).current;

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">

            {/* 1. Base Blue Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #0f4f9b 0%, #133d7a 50%, #0f3566 100%)'
                }}
            />

            {/* 2. 3D Geometric Faceted Pattern (Shallow Cubes) */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `
                        linear-gradient(30deg, #1a5fad 12%, transparent 12.5%, transparent 87%, #1a5fad 87.5%, #1a5fad),
                        linear-gradient(150deg, #1a5fad 12%, transparent 12.5%, transparent 87%, #1a5fad 87.5%, #1a5fad),
                        linear-gradient(30deg, #1a5fad 12%, transparent 12.5%, transparent 87%, #1a5fad 87.5%, #1a5fad),
                        linear-gradient(150deg, #1a5fad 12%, transparent 12.5%, transparent 87%, #1a5fad 87.5%, #1a5fad),
                        linear-gradient(60deg, #0d3a6d 25%, transparent 25.5%, transparent 75%, #0d3a6d 75%, #0d3a6d),
                        linear-gradient(60deg, #0d3a6d 25%, transparent 25.5%, transparent 75%, #0d3a6d 75%, #0d3a6d)
                    `,
                    backgroundSize: '80px 140px',
                    backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
                    filter: 'blur(6px)'
                }}
            />

            {/* 3. Radial Vignette (centered slightly above logo) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.5) 100%)'
                }}
            />

            {/* 4. Soft Spotlight Sweep */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ opacity: 0.06 }}
            >
                <div
                    className="absolute w-[200%] h-[400%] -top-[150%]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 55%, transparent 100%)',
                        animation: 'spotlightSweep 3s ease-out forwards'
                    }}
                />
            </div>

            {/* 5. Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: p.size + 'px',
                            height: p.size + 'px',
                            left: p.left + '%',
                            top: p.top + '%',
                            background: 'radial-gradient(circle, rgba(159,232,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                            filter: 'blur(1px)',
                            opacity: p.opacity,
                            animation: `particleDrift ${p.duration}s linear infinite`,
                            animationDelay: `-${p.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* 6. Main Dragon Logo Container */}
            <div className="relative z-10 w-[280px] h-[280px] md:w-[380px] md:h-[380px] mb-8">

                {/* Ambient Bloom Behind Logo */}
                <div
                    className="absolute inset-[-50%] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(15,79,155,0.4) 0%, transparent 60%)',
                        filter: 'blur(40px)',
                        animation: animationPhase === 'idle' ? 'ambientPulse 3s ease-in-out infinite' : 'none',
                        opacity: animationPhase === 'idle' ? 1 : 0,
                        transition: 'opacity 0.5s ease-out'
                    }}
                />

                <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full overflow-visible"
                    style={{
                        filter: 'drop-shadow(0 0 30px rgba(15, 79, 155, 0.5))'
                    }}
                >
                    <defs>
                        {/* Gaussian Blur for Glow Trail (18px equivalent) */}
                        <filter id="glowTrail" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="0.8" result="blur1" />
                            <feMerge>
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Larger Bloom Filter (40px equivalent) */}
                        <filter id="outerBloom" x="-200%" y="-200%" width="500%" height="500%">
                            <feGaussianBlur stdDeviation="2" result="blur2" />
                        </filter>

                        {/* Chromatic Aberration Effect */}
                        <filter id="chromatic" x="-10%" y="-10%" width="120%" height="120%">
                            <feOffset in="SourceGraphic" dx="0.02" dy="0" result="red" />
                            <feOffset in="SourceGraphic" dx="-0.02" dy="0" result="blue" />
                            <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOut" />
                            <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOut" />
                            <feBlend in="redOut" in2="blueOut" mode="screen" result="chromaBlend" />
                            <feBlend in="chromaBlend" in2="SourceGraphic" mode="screen" />
                        </filter>
                    </defs>

                    {/* Layer 1: Outer Bloom (40px blur, very soft) */}
                    <path
                        d={dragonPath}
                        fill="none"
                        stroke="#9fe8ff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength}
                        filter="url(#outerBloom)"
                        style={{
                            animation: 'strokeReveal 2s cubic-bezier(0.22, 0.9, 0.26, 1) 0.15s forwards',
                            opacity: 0.3,
                            mixBlendMode: 'screen'
                        }}
                    />

                    {/* Layer 2: Glow Trail (18px blur, follows stroke) */}
                    <path
                        d={dragonPath}
                        fill="none"
                        stroke="#9fe8ff"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength}
                        filter="url(#glowTrail)"
                        style={{
                            animation: `strokeReveal 2s cubic-bezier(0.22, 0.9, 0.26, 1) 0.08s forwards${animationPhase === 'idle' ? ', glowPulse 800ms ease-in-out infinite' : ''}`,
                            opacity: 0.6,
                            mixBlendMode: 'screen'
                        }}
                    />

                    {/* Layer 3: Base White Stroke (Crisp, ~3px) */}
                    <path
                        ref={pathRef}
                        d={dragonPath}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="0.15"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength}
                        style={{
                            animation: 'strokeReveal 2s cubic-bezier(0.22, 0.9, 0.26, 1) forwards'
                        }}
                    />

                    {/* Layer 4: Trailing Shimmer Effect */}
                    <path
                        d={dragonPath}
                        fill="none"
                        stroke="url(#shimmerGradient)"
                        strokeWidth="0.3"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength}
                        filter="url(#chromatic)"
                        style={{
                            animation: 'strokeReveal 2s cubic-bezier(0.22, 0.9, 0.26, 1) 0.05s forwards',
                            opacity: 0.4,
                            mixBlendMode: 'screen'
                        }}
                    />

                    {/* Shimmer Gradient Definition */}
                    <defs>
                        <linearGradient id="shimmerGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#9fe8ff" stopOpacity="1" />
                            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                            <animate attributeName="y1" values="100%;-50%" dur="2s" begin="0s" fill="freeze" />
                            <animate attributeName="y2" values="150%;0%" dur="2s" begin="0s" fill="freeze" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Micro-rotation wrapper for natural feel */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        animation: animationPhase === 'reveal' ? 'microWobble 2s ease-out forwards' : 'none'
                    }}
                />
            </div>

            {/* 7. Enhanced Loading Indicators */}
            <div className="flex gap-3 mb-6 z-10">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, #FFFFFF 0%, #9fe8ff 100%)',
                            boxShadow: '0 0 8px rgba(159,232,255,0.6)',
                            animation: 'dotPulse 1.2s ease-in-out infinite',
                            animationDelay: `${i * 0.15}s`
                        }}
                    />
                ))}
            </div>

            {/* 8. Film Grain / Noise Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
                style={{
                    opacity: 0.015,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    animation: 'filmGrain 0.5s steps(10) infinite'
                }}
            />

            {/* 9. Kernel Log Overlay */}
            <BackgroundKernelLogs />

            {/* Animation Keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes strokeReveal {
                    to { stroke-dashoffset: 0; }
                }
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes ambientPulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                
                @keyframes particleDrift {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(-120vh) translateX(-20px); }
                }
                
                @keyframes spotlightSweep {
                    0% { transform: translateX(-50%) rotate(15deg); }
                    100% { transform: translateX(100%) rotate(15deg); }
                }
                
                @keyframes dotPulse {
                    0%, 100% { transform: scale(0.8); opacity: 0.4; }
                    50% { transform: scale(1.2); opacity: 1; }
                }
                
                @keyframes microWobble {
                    0% { transform: rotate(-0.2deg); }
                    50% { transform: rotate(0.2deg); }
                    100% { transform: rotate(0deg); }
                }
                
                @keyframes filmGrain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-1%, -1%); }
                    20% { transform: translate(1%, 1%); }
                    30% { transform: translate(-1%, 1%); }
                    40% { transform: translate(1%, -1%); }
                    50% { transform: translate(-1%, 0); }
                    60% { transform: translate(1%, 0); }
                    70% { transform: translate(0, 1%); }
                    80% { transform: translate(0, -1%); }
                    90% { transform: translate(1%, 1%); }
                }
            `}} />
        </div>
    );
};

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, onSafeModeSelect }) => {
    const [stage, setStage] = useState<BootStage | 'OFF' | 'UEFI_SETUP'>('OFF');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [selectedGrubIndex, setSelectedGrubIndex] = useState(0);
    const { playSound } = useSound();

    const handlePowerOn = () => {
        setStage(BootStage.BIOS_POST);
        playSound(SOUND_KEYS.BOOT);
    };

    useEffect(() => {
        if (stage === BootStage.BIOS_POST) {
            const timer = setTimeout(() => {
                setStage(BootStage.BOOT_MENU);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && stage !== BootStage.BOOT_MENU && stage !== 'OFF' && stage !== BootStage.BIOS_POST && stage !== BootStage.SPLASH) {
                setStage(BootStage.BOOT_MENU);
                playSound(SOUND_KEYS.UI_CLICK);
                return;
            }

            if (stage === BootStage.BOOT_MENU || stage === BootStage.ADVANCED_MENU) {
                const menuLength = stage === BootStage.BOOT_MENU ? GRUB_OPTIONS.length : 3;
                if (e.key === 'ArrowUp') {
                    setSelectedGrubIndex(prev => (prev > 0 ? prev - 1 : menuLength - 1));
                    playSound(SOUND_KEYS.CLICK);
                } else if (e.key === 'ArrowDown') {
                    setSelectedGrubIndex(prev => (prev < menuLength - 1 ? prev + 1 : 0));
                    playSound(SOUND_KEYS.CLICK);
                } else if (e.key === 'Enter') {
                    playSound(SOUND_KEYS.UI_CLICK);
                    const action = stage === BootStage.BOOT_MENU ? GRUB_OPTIONS[selectedGrubIndex].action : 'boot';

                    switch (action) {
                        case 'boot': setStage(BootStage.SPLASH); break;
                        case 'advanced': setStage(BootStage.ADVANCED_MENU); setSelectedGrubIndex(0); break;
                        case 'recovery': setStage(BootStage.RECOVERY); break;
                        case 'memtest': setStage(BootStage.MEMTEST); break;
                        case 'bios': setStage('UEFI_SETUP'); break;
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stage, selectedGrubIndex, playSound]);

    useEffect(() => {
        if (stage === BootStage.SPLASH) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(onComplete, 1200);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50); // Slightly faster to match 2.2s reveal
            return () => clearInterval(interval);
        }
    }, [stage, onComplete]);

    const AmbientBackground = () => (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0a121d] via-[#050505] to-[#000000]" />
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
    );

    if (stage === 'OFF') {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center relative overflow-hidden">
                <button
                    onClick={handlePowerOn}
                    className="group relative z-10 flex flex-col items-center gap-6 transition-all hover:scale-105 active:scale-95"
                >
                    <div className="absolute -inset-8 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-center text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/50 group-hover:shadow-[0_0_50px_rgba(54,123,240,0.4)] transition-all duration-700">
                        <Power size={32} className="drop-shadow-lg" />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] md:text-[10px] font-mono text-gray-600 uppercase tracking-[0.8em] group-hover:text-blue-400 transition-colors">Initiate System</span>
                    </div>
                </button>
            </div>
        );
    }

    if (stage === BootStage.BIOS_POST) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center text-white font-sans relative overflow-hidden p-4">
                <AmbientBackground />
                <div className="relative z-10 text-center space-y-6 md:space-y-12 animate-in fade-in duration-1000 max-w-full">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                        {/* Rotating Diamond - Now empty of the logo to prevent logo rotation */}
                        <div className="w-36 h-36 md:w-64 md:h-64 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-3xl flex items-center justify-center rotate-45 group-hover:rotate-[225deg] transition-transform duration-1000 cursor-pointer">
                        </div>
                        {/* Static Enlarged Logo - Centered in the anchor, does not rotate */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <img
                                src="/images/icons/kali-boot-logo.svg"
                                alt="Boot"
                                className="w-32 h-32 md:w-56 md:h-56 opacity-90 transform -translate-x-6 translate-y-3"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 md:space-y-3">
                        <h1 className="text-xl md:text-4xl font-light tracking-[0.2em] md:tracking-[0.4em] uppercase">Kali Custom OS</h1>
                        <div className="h-[1px] md:h-[2px] w-24 md:w-48 mx-auto bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 md:gap-x-16 gap-y-3 md:gap-y-6 text-left max-w-lg mx-auto">
                        {[
                            { label: 'Kernel', val: '6.12.0-stable', icon: Activity },
                            { label: 'Security', val: 'Level 4 // Encrypted', icon: Shield },
                            { label: 'Core', val: 'Virtualized Engine', icon: CpuIcon },
                            { label: 'Link', val: 'Neural Interface', icon: Zap }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 md:gap-4 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                                <div className="p-1 md:p-2 rounded-lg bg-white/5 border border-white/10 shrink-0"><item.icon size={12} className="text-blue-400 md:w-4 md:h-4" /></div>
                                <div className="min-w-0">
                                    <div className="text-[7px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold truncate">{item.label}</div>
                                    <div className="text-[8px] md:text-xs font-mono text-gray-300 truncate">{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === BootStage.BOOT_MENU) {
        return (
            <div className="h-screen w-screen flex items-center justify-center font-sans relative select-none overflow-hidden p-4">
                <AmbientBackground />
                <div className="relative z-10 w-full max-w-2xl px-2 md:px-6 animate-in zoom-in-95 duration-700">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-blue-500 font-bold text-[8px] md:text-[10px] tracking-[0.6em] uppercase mb-1 md:mb-4 opacity-70">Sequence Selector</h2>
                        <div className="text-xl md:text-3xl text-white font-light tracking-[0.2em] uppercase">Kali Custom OS</div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        {GRUB_OPTIONS.map((opt, i) => {
                            const cleanLabel = (opt.label || '').replace('GNU/Linux', 'System').replace('(Hybrid-Kernel 6.12)', '').replace('(macOS-Style)', '');
                            return (
                                <div
                                    key={i}
                                    className={`
                                    group px-4 md:px-8 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-between transition-all duration-500 cursor-pointer border
                                    ${selectedGrubIndex === i
                                            ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-[0_0_40px_rgba(54,123,240,0.2)] md:translate-x-4'
                                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/5'}
                                `}
                                >
                                    <div className="flex items-center gap-3 md:gap-6">
                                        <div className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full transition-all duration-500 ${selectedGrubIndex === i ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa] scale-150' : 'bg-white/10'}`}></div>
                                        <span className={`text-[9px] md:text-sm font-medium tracking-widest uppercase ${selectedGrubIndex === i ? 'opacity-100' : 'opacity-60'}`}>{cleanLabel}</span>
                                    </div>
                                    {selectedGrubIndex === i && <ChevronRight size={12} className="text-blue-400 animate-in slide-in-from-left-4 duration-500 md:w-[18px] md:h-[18px]" />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 md:mt-12 text-center opacity-40">
                        <p className="text-[7px] md:text-[10px] text-gray-500 font-mono tracking-[0.4em] uppercase">Navigate via System Interface</p>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === BootStage.ADVANCED_MENU) {
        return (
            <div className="h-screen w-screen flex items-center justify-center font-sans relative select-none overflow-hidden p-4">
                <AmbientBackground />
                <div className="relative z-10 w-full max-w-2xl px-2 md:px-6 animate-in slide-in-from-right duration-500">
                    <div className="mb-6 md:mb-12 flex items-center gap-3 md:gap-4">
                        <button onClick={() => setStage(BootStage.BOOT_MENU)} className="p-1.5 md:p-3 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 text-blue-400 transition-colors">
                            <ArrowLeft className="w-[14px] h-[14px] md:w-[20px] md:h-[20px]" />
                        </button>
                        <div>
                            <h2 className="text-blue-500 font-bold text-[8px] md:text-[10px] tracking-[0.6em] uppercase opacity-70">Advanced Options</h2>
                            <div className="text-base md:text-xl text-white font-light tracking-[0.1em] uppercase">Select System Kernel</div>
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        {[
                            "Kali Custom OS, with Linux 6.12.0-kali-amd64",
                            "Kali Custom OS, with Linux 6.11.0-kali-amd64",
                            "Kali Custom OS, with Linux 6.12.0-kali-amd64 (recovery mode)"
                        ].map((label, i) => (
                            <div
                                key={i}
                                onClick={() => label.includes('recovery') ? setStage(BootStage.RECOVERY) : setStage(BootStage.SPLASH)}
                                className={`
                                group px-4 md:px-8 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-between transition-all duration-500 cursor-pointer border
                                ${selectedGrubIndex === i
                                        ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-[0_0_40px_rgba(54,123,240,0.2)]'
                                        : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/5'}
                            `}
                            >
                                <span className="text-[9px] md:text-xs font-mono tracking-wide truncate">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === BootStage.RECOVERY) {
        return (
            <div className="h-screen w-screen bg-black text-red-500 font-mono p-6 md:p-12 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center gap-3 md:gap-4 border-b border-red-900 pb-4 md:pb-6">
                    <AlertTriangle className="w-[32px] h-[32px] md:w-[48px] md:h-[48px]" />
                    <div>
                        <h1 className="text-base md:text-2xl font-bold uppercase tracking-tighter">System Recovery Environment</h1>
                        <p className="text-[7px] md:text-xs text-red-900">Maintenance Mode // Root Console Access</p>
                    </div>
                </div>

                <div className="flex-1 space-y-4 text-[10px] md:text-sm overflow-y-auto custom-scrollbar">
                    <div className="text-white bg-red-900/20 p-3 md:p-4 border border-red-900/50 rounded-lg">
                        <p className="font-bold mb-1 uppercase">Warning: Restricted Access</p>
                        <p className="text-[9px] md:text-xs opacity-80 leading-relaxed">
                            You are entering the system maintenance shell. This environment bypasses standard authentication for kernel-level repairs.
                            Incorrect usage may result in permanent data corruption.
                        </p>
                    </div>

                    <div className="space-y-0.5 text-[8px] md:text-xs opacity-70">
                        <div>fsck: checking partition /dev/sda1...</div>
                        <div>fsck: 100% clean (3421/98522 blocks)</div>
                        <div>mounting system filesystems... [OK]</div>
                        <div>initializing network fallback... [FAILED]</div>
                        <div>dropping to root shell...</div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-white">root@kali-recovery:~#</span>
                        <span className="w-1 md:w-2 h-3 md:h-4 bg-red-500 animate-pulse"></span>
                    </div>
                </div>

                <div className="text-[7px] md:text-[10px] text-center text-gray-700 uppercase">
                    PRESS [ESC] TO EXIT RECOVERY AND RESUME STANDARD BOOT
                </div>
            </div>
        );
    }

    if (stage === BootStage.MEMTEST) {
        return <MemTestUI />;
    }

    if (stage === 'UEFI_SETUP') {
        return <UEFISetupUI />;
    }

    if (stage === BootStage.SPLASH) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
                <KaliSplashAnimation progress={loadingProgress} />
            </div>
        );
    }

    return null;
};

export default BootSequence;
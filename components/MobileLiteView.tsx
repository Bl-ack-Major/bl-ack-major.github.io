
import React, { Suspense, lazy, useState } from 'react';
import { Loader2, Terminal, Download, Github, Linkedin, Mail, Wifi, Battery, Signal, Menu, LayoutGrid, FileText } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const ReadmeRecruiter = lazy(() => import('./apps/ReadmeRecruiter').then(module => ({ default: module.ReadmeRecruiter })));
const ContactMe = lazy(() => import('./apps/ContactMe').then(module => ({ default: module.ContactMe })));

const MobileLiteView: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [activeApp, setActiveApp] = useState<'readme' | 'contact'>('readme');

  React.useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 font-sans flex flex-col relative overflow-hidden">
        {/* Android/NetHunter Status Bar */}
        <div className="bg-black/90 text-white flex justify-between items-center px-4 py-1 text-xs z-50">
            <div className="font-bold flex items-center gap-2">
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-cyan-400 font-bold">NetHunter</span>
            </div>
            <div className="flex items-center gap-2">
                <Wifi size={14} />
                <Signal size={14} />
                <Battery size={14} />
            </div>
        </div>

        {/* NetHunter Header */}
        <div className="bg-[#111111] p-4 border-b border-cyan-900/50 shadow-lg z-40">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-900/20 rounded-full flex items-center justify-center border border-cyan-500/50">
                        <Terminal size={20} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-lg leading-none">Kali NetHunter</h1>
                        <p className="text-[10px] text-cyan-500 font-mono tracking-wider">ROOT ACCESS: GRANTED</p>
                    </div>
                </div>
                <Menu className="text-gray-400" />
            </div>
        </div>

        {/* Main Content Area - Grid Layout */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* App Icons */}
                <button 
                    onClick={() => setActiveApp('readme')}
                    className={`aspect-square bg-[#1a1a1a] rounded-xl border ${activeApp === 'readme' ? 'border-red-500/50 bg-[#222]' : 'border-gray-800'} flex flex-col items-center justify-center gap-2 hover:bg-[#222] hover:border-red-500 transition-all group`}
                >
                    <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="text-red-500" size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-300">Overview</span>
                </button>

                <button 
                    onClick={() => setActiveApp('contact')}
                    className={`aspect-square bg-[#1a1a1a] rounded-xl border ${activeApp === 'contact' ? 'border-green-500/50 bg-[#222]' : 'border-gray-800'} flex flex-col items-center justify-center gap-2 hover:bg-[#222] hover:border-green-500 transition-all group`}
                >
                    <div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="text-green-500" size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-300">Contact</span>
                </button>

                <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="aspect-square bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-[#222] hover:border-purple-500 transition-all group">
                    <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Github className="text-purple-500" size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-300">GitHub</span>
                </a>

                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="aspect-square bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-[#222] hover:border-blue-500 transition-all group">
                    <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Linkedin className="text-blue-500" size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-300">LinkedIn</span>
                </a>
            </div>

            {/* Application View Embedded */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg overflow-hidden shadow-2xl mb-20 flex flex-col h-[600px] md:h-[700px]">
                <div className="bg-[#1f1f1f] px-3 py-1 text-[10px] text-gray-400 flex justify-between items-center shrink-0">
                    <span className="font-mono">{activeApp === 'contact' ? 'secure-channel-v1' : 'candidate-overview'}</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-cyan-500" /></div>}>
                        {activeApp === 'contact' ? <ContactMe /> : <ReadmeRecruiter />}
                    </Suspense>
                </div>
            </div>
        </div>

        {/* Android Navigation Bar */}
        <div className="fixed bottom-0 w-full bg-black border-t border-gray-900 h-12 flex items-center justify-around z-50">
            <button className="p-2 text-gray-500 hover:text-white"><LayoutGrid size={20} /></button>
            <div className="w-12 h-12 rounded-full border-2 border-gray-600 mb-4 bg-[#111] flex items-center justify-center hover:border-cyan-500">
                <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
            </div>
            <button className="p-2 text-gray-500 hover:text-white"><Terminal size={20} /></button>
        </div>
    </div>
  );
};

export default MobileLiteView;

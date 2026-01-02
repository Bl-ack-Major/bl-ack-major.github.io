
import React, { useEffect } from 'react';
import { Folder, FileText, ArrowUp, Home, HardDrive, AlertTriangle, Lock } from 'lucide-react';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useQuest } from '../../contexts/QuestContext';
import { useNarrative } from '../../contexts/NarrativeContext';

const FileManager: React.FC = () => {
    const { currentPath, changeDir, readdir, resolvePath, mkdir, touch } = useFileSystem();
    const { trackEvent } = useQuest();
    const { currentChapter, discoverClue } = useNarrative();

    // Inject hidden file for Chapter 2 if not present
    useEffect(() => {
        if (currentChapter >= 2) {
             try {
                // Try to navigate to hidden folder, if error, create it
                // Note: The useFileSystem hook exposes simplified methods.
                // We'll rely on the user finding it via manual exploration if they 'mkdir' it?
                // Actually, let's just pretend the file system has it hidden.
             } catch(e) {}
        }
    }, [currentChapter]);

    const handleUp = () => {
        changeDir('..');
    };

    const handleItemClick = (name: string) => {
        try {
            changeDir(name);
        } catch (e) {
            // It's a file
            trackEvent('FILE_READ', `${currentPath}/${name}`);
            
            if (name === 'shadow_protocol.conf') {
                discoverClue('shadow_protocol.conf', 'files');
                alert("File is encrypted: synt{Vafvqre_Gvz3} (ROT13)");
            }
        }
    };

    const items = readdir(currentPath);

    // Inject the hidden file visually if in the correct chapter and folder
    // This is a "hack" to show it without complex FS persistence updates in this component
    // In a real app, we'd update the FS context directly.
    const displayItems = [...items];
    if (currentChapter >= 2 && currentPath === '/home/keamo/Documents' && !items.includes('shadow_protocol.conf')) {
        displayItems.push('shadow_protocol.conf');
    }

    return (
        <div className="h-full flex flex-col bg-[#1f2229] text-gray-200 font-sans">
            {/* Toolbar */}
            <div className="bg-[#2b2f38] p-2 border-b border-gray-700 flex items-center gap-2">
                <button 
                    onClick={handleUp} 
                    className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                    disabled={currentPath === '/'}
                >
                    <ArrowUp size={16} />
                </button>
                <div className="flex-1 bg-[#1a1c23] border border-gray-600 rounded px-3 py-1 text-sm font-mono flex items-center">
                    <span className="text-gray-500 mr-2">Location:</span>
                    {currentPath}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 bg-[#1a1c23] border-r border-gray-700 p-2 text-sm hidden md:block">
                    <div className="font-bold text-gray-500 mb-2 px-2 uppercase text-xs">Places</div>
                    <div className="space-y-0.5">
                        <div onClick={() => changeDir('/home/keamo')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer text-gray-400">
                            <Home size={16} /> Home
                        </div>
                        <div onClick={() => changeDir('/home/keamo/Desktop')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer text-gray-400">
                            <Folder size={16} /> Desktop
                        </div>
                        <div onClick={() => changeDir('/home/keamo/Documents')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer text-gray-400">
                            <Folder size={16} /> Documents
                        </div>
                        <div onClick={() => changeDir('/home/keamo/Downloads')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer text-gray-400">
                            <Folder size={16} /> Downloads
                        </div>
                         <div className="mt-4 font-bold text-gray-500 mb-2 px-2 uppercase text-xs">Devices</div>
                         <div onClick={() => changeDir('/')} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer text-gray-400">
                            <HardDrive size={16} /> File System
                        </div>
                    </div>
                </div>

                {/* File Grid */}
                <div className="flex-1 p-4 bg-[#1f2229] overflow-y-auto">
                    {displayItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <AlertTriangle size={32} className="mb-2 opacity-50"/>
                            <span className="text-sm">Empty Directory</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {displayItems.map((name, i) => {
                                const isFolder = !name.includes('.'); 
                                const isHidden = name === 'shadow_protocol.conf';
                                
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => handleItemClick(name)}
                                        className="flex flex-col items-center justify-center p-4 hover:bg-[#367BF0]/20 rounded border border-transparent hover:border-[#367BF0]/50 cursor-pointer group transition-all"
                                    >
                                        {isFolder ? (
                                            <Folder size={48} className="text-[#367BF0] mb-2 drop-shadow-lg" />
                                        ) : isHidden ? (
                                            <div className="relative">
                                                <FileText size={48} className="text-red-500 mb-2 drop-shadow-lg opacity-80" />
                                                <Lock size={16} className="absolute bottom-2 right-0 text-white bg-red-600 rounded-full p-0.5" />
                                            </div>
                                        ) : (
                                            <FileText size={48} className="text-gray-400 mb-2 drop-shadow-lg" />
                                        )}
                                        <span className={`text-xs text-center break-all font-medium group-hover:text-white ${isHidden ? 'text-red-400' : 'text-gray-300'}`}>{name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
             <div className="bg-[#2b2f38] px-3 py-1 text-xs text-gray-400 border-t border-gray-700">
                {displayItems.length} items
            </div>
        </div>
    );
};

export default FileManager;

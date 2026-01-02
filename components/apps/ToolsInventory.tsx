
import React, { useState, useMemo } from 'react';
import { Package, Search, X, ExternalLink, Cloud, Wifi, Globe, Zap, Code, Image, Brain, UserCheck } from 'lucide-react';
import { TOOLS_DATA } from '../../constants';
import { Tool } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

// Map categories to the filenames provided in the Images folder
const CATEGORY_ICON_MAP: Record<string, string> = {
    'Information Gathering': 'kali-info-gathering-trans.svg',
    'Vulnerability Analysis': 'kali-vuln-assessment-trans.svg',
    'Web Application': 'kali-web-application-trans.svg',
    'Password Attacks': 'kali-password-attacks-trans.svg',
    'Wireless': 'kali-wireless-attacks-trans.svg',
    'Exploitation': 'kali-exploitation-tools-trans.svg',
    'Post-Exploitation': 'kali-maintaining-access-trans.svg',
    'Forensics': 'kali-forensics-trans.svg',
    'Networking': 'kali-sniffing-spoofing-trans.svg',
    'Reporting': 'kali-reporting-tools-trans.svg',
    'Reverse Engineering': 'kali-reverse-engineering-trans.svg',
    'Hardware Hacking': 'kali-hardware-hacking-trans.svg',
    // Fallbacks for categories without specific Kali icons
    'Cloud Security': 'kali-tools.svg',
    'Programming': 'kali-tools.svg',
    'Soft Skills': 'kali-tools.svg',
    'AI & Automation': 'kali-tools.svg',
    'Creative Design': 'kali-tools.svg'
};

const getCategoryIconPath = (category: string) => {
    // Check specific map first
    if (CATEGORY_ICON_MAP[category]) {
        return `/images/icons/${CATEGORY_ICON_MAP[category]}`;
    }
    
    // Fallback to slugified name if user added custom icons
    const filename = category.toLowerCase()
        .replace(/ & /g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    return `/images/icons/categories/${filename}.png`;
};

const CategoryIcon: React.FC<{ category: string, className?: string }> = ({ category, className }) => {
    const [error, setError] = useState(false);

    if (error) {
        // Fallback to Lucide icons if image missing
        if (category.includes('Cloud')) return <Cloud size={18} className={className} />;
        if (category.includes('Networking')) return <Wifi size={18} className={className} />;
        if (category.includes('Web')) return <Globe size={18} className={className} />;
        if (category.includes('Exploitation')) return <Zap size={18} className={className} />;
        if (category.includes('Programming')) return <Code size={18} className={className} />;
        if (category.includes('Information')) return <Search size={18} className={className} />;
        if (category.includes('AI')) return <Brain size={18} className={className} />;
        if (category.includes('Creative')) return <Image size={18} className={className} />;
        if (category.includes('Soft')) return <UserCheck size={18} className={className} />;
        return <Package size={18} className={className} />;
    }

    return (
        <img 
            src={getCategoryIconPath(category)} 
            alt={category}
            className={`w-5 h-5 object-contain ${className}`}
            onError={() => setError(true)}
        />
    );
};

// Helper for Proficiency Colors (Badges)
const getProficiencyColor = (level: string, isLightMode: boolean) => {
    if (isLightMode) {
        switch (level) {
            case 'Expert': return 'text-purple-700 border-purple-200 bg-purple-100';
            case 'Proficient': return 'text-emerald-700 border-emerald-200 bg-emerald-100';
            case 'Comfortable': return 'text-blue-700 border-blue-200 bg-blue-100';
            case 'Familiar': return 'text-amber-700 border-amber-200 bg-amber-100';
            default: return 'text-slate-600 border-slate-200 bg-slate-100';
        }
    } else {
        switch (level) {
            case 'Expert': return 'text-purple-400 border-purple-500/30 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
            case 'Proficient': return 'text-green-400 border-green-500/30 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
            case 'Comfortable': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
            case 'Familiar': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
        }
    }
};

// Helper for Dynamic Hover Styles
const getHoverStyles = (level: string, isLightMode: boolean) => {
    if (isLightMode) {
        switch (level) {
            case 'Expert': 
                return {
                    border: 'hover:border-purple-300',
                    iconBg: 'group-hover:bg-purple-100',
                    text: 'group-hover:text-purple-700',
                    buttonBg: 'group-hover:bg-purple-100 group-hover:text-purple-600'
                };
            case 'Proficient': 
                return {
                    border: 'hover:border-emerald-300',
                    iconBg: 'group-hover:bg-emerald-100',
                    text: 'group-hover:text-emerald-700',
                    buttonBg: 'group-hover:bg-emerald-100 group-hover:text-emerald-600'
                };
            case 'Comfortable': 
                return {
                    border: 'hover:border-blue-300',
                    iconBg: 'group-hover:bg-blue-100',
                    text: 'group-hover:text-blue-700',
                    buttonBg: 'group-hover:bg-blue-100 group-hover:text-blue-600'
                };
            case 'Familiar': 
                return {
                    border: 'hover:border-amber-300',
                    iconBg: 'group-hover:bg-amber-100',
                    text: 'group-hover:text-amber-700',
                    buttonBg: 'group-hover:bg-amber-100 group-hover:text-amber-600'
                };
            default: 
                return {
                    border: 'hover:border-slate-300',
                    iconBg: 'group-hover:bg-slate-100',
                    text: 'group-hover:text-slate-700',
                    buttonBg: 'group-hover:bg-slate-100 group-hover:text-slate-600'
                };
        }
    } else {
        switch (level) {
            case 'Expert': 
                return {
                    border: 'hover:border-purple-500/50',
                    iconBg: 'group-hover:bg-purple-500/20',
                    text: 'group-hover:text-purple-400',
                    buttonBg: 'group-hover:bg-purple-500'
                };
            case 'Proficient': 
                return {
                    border: 'hover:border-green-500/50',
                    iconBg: 'group-hover:bg-green-500/20',
                    text: 'group-hover:text-green-400',
                    buttonBg: 'group-hover:bg-green-500'
                };
            case 'Comfortable': 
                return {
                    border: 'hover:border-blue-500/50',
                    iconBg: 'group-hover:bg-blue-500/20',
                    text: 'group-hover:text-blue-400',
                    buttonBg: 'group-hover:bg-blue-500'
                };
            case 'Familiar': 
                return {
                    border: 'hover:border-yellow-500/50',
                    iconBg: 'group-hover:bg-yellow-500/20',
                    text: 'group-hover:text-yellow-400',
                    buttonBg: 'group-hover:bg-yellow-500'
                };
            default: 
                return {
                    border: 'hover:border-gray-500/50',
                    iconBg: 'group-hover:bg-gray-500/20',
                    text: 'group-hover:text-gray-400',
                    buttonBg: 'group-hover:bg-gray-500'
                };
        }
    }
};

const ToolsInventory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const { isLightMode } = useTheme();

    const categories = useMemo(() => ['All', ...Array.from(new Set(TOOLS_DATA.map(t => t.category)))], []);

    const filteredTools = useMemo(() => {
        return TOOLS_DATA.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  tool.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    // Theme Variables
    const bgClass = isLightMode ? 'bg-[#f8fafc]' : 'bg-[#050505]';
    const textMain = isLightMode ? 'text-slate-900' : 'text-gray-200';
    const textSec = isLightMode ? 'text-slate-500' : 'text-gray-400';
    const cardBg = isLightMode ? 'bg-white border-slate-200 shadow-sm hover:shadow-md' : 'bg-[#1c1c1e]/60 border-white/10 hover:shadow-xl';
    const headerBg = isLightMode ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10';
    const inputBg = isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/20 border-white/10 text-gray-200';
    const pillActive = isLightMode ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-orange-500/10 border-orange-500 text-orange-400';
    const pillInactive = isLightMode ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300';

    return (
        <div className={`h-full w-full flex flex-col ${bgClass} ${textMain} font-sans relative overflow-hidden selection:bg-orange-500/30 transition-colors duration-500`}>
            {/* Chromomorphism Background */}
            {isLightMode ? (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-100/60 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                </>
            )}

            {/* Glass Header */}
            <div className={`relative z-20 backdrop-blur-xl border-b p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 shadow-lg ${headerBg}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border ${isLightMode ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-white/10 text-orange-500'}`}>
                        <Package size={24} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold tracking-tight leading-none ${textMain}`}>Tool Arsenal</h1>
                        <p className={`text-xs font-medium mt-1 ${textSec}`}>Catalog of technical competencies and frameworks.</p>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative group w-full md:w-72">
                    {!isLightMode && <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>}
                    <div className={`relative backdrop-blur-sm border rounded-xl flex items-center px-4 py-2.5 transition-colors ${inputBg} ${isLightMode ? 'focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100' : 'focus-within:border-orange-500/50'}`}>
                        <Search className={`${isLightMode ? 'text-slate-400' : 'text-gray-500'} mr-3`} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`bg-transparent border-none outline-none text-sm w-full placeholder-opacity-70 ${isLightMode ? 'placeholder-slate-400' : 'placeholder-gray-600'}`}
                        />
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className={`relative z-10 px-6 py-4 overflow-x-auto flex gap-2 no-scrollbar border-b backdrop-blur-sm shrink-0 ${isLightMode ? 'bg-slate-50/50 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap shadow-sm ${
                            selectedCategory === cat ? pillActive : pillInactive
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar z-10 relative">
                <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {filteredTools.map((tool, idx) => {
                        const hoverStyles = getHoverStyles(tool.proficiency, isLightMode);
                        return (
                            <div 
                                key={idx}
                                onClick={() => setSelectedTool(tool)}
                                className={`group relative backdrop-blur-md border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col h-full hover:-translate-y-1 ${cardBg} ${hoverStyles.border}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl transition-colors flex items-center justify-center w-10 h-10 ${isLightMode ? 'bg-slate-50 text-slate-400' : 'bg-black/30 text-gray-400'} ${hoverStyles.iconBg}`}>
                                        <CategoryIcon category={tool.category} className="" />
                                    </div>
                                    <div className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getProficiencyColor(tool.proficiency, isLightMode)}`}>
                                        {tool.proficiency}
                                    </div>
                                </div>
                                
                                <h3 className={`text-lg font-bold mb-2 transition-colors ${textMain} ${hoverStyles.text}`}>{tool.name}</h3>
                                <p className={`text-xs mb-4 line-clamp-2 leading-relaxed ${textSec}`}>{tool.description}</p>
                                
                                <div className={`mt-auto pt-4 border-t flex items-center justify-between ${isLightMode ? 'border-slate-100' : 'border-white/5'}`}>
                                    <span className={`text-xs font-mono ${textSec}`}>{tool.category}</span>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isLightMode ? 'bg-slate-100 text-slate-400' : 'bg-black/40 text-gray-500'} group-hover:text-white ${hoverStyles.buttonBg}`}>
                                        <ExternalLink size={12} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Overlay */}
            {selectedTool && (
                <div 
                    className="absolute inset-0 z-50 flex justify-end" 
                    onClick={(e) => e.target === e.currentTarget && setSelectedTool(null)}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedTool(null)} />
                    
                    <div className={`relative w-full md:w-[500px] h-full backdrop-blur-xl border-l shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col ${isLightMode ? 'bg-white/95 border-slate-200' : 'bg-[#0a0a0a]/95 border-white/10'}`}>
                        <button 
                            onClick={() => setSelectedTool(null)}
                            className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isLightMode ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${isLightMode ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                                {selectedTool.category}
                            </div>
                            <h2 className={`text-4xl font-bold mb-2 tracking-tight ${textMain}`}>{selectedTool.name}</h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className={`px-3 py-1 rounded border text-xs font-bold ${getProficiencyColor(selectedTool.proficiency, isLightMode)}`}>
                                    {selectedTool.proficiency}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            <section>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLightMode ? 'text-slate-500 border-slate-200' : 'text-gray-500 border-white/10'}`}>Description</h3>
                                <p className={`leading-relaxed text-sm p-4 rounded-xl border ${isLightMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`}>
                                    {selectedTool.description}
                                </p>
                            </section>

                            <section>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 border-b pb-2 ${isLightMode ? 'text-slate-500 border-slate-200' : 'text-gray-500 border-white/10'}`}>Use Case</h3>
                                <div className={`p-5 rounded-xl border relative overflow-hidden ${isLightMode ? 'bg-gradient-to-br from-orange-50 to-white border-orange-100' : 'bg-gradient-to-br from-white/5 to-transparent border-white/10'}`}>
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <p className={`text-sm leading-relaxed pl-2 ${isLightMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                        {selectedTool.useCase}
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className={`mt-8 pt-6 border-t ${isLightMode ? 'border-slate-200' : 'border-white/10'}`}>
                            <button className={`w-full py-3 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg ${isLightMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-gray-200'}`}>
                                View Documentation <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolsInventory;

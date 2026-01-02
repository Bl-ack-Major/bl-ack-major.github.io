
import React, { useState } from 'react';
import { 
    FolderGit2, Star, GitFork, Clock, Circle, FileText, Code, 
    BookOpen, Search, Filter, Folder, File, ChevronRight, MapPin, Globe, Lightbulb, Link as LinkIcon
} from 'lucide-react';
import { PROJECTS_DATA, SOUND_KEYS } from '../../constants';
import { Project, FileNode } from '../../types';
import { useSound } from '../../contexts/SoundContext';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { playSound } = useSound();

  const handleProjectClick = (project: Project) => {
      playSound(SOUND_KEYS.CLICK);
      setSelectedProject(project);
  };

  // Secure Search Handler to prevent XSS
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Input Validation: Strip common XSS vectors
      // This prevents injection of script tags or malicious event handlers if the value were to be dangerously rendered elsewhere
      const sanitizedValue = inputValue.replace(/[<>]/g, '');
      setSearch(sanitizedValue);
  };

  const categories = ['All', 'Academic', 'Personal', 'Lab', 'Tool', 'Professional'];
  const filteredProjects = PROJECTS_DATA.filter(p => {
      const matchesCategory = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const pinnedProjects = PROJECTS_DATA.filter(p => p.isPinned);

  // --- REPO DETAIL VIEW ---
  if (selectedProject) {
      return (
          <div className="h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans">
              {/* Repo Header */}
              <div className="bg-[#161b22] border-b border-[#30363d] p-4">
                  <div className="w-full px-4 flex items-center gap-2">
                      <BookOpen size={18} className="text-[#8b949e]" />
                      <button onClick={() => setSelectedProject(null)} className="text-[#58a6ff] hover:underline font-medium">keamo</button>
                      <span className="text-[#8b949e]">/</span>
                      <span className="font-bold text-[#58a6ff] cursor-pointer hover:underline">{selectedProject.name.split('/')[1]}</span>
                      <span className="ml-2 text-xs border border-[#30363d] rounded-full px-2 py-0.5 text-[#8b949e]">Public</span>
                  </div>
              </div>

              {/* Repo Tabs */}
              <div className="bg-[#161b22] border-b border-[#30363d] px-4">
                  <div className="w-full px-4 flex gap-6 text-sm">
                      <button className="flex items-center gap-2 py-3 border-b-2 border-[#f78166] text-[#c9d1d9] font-medium">
                          <Code size={16} /> Code
                      </button>
                      <button className="flex items-center gap-2 py-3 border-b-2 border-transparent text-[#8b949e] hover:text-[#c9d1d9]">
                          <Circle size={16} /> Issues
                      </button>
                      <button className="flex items-center gap-2 py-3 border-b-2 border-transparent text-[#8b949e] hover:text-[#c9d1d9]">
                          <GitFork size={16} /> Pull requests
                      </button>
                  </div>
              </div>

              {/* Repo Content */}
              <div className="flex-1 overflow-auto p-4 md:p-8">
                  <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Main File List & Readme */}
                      <div className="md:col-span-3 space-y-4">
                          {/* Top Bar */}
                          <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] rounded-t-md p-3 text-sm">
                               <div className="flex items-center gap-2">
                                   <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#367BF0] to-purple-600"></div>
                                   <span className="font-bold text-[#c9d1d9]">keamo</span>
                                   <span className="text-[#8b949e] truncate">{selectedProject.commits[0]?.message || "Update"}</span>
                               </div>
                               <div className="text-[#8b949e] text-xs">
                                   {selectedProject.commits[0]?.sha} • {selectedProject.commits[0]?.date}
                               </div>
                          </div>
                          
                          {/* File Tree */}
                          <div className="border-x border-b border-[#30363d] rounded-b-md bg-[#0d1117] overflow-hidden">
                              {selectedProject.files.map((file, i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 border-t border-[#30363d] hover:bg-[#161b22] cursor-pointer text-sm group">
                                      {file.type === 'folder' ? <Folder size={16} className="text-[#58a6ff]" /> : <FileText size={16} className="text-[#8b949e]" />}
                                      <span className="text-[#c9d1d9] group-hover:text-[#58a6ff] group-hover:underline">{file.name}</span>
                                      <span className="flex-1"></span>
                                      <span className="text-[#8b949e] text-xs">Updated recently</span>
                                  </div>
                              ))}
                          </div>

                          {/* Readme */}
                          <div className="border border-[#30363d] rounded-md mt-6">
                               <div className="bg-[#161b22] p-3 border-b border-[#30363d] text-sm font-bold flex items-center gap-2 sticky top-0">
                                   <ListIcon /> README.md
                               </div>
                               <div className="p-8 bg-[#0d1117] prose prose-invert prose-sm max-w-none">
                                   {/* Simple Markdown Rendering */}
                                   <h1 className="text-2xl font-bold border-b border-[#30363d] pb-2 mb-4">{selectedProject.name.split('/')[1]}</h1>
                                   <p className="text-[#c9d1d9] mb-4">{selectedProject.description}</p>
                                   <div className="whitespace-pre-wrap font-mono text-sm bg-[#161b22] p-4 rounded border border-[#30363d] text-[#c9d1d9]">
                                       {selectedProject.readme.replace(`# ${selectedProject.name.split('/')[1]}`, '')}
                                   </div>

                                   {/* What I Learned Section */}
                                   {selectedProject.whatILearned && (
                                       <div className="mt-8">
                                           <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2">
                                               <Lightbulb className="text-yellow-400" size={20} /> What I Learned
                                           </h2>
                                           <ul className="list-disc pl-5 space-y-2 text-[#c9d1d9]">
                                               {selectedProject.whatILearned.map((item, i) => (
                                                   <li key={i}>{item}</li>
                                               ))}
                                           </ul>
                                       </div>
                                   )}
                                   
                                   {/* Inspired By Section */}
                                   {selectedProject.inspiredBy && (
                                       <div className="mt-8">
                                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2">
                                               <Star className="text-purple-400" size={20} /> Inspired By
                                           </h2>
                                           <ul className="space-y-2">
                                               {selectedProject.inspiredBy.map((item, i) => (
                                                   <li key={i} className="flex items-center gap-2">
                                                       <LinkIcon size={14} className="text-[#58a6ff]" />
                                                       <a href={item.url} target="_blank" rel="noreferrer" className="text-[#58a6ff] hover:underline">
                                                           {item.text}
                                                       </a>
                                                   </li>
                                               ))}
                                           </ul>
                                       </div>
                                   )}
                               </div>
                          </div>
                      </div>

                      {/* Sidebar Info */}
                      <div className="space-y-6">
                          <div>
                              <h3 className="font-bold text-[#c9d1d9] mb-2">About</h3>
                              <p className="text-sm text-[#8b949e] mb-4">{selectedProject.description}</p>
                              <div className="space-y-2 text-sm text-[#8b949e]">
                                  <div className="flex items-center gap-2"><BookOpen size={16}/> Readme</div>
                                  <div className="flex items-center gap-2"><Star size={16}/> {selectedProject.stars} stars</div>
                                  <div className="flex items-center gap-2"><GitFork size={16}/> {selectedProject.forks} forks</div>
                              </div>
                          </div>
                          
                          <div>
                              <h3 className="font-bold text-[#c9d1d9] mb-2">Languages</h3>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="w-full h-2 rounded-full bg-[#30363d] overflow-hidden flex">
                                      <span style={{ width: '100%', backgroundColor: selectedProject.languageColor }}></span>
                                  </span>
                              </div>
                              <div className="flex gap-4 text-xs text-[#8b949e]">
                                  <span className="flex items-center gap-1">
                                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedProject.languageColor }}></span>
                                      {selectedProject.language} 100%
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- PROFILE OVERVIEW VIEW ---
  return (
    <div className="h-full flex flex-col md:flex-row bg-[#0d1117] text-[#c9d1d9] font-sans">
        {/* Left Sidebar Profile */}
        <div className="w-full md:w-80 p-6 md:border-r border-[#30363d] flex flex-col gap-4">
            <div className="relative group mx-auto md:mx-0">
                {/* Glass Avatar Construction */}
                <div className="w-64 h-64 rounded-full flex items-center justify-center relative transition-all duration-300 overflow-hidden backdrop-blur-xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    {/* Glossy Top Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none rounded-full z-20" />
                    
                    {/* Internal Bottom Shine */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent pointer-events-none rounded-b-full z-10" />

                    {/* Static Spotlight */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle 100px at 50% 30%, rgba(54, 123, 240, 0.15), transparent)`
                        }}
                    />

                    {/* Avatar Image */}
                    <div className="relative z-10 w-full h-full p-1">
                         <img 
                            src="https://ui-avatars.com/api/?name=Keamo+Sec&background=0D1117&color=367BF0&size=256" 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover shadow-inner opacity-90" 
                        />
                    </div>
                </div>
            </div>
            
            <div>
                <h1 className="text-2xl font-bold text-[#c9d1d9]">Keamo</h1>
                <h2 className="text-xl text-[#8b949e] font-light">keamo</h2>
            </div>
            
            <button className="w-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded-md font-medium text-sm hover:bg-[#30363d] transition-colors">
                Edit profile
            </button>
            
            <div className="text-sm text-[#c9d1d9]">
                Aspiring Penetration Tester & Security Researcher. Building simulated environments to break them.
            </div>
            
            <div className="space-y-1 text-sm text-[#8b949e]">
                <div className="flex items-center gap-2"><FolderGit2 size={16}/> Student / Researcher</div>
                <div className="flex items-center gap-2"><MapPin size={16}/> Cyber City</div>
                <div className="flex items-center gap-2 text-[#58a6ff] hover:underline cursor-pointer"><Globe size={16}/> portfolio.kali.dev</div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
             {/* Nav Tabs */}
             <div className="border-b border-[#30363d] mb-4 flex gap-6 text-sm overflow-x-auto">
                 <div className="flex items-center gap-2 py-2 border-b-2 border-[#f78166] font-medium text-[#c9d1d9] cursor-pointer whitespace-nowrap">
                     <BookOpen size={16} /> Overview
                 </div>
                 <div className="flex items-center gap-2 py-2 border-b-2 border-transparent text-[#8b949e] hover:text-[#c9d1d9] cursor-pointer whitespace-nowrap">
                     <FolderGit2 size={16} /> Repositories <span className="bg-[#30363d] px-1.5 rounded-full text-xs">{PROJECTS_DATA.length}</span>
                 </div>
                 <div className="flex items-center gap-2 py-2 border-b-2 border-transparent text-[#8b949e] hover:text-[#c9d1d9] cursor-pointer whitespace-nowrap">
                     <Star size={16} /> Stars
                 </div>
             </div>

             {/* Pinned Section */}
             <h3 className="text-sm font-medium mb-3 text-[#c9d1d9]">Pinned</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 {pinnedProjects.map(p => (
                     <div 
                        key={p.id} 
                        onClick={() => handleProjectClick(p)}
                        className="border border-[#30363d] rounded-md p-4 bg-[#0d1117] hover:border-[#8b949e] transition-colors cursor-pointer flex flex-col"
                     >
                         <div className="flex items-center gap-2 mb-2">
                             <BookOpen size={14} className="text-[#8b949e]" />
                             <span className="font-bold text-[#58a6ff] hover:underline">{p.name}</span>
                             <span className="ml-auto text-xs border border-[#30363d] text-[#8b949e] px-1.5 rounded-full">Public</span>
                         </div>
                         <p className="text-xs text-[#8b949e] mb-4 line-clamp-2 flex-1">{p.description}</p>
                         <div className="flex items-center gap-4 text-xs text-[#8b949e] mt-auto">
                             <div className="flex items-center gap-1">
                                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.languageColor }}></span>
                                 {p.language}
                             </div>
                             <div className="flex items-center gap-1 hover:text-[#58a6ff]"><Star size={14}/> {p.stars}</div>
                             <div className="flex items-center gap-1 hover:text-[#58a6ff]"><GitFork size={14}/> {p.forks}</div>
                         </div>
                     </div>
                 ))}
             </div>

             {/* Repo List Filter & Search */}
             <div className="flex flex-col md:flex-row gap-4 mb-4 border-b border-[#30363d] pb-4">
                 <div className="flex-1 relative">
                     <input 
                        type="text" 
                        placeholder="Find a repository..." 
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-3 pr-3 text-sm text-[#c9d1d9] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none placeholder-[#8b949e]"
                     />
                 </div>
                 <div className="flex gap-2 flex-wrap">
                     {categories.map(cat => (
                         <button 
                             key={cat}
                             onClick={() => setFilter(cat)}
                             className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                                 filter === cat 
                                    ? 'bg-[#367BF0] border-[#367BF0] text-white' 
                                    : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d]'
                             }`}
                         >
                             {cat}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Repo List */}
             <div className="space-y-4">
                 {filteredProjects.map(p => (
                     <div key={p.id} className="border-b border-[#30363d] pb-6 last:border-0 flex justify-between items-start group">
                         <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                 <h3 onClick={() => handleProjectClick(p)} className="text-[#58a6ff] font-bold text-lg hover:underline cursor-pointer">{p.name}</h3>
                                 <span className="text-xs border border-[#30363d] text-[#8b949e] px-2 py-0.5 rounded-full">Public</span>
                             </div>
                             <p className="text-[#8b949e] text-sm mb-3 w-3/4">{p.description}</p>
                             <div className="flex flex-wrap gap-4 text-xs text-[#8b949e] items-center">
                                 <div className="flex items-center gap-1">
                                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.languageColor }}></span>
                                     {p.language}
                                 </div>
                                 {p.stars > 0 && (
                                     <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                                         <Star size={14}/> {p.stars}
                                     </div>
                                 )}
                                 {p.forks > 0 && (
                                     <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                                         <GitFork size={14}/> {p.forks}
                                     </div>
                                 )}
                                 <div>Updated {p.lastUpdated}</div>
                             </div>
                         </div>
                         <div className="hidden md:flex items-center">
                             <button className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] px-3 py-1 rounded-md text-xs font-medium hover:bg-[#30363d] flex items-center gap-1">
                                 <Star size={14} /> Star
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );
};

// Helper Icon
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;

export default Projects;

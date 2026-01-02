
import React from 'react';

export enum AppId {
  TERMINAL = 'terminal',
  BURP = 'burp',
  WIRESHARK = 'wireshark',
  ABOUT = 'about',
  RESUME = 'resume',
  NMAP = 'nmap',
  PROJECTS = 'projects',
  README = 'readme',
  CONTACT = 'contact',
  LEARNING = 'learning',
  CTF = 'ctf',
  HOME_LAB = 'home_lab',
  BLOG = 'blog',
  SYS_MONITOR = 'sys_monitor',
  FILE_MANAGER = 'file_manager',
  QUESTS = 'quests',
  TOOLS = 'tools',
  CAREER = 'career',
  PORTFOLIO_META = 'portfolio_meta',
  HIRE_ME = 'hire_me',
  SYSTEM_LOGS = 'system_logs',
  DEV_NOTES = 'dev_notes',
  SOURCE_VIEWER = 'source_viewer'
}

export enum BootStage {
  BIOS_POST = 'bios_post',
  BOOT_MENU = 'boot_menu',
  ADVANCED_MENU = 'advanced_menu',
  MEMTEST = 'memtest',
  RECOVERY = 'recovery',
  KERNEL_PANIC = 'kernel_panic',
  LOADER = 'loader',
  SPLASH = 'splash',
  LOGIN = 'login',
  DESKTOP = 'desktop'
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  props?: any; // App-specific arguments
}

export interface AppMeta {
  name: string;
  icon: React.ReactNode;
  color: string;
  defaultSize?: { width: number; height: number };
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  source: string;
  message: string;
}

export interface Packet {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  hex: string;
}

export interface BurpRequest {
  id: number;
  host: string;
  method: string;
  url: string;
  status: number;
  length: number;
  mime: string;
}

export interface Notification {
  id: string;
  message: string | React.ReactNode;
  type: 'info' | 'success' | 'warning' | 'error' | 'quest';
}

export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileNode[];
}

export interface Project {
    id: string;
    name: string; // "username/repo-name"
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    lastUpdated: string;
    topics: string[];
    readme: string;
    files: FileNode[];
    commits: { message: string; date: string; sha: string }[];
    isPinned?: boolean;
    category: 'Academic' | 'Personal' | 'Lab' | 'Tool' | 'Professional';
    whatILearned?: string[];
    inspiredBy?: { text: string; url: string }[];
}

export interface TimelineEvent {
    year: string;
    title: string;
    company?: string;
    desc: string;
    icon?: 'work' | 'education' | 'milestone';
}

export interface Achievement {
    title: string;
    issuer: string;
    date: string;
    badgeUrl?: string; 
    icon?: any;
}

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  style: 'cover' | 'contain' | 'tile';
  tags: string[];
}

export interface Course {
    name: string;
    platform: string;
    completedDate?: string;
    status: 'completed' | 'in-progress' | 'planned';
    progress?: number;
    credentialId?: string;
    badge?: string;
    imageUrl?: string;
}

export interface SkillDomain {
    category: string;
    skills: { name: string; level: number; max: number }[];
}

export interface CTFPlatform {
    name: string;
    rank: string;
    score: number;
    badges: string[];
    topPercent?: number;
    badgeImageUrl?: string;
    username?: string;
    profileUrl?: string;
}

export interface CTFChallenge {
    name: string;
    platform: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
    date: string;
    category: string;
    description: string;
    writeUpLink?: string;
}

export interface CTFGoal {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Achieved';
    progress: number;
    targetValue?: string;
    currentValue?: string;
}

export interface LabNode {
    id: string;
    name: string;
    type: 'vm' | 'router' | 'switch' | 'firewall';
    os?: string;
    ip?: string;
    role: string;
    connections: string[]; // IDs of connected nodes
    x: number;
    y: number;
}

export interface WriteUpLevel {
    level: string; // "Level 0", "Level 1", etc.
    title: string;
    objective: string;
    thoughtProcess: string;
    keySteps: string[];
    evidence: string;
    learned: string;
}

export interface WriteUp {
    id: string;
    title: string;
    category: string;
    date: string;
    tags: string[];
    summary: string;
    readingTime: string;
    status: 'Completed' | 'In Progress' | 'Incomplete';
    pdfPath?: string;
    levels: WriteUpLevel[];
}

// --- QUEST SYSTEM TYPES ---

export type QuestActionType = 'TERMINAL_CMD' | 'GEMINI_ANALYZE' | 'APP_OPEN' | 'WIRESHARK_INSPECT' | 'FILE_READ' | 'CTF_PROGRESS';

export interface QuestRequirement {
    type: QuestActionType;
    target?: string; // specific command, app id, etc.
    count: number; // required count
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  requirements: QuestRequirement[];
  isCompleted: boolean;
  progress: number; // Current count
  category: 'Exploration' | 'Technical' | 'Analysis' | 'Hidden' | 'Main Story' | 'Side Op';
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    unlockLevel: number;
    type: 'wallpaper' | 'theme' | 'file' | 'badge';
    assetUrl?: string;
    isClaimed: boolean;
}

export interface Session {
  id: string;
  name: string;
  timestamp: string;
  windows: WindowState[];
  wallpaperId: string;
}

export interface AboutSection {
    title: string;
    content: string | React.ReactNode;
}

export interface Tool {
    name: string;
    category: 'Cloud Security' | 'Networking' | 'Information Gathering' | 'Vulnerability Analysis' | 'Web Application' | 'Password Attacks' | 'Wireless' | 'Exploitation' | 'Post-Exploitation' | 'Forensics' | 'Programming' | 'Soft Skills' | 'AI & Automation' | 'Creative Design';
    proficiency: 'Beginner' | 'Familiar' | 'Comfortable' | 'Proficient' | 'Expert';
    description: string;
    useCase: string;
    link?: string;
    icon?: any;
}

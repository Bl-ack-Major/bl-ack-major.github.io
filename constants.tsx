
import React from 'react';
import { Terminal, Bug, Activity, User, FileText, Radar, FolderGit2, BookOpen, Mail, Shield, Award, Cpu, Globe, Lock, Server, Package, Hash, Wifi, Search, Code, Key, Layers, FileSearch, Compass, Layout, Briefcase, Zap, Target, AlertTriangle } from 'lucide-react';
import { AppId, AppMeta, LogEntry, Packet, BurpRequest, Wallpaper, Project, TimelineEvent, Achievement, Course, CTFPlatform, LabNode, WriteUp, Quest, SkillDomain, Tool, CTFChallenge, FileNode, CTFGoal } from './types';
import { AccountType } from './auth/accountTypes';

// Re-export Sound Assets
// export const SOUND_ASSETS = {};

export const SOUND_KEYS = {
    CLICK: 'click',
    UI_CLICK: 'ui_click',
    TYPING: 'typing',
    BOOT: 'boot',
    LOGIN: 'login',
    OPEN: 'open',
    CLOSE: 'close',
    ERROR: 'error',
    AMBIENT: 'ambient'
};

export const APP_CONFIGS_META: Record<string, AppMeta> = {
    [AppId.TERMINAL]: { name: 'Terminal', icon: <Terminal />, color: 'bg-gray-900' },
    [AppId.BURP]: { name: 'Burp Suite', icon: <Bug />, color: 'bg-orange-500' },
    [AppId.WIRESHARK]: { name: 'Wireshark', icon: <Activity />, color: 'bg-blue-500' },
    [AppId.ABOUT]: { name: 'About Me', icon: <User />, color: 'bg-indigo-500' },
    [AppId.RESUME]: { name: 'Resume', icon: <FileText />, color: 'bg-red-500' },
    [AppId.NMAP]: { name: 'Zenmap', icon: <Radar />, color: 'bg-green-600' },
    [AppId.PROJECTS]: { name: 'Projects', icon: <FolderGit2 />, color: 'bg-purple-500' },
    [AppId.README]: { name: 'README.txt', icon: <FileText />, color: 'bg-gray-400' },
    [AppId.CONTACT]: { name: 'Contact Me', icon: <Mail />, color: 'bg-teal-500' },
    [AppId.LEARNING]: { name: 'Learning', icon: <BookOpen />, color: 'bg-yellow-500' },
    [AppId.CTF]: { name: 'CTF Stats', icon: <Award />, color: 'bg-green-500' },
    [AppId.HOME_LAB]: { name: 'Home Lab', icon: <Server />, color: 'bg-blue-600' },
    [AppId.BLOG]: { name: 'Write-ups', icon: <BookOpen />, color: 'bg-cyan-500', defaultSize: { width: 1000, height: 700 } },
    [AppId.QUESTS]: { name: 'Objectives', icon: <Target />, color: 'bg-red-500' },
    [AppId.FILE_MANAGER]: { name: 'Files', icon: <FolderGit2 />, color: 'bg-blue-400' },
    [AppId.SYS_MONITOR]: { name: 'System', icon: <Activity />, color: 'bg-gray-500' },
    [AppId.TOOLS]: { name: 'Packages', icon: <Package />, color: 'bg-orange-400' },
    [AppId.CAREER]: { name: 'Career Plan', icon: <Compass />, color: 'bg-pink-500' },
    [AppId.PORTFOLIO_META]: { name: 'About Portfolio', icon: <Layout />, color: 'bg-cyan-600' },
    [AppId.HIRE_ME]: { name: 'Collaborate', icon: <Briefcase />, color: 'bg-green-600' },
    [AppId.SYSTEM_LOGS]: { name: 'System Logs', icon: <FileText />, color: 'bg-gray-700' },
    [AppId.DEV_NOTES]: { name: 'Dev Notes', icon: <FileText />, color: 'bg-yellow-600' },
    [AppId.SOURCE_VIEWER]: { name: 'Source Viewer', icon: <Code />, color: 'bg-purple-600' }
};

export const USER_PROFILES = [
    { id: 'keamo', name: 'K. Motlhamme', role: 'Administrator', avatar: 'user' },
    { id: 'recruiter', name: 'Recruiter', role: 'Full Access', avatar: 'briefcase' },
    { id: 'guest', name: 'Guest', role: 'Limited Access', avatar: 'ghost' }
];

export const THEME_CONFIG = {
    [AccountType.ADMINISTRATOR]: {
        primary: '#367BF0',
        secondary: '#3b82f6',
        accent: 'blue',
        tailwindPrimary: 'text-[#367BF0]',
        tailwindBorder: 'border-[#367BF0]',
        tailwindBg: 'bg-[#367BF0]',
        tailwindHoverBg: 'hover:bg-[#367BF0]'
    },
    [AccountType.RECRUITER]: {
        primary: '#22d3ee',
        secondary: '#14b8a6',
        accent: 'cyan',
        tailwindPrimary: 'text-cyan-400',
        tailwindBorder: 'border-cyan-400',
        tailwindBg: 'bg-cyan-400',
        tailwindHoverBg: 'hover:bg-cyan-400'
    },
    [AccountType.GUEST]: {
        primary: '#60a5fa',
        secondary: '#93c5fd',
        accent: 'sky',
        tailwindPrimary: 'text-blue-400',
        tailwindBorder: 'border-blue-400',
        tailwindBg: 'bg-blue-400',
        tailwindHoverBg: 'hover:bg-blue-400'
    }
};

export const USER_THEMES: Record<string, { color: string, glow: string, spotlight: string }> = {
    keamo: {
        color: 'text-[#367BF0]',
        glow: 'shadow-blue-500/50 border-blue-400',
        spotlight: 'rgba(54, 123, 240, 0.5)'
    },
    recruiter: {
        color: 'text-cyan-400',
        glow: 'shadow-cyan-500/50 border-cyan-400',
        spotlight: 'rgba(34, 211, 238, 0.5)'
    },
    guest: {
        color: 'text-gray-400',
        glow: 'shadow-gray-500/50 border-gray-400',
        spotlight: 'rgba(156, 163, 175, 0.5)'
    }
};

export const BOOT_LOGS = [
    "[  OK  ] Finished Load Kernel Modules.",
    "[  OK  ] Started udev Coldplug all Devices.",
    "[  OK  ] Finished Create Static Device Nodes in /dev.",
    "[  OK  ] Started File System Check on /dev/sda1.",
    "[  OK  ] Mounted /boot/efi.",
    "[  OK  ] Finished Monitoring of LVM2 mirrors.",
    "[  OK  ] Reached target Local File Systems (Pre).",
    "[  OK  ] Finished Load/Save Random Seed.",
    "[  OK  ] Started PostgreSQL Database Server.",
    "[  OK  ] Started Apache2 Web Server.",
    "[  OK  ] Started OpenSSH Daemon.",
    "[  OK  ] Started Login Service.",
    "[  OK  ] Reached target Multi-User System.",
    "[  OK  ] Reached target Graphical Interface."
];

export const BIOS_SPECS = [
    "ASUS UEFI BIOS (C) 2025 Keamo KaliOS Engineering",
    "CPU: AMD Ryzen 9 7950X @ 4.5GHz",
    "MEM: 64GB DDR5 6000MHz",
    "STORAGE: NVMe Gen5 4TB Detected",
    "SECURE BOOT: ENABLED (HYBRID MODE)",
    "Initializing Hardware Abstraction Layer...",
    "Peripheral Check: USB 3.2, Thunderbolt 4 OK",
    "Network: 10Gbps Ethernet Link Up",
];

export const GRUB_OPTIONS = [
    { label: "Kali Custom OS (Kernel 6.12)", action: "boot" },
    { label: "Advanced options for Kali Custom OS", action: "advanced" },
    { label: "System Recovery", action: "recovery" },
    { label: "Memory Diagnostic Mode", action: "memtest" },
    { label: "UEFI Firmware Settings", action: "bios" }
];

// Defined Wallpapers
const DARK_MODE_WALLPAPER_URL = '/images/wallpapers/default-dark.png';
const LIGHT_MODE_WALLPAPER_URL = '/images/wallpapers/default-light.png';

export const WALLPAPERS: Wallpaper[] = [
    // wp1 = Light Mode Default
    { id: 'wp1', name: 'Corporate Clean', url: LIGHT_MODE_WALLPAPER_URL, style: 'cover', tags: ['light', 'minimal', 'corporate', 'default_light'] },
    // wp4 = Dark Mode Default
    { id: 'wp4', name: 'Corporate Clean (Dark Mode)', url: DARK_MODE_WALLPAPER_URL, style: 'cover', tags: ['dark', 'abstract', 'default_dark'] }
];

export const PROJECTS_DATA: Project[] = [
    {
        id: 'p1',
        name: 'keamo/vuln-detect-web-app',
        description: 'Vulnerability Detection Web Application - A security tool for automated vulnerability detection through URL and file analysis.',
        language: 'JavaScript',
        languageColor: '#F7DF1E',
        stars: 24,
        forks: 5,
        lastUpdated: 'In Development',
        topics: ['javascript', 'node-js', 'rest-api', 'threat-intelligence', 'security-scanner'],
        readme: `# Vulnerability Detection Web App\n\nDesigning and developing a web-based security tool for automated vulnerability detection.\n\n## Technologies\n- JavaScript, Node.js\n- REST APIs\n- Threat Intelligence Integration\n\n## Features\n- URL Analysis\n- File Hash Analysis\n- Enhanced Detection Capabilities`,
        files: [
            { name: 'app.js', type: 'file' },
            { name: 'scanners', type: 'folder' },
            { name: 'package.json', type: 'file' },
            { name: 'README.md', type: 'file' }
        ],
        commits: [{ message: "Implemented file analysis module", date: "3 days ago", sha: "c4f2a1" }],
        isPinned: true,
        category: 'Tool',
        whatILearned: [
            "Integrating third-party threat intelligence APIs (VirusTotal/OTX)",
            "Implementing secure file upload handlers in Node.js",
            "Designing RESTful architectures for real-time security scanning",
            "Managing large-scale threat datasets efficiently"
        ],
        inspiredBy: [{ text: "VirusTotal", url: "https://virustotal.com" }]
    },
    {
        id: 'p2',
        name: 'keamo/offer-check',
        description: 'OfferCheck - Job Security Verification Platform. Hackathon project addressing recruitment fraud and phishing.',
        language: 'JavaScript',
        languageColor: '#F7DF1E',
        stars: 18,
        forks: 3,
        lastUpdated: 'Nov 2025',
        topics: ['hackathon', 'anti-fraud', 'social-engineering', 'risk-scoring'],
        readme: `# OfferCheck\n\nHackathon NXT | OneConnect - November 2025\n\nA 24-hour hackathon project addressing recruitment fraud.\n\n## Key Features\n- Threat model identifying phishing patterns\n- Automated risk scoring system\n- Domain reputation checks\n- Company verification workflows`,
        files: [
            { name: 'frontend', type: 'folder' },
            { name: 'risk_engine.js', type: 'file' },
            { name: 'manifest.json', type: 'file' }
        ],
        commits: [{ message: "Final pitch deck assets", date: "Nov 2025", sha: "b2d1e9" }],
        isPinned: true,
        category: 'Professional',
        whatILearned: [
            "Developing threat models specifically for social engineering vectors",
            "Rapid prototyping of risk engines under hackathon constraints",
            "Collaborating with UI/UX designers to simplify security warnings",
            "Presenting security concepts to non-technical business stakeholders"
        ]
    },
    {
        id: 'p3',
        name: 'keamo/orange-cyber-challenge',
        description: 'Orange Cyberdefense Academy Challenge - Top 20% Finisher. 3-Day rigorous CTF assessment.',
        language: 'Mixed',
        languageColor: '#ff7900', // Orange color
        stars: 45,
        forks: 8,
        lastUpdated: 'Oct 2025',
        topics: ['ctf-writeup', 'academy', 'cryptography', 'web-security', 'logic-puzzles'],
        readme: `# Orange Cyberdefense Academy Challenge\n\n**Outcome:** Top 20% Ranking (600+ Applicants)\n**Duration:** 3 Days\n\nThis project documents my participation in the selection challenge for the Orange Cyberdefense Academy. The assessment was a high-pressure 3-day CTF designed to test aptitude in web security, cryptography, scripting, and logical problem-solving.\n\n## Challenge Overview\nI successfully navigated through 7 levels of increasing difficulty, demonstrating resilience and methodical problem-solving under time constraints.\n\n### Key Skills Demonstrated\n- **Web Security:** Bypassing client-side validation, manipulating DOM elements, and analyzing network traffic.\n- **Cryptography:** Identifying and cracking various encoding schemes (Base64, ASCII) and hashing algorithms (MD5), as well as working with AES encryption.\n- **Scripting & Automation:** Writing scripts to automate interactions with the challenge platform to beat timing gates.\n- **Forensics:** Analyzing PCAP files to extract hidden information.\n\n## Repository Contents\n- \`writeups/\`: Detailed walkthrough of Levels 0-7.\n- \`scripts/\`: Python and JS helpers used during the challenge.\n- \`evidence/\`: Screenshots and flag captures verifying my progress.`,
        files: [
            { name: 'writeups', type: 'folder' },
            { name: 'scripts', type: 'folder' },
            { name: 'notes.txt', type: 'file' },
            { name: 'Keamo_Motlhamme.pdf', type: 'file' }
        ],
        commits: [{ message: "Uploaded final progression report", date: "Oct 2025", sha: "f9a2b3" }],
        isPinned: true,
        category: 'Academic',
        whatILearned: [
            "Operating under extreme time pressure (3-day non-stop sprint)",
            "Developing a forensic methodology for packet analysis",
            "Reverse engineering obfuscated JavaScript logic in real-time",
            "Synthesizing multiple security disciplines to solve multi-stage puzzles"
        ]
    }
];

export const RESUME_DATA = {
    header: {
        name: "Keamo Motlhamme",
        title: "Junior Security Engineer | SOC Analyst",
        email: "keamo.motlhamme@outlook.com",
        location: "Johannesburg, Gauteng",
        website: "bl-ack-major.github.io"
    },
    summary: "A cybersecurity early-career analyst working across network security, vulnerability assessment, and defensive monitoring. I take projects from initial reconnaissance through to reporting, focusing on accuracy, process, and clear communication. I’ve delivered structured recon exercises, security documentation, and lab-based testing that blend both technical capability and disciplined methodology. Growing up fascinated by how technology shapes trust, I learned that security isn’t just about systems, it’s about people relying on those systems without thinking twice. My long-term goal is to contribute to an organization where cybersecurity enables growth rather than restricts it, building resilient environments that protect real world impact.",
    education: [
        {
            degree: "Occupational Certificate: Cybersecurity Analyst",
            school: "CTU Training Solutions | Roodepoort, Gauteng",
            year: "Nov 2024 – Present",
            details: "400 hours of work-integrated learning focused on cybersecurity risk assessment, threat detection, incident response, and security operations. Practical training in vulnerability analysis, penetration testing, intrusion detection systems (IDS), SIEM implementation, and security frameworks."
        },
        {
            degree: "Software Engineering Program",
            school: "ALX Africa | Braamfontein, Johannesburg",
            year: "April 2023",
            details: "15-month intensive program covering algorithms, data structures, databases, C programming, software development methodologies, and design patterns. Hands-on projects available on GitHub."
        },
        {
            degree: "IT Networking Certifications",
            school: "Cisco Networking Academy (Sci-Bono)",
            year: "2021 – 2022",
            details: "CCNAv7: Introduction to Networks (Letter of Merit), CCNAv7: Switching, Routing, and Wireless Essentials (Letter of Merit), IT Essentials: PC Hardware and Software (Letter of Merit), CCNAv7: Enterprise Networking, Security, and Automation, Networking Essentials."
        }
    ],
    experience: [
        {
            role: "Security Analyst Intern (Work-Integrated Learning)",
            company: "Coast IT (Pty) Ltd. | Kempton Park",
            period: "Nov 2025",
            achievements: [
                "Conducted comprehensive vulnerability assessments and penetration testing on web application platforms, mapping CVEs to installed versions and documenting security gaps.",
                "Performed network reconnaissance and enumeration using Nmap, Wireshark, and custom scripts, identifying potential attack vectors and misconfigurations across enterprise infrastructure.",
                "Executed OSINT investigations utilizing CSI Linux toolkit, compiling threat intelligence reports and tracking digital footprints while adhering to legal compliance requirements.",
                "Discovered and validated critical web application vulnerabilities, performing responsible disclosure and risk assessment to stakeholders.",
                "Developed security documentation including risk assessment reports, discovery findings, and tactical reconnaissance playbooks.",
                "Collaborated with deployment teams to ensure security controls were implemented during infrastructure changes and service configurations."
            ]
        },
        {
            role: "Cloud Security Analyst Intern (Work-Integrated Learning)",
            company: "OneConnect | Centurion",
            period: "May 2025 - Nov 2025",
            achievements: [
                "Responded to AWS security incident involving compromised access keys, conducting impact analysis and coordinating with DevOps to implement remediation measures.",
                "Automated security tasks using PowerShell scripts for AWS S3 bucket management, implementing encryption, access controls, and IAM policies following least-privilege principles.",
                "Secured Docker containerized environments by conducting security audits, reviewing user permissions, exposed ports, and privilege escalation risks.",
                "Analyzed malicious executables in isolated VM environments to understand threat behavior and develop detection signatures for security monitoring tools.",
                "Deployed and configured WordPress sites with hardened NFS file-sharing across virtualized Linux environments, troubleshooting cross-platform authentication and permission issues.",
                "Developed Standard Operating Procedure automation scripts incorporating secure credential management and encrypted credential objects."
            ]
        },
        {
            role: "IT Support (Part-Time)",
            company: "Stephina Motlhammeinc | Johannesburg",
            period: "Nov 2023 – Present",
            achievements: [
                "Diagnosed and resolved technical issues, providing user support and explaining technical concepts clearly.",
                "Collaborated with team members to implement system administration tasks on staff workstations.",
                "Ensured customer satisfaction through effective communication and timely issue resolution."
            ]
        }
    ],
    skills: {
        "Security Operations": ["Threat Detection", "Incident Response", "Vulnerability Assessment", "Penetration Testing", "Risk Assessment", "Security Monitoring", "OSINT Investigations"],
        "Technical Expertise": ["Network Security", "Cloud Security", "Web Application Security", "Malware Analysis", "Security Automation", "Log Analysis", "Forensics"],
        "Soft Skills": ["Problem-Solving", "Critical Thinking", "Technical Documentation", "Cross-Functional Collaboration", "Communication", "Time Management", "Attention to Detail", "Analytical Thinking", "Continuous Learning"]
    }
};

export const MSF_BANNER = `
      .:okOOOkdc'           'cdkOOOko:.
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.
   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:
  'OOOOOOOOOkkkkOOOOO: :OOOOOOOOOOOOOOOOOO'
  oOOOOOOOO.    .oOOOOoOOOOl.    ,OOOOOOOOo
  dOOOOOOOO.      .cOOOOOc.      ,OOOOOOOOx
  lOOOOOOOO.         ;d;         ,OOOOOOOOl
  .OOOOOOOO.         .;.         ;OOOOOOOO.
   cOOOOOOO.                     ;OOOOOOOc
    oOOOOOO.                     ;OOOOOOo
     lOOOOO.                     ;OOOOOl
      ;OOOO'                     'OOOO;
       .dOOo                     oOOd.
         ,Ok                     kO,
           .                     .
`;

export const SEARCHSPLOIT_OUTPUT = `
-------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                            |  Path
-------------------------------------------------------------------------- ---------------------------------
Apache 2.4.49 - Path Traversal & RCE                                      | multiple/webapps/50383.sh
Apache 2.4.50 - Remote Code Execution (RCE)                               | multiple/webapps/50406.py
-------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
`;

export const MOCK_BURP_HISTORY: BurpRequest[] = [
    { id: 1, host: 'vulnerable-bank.com', method: 'GET', url: '/login', status: 200, length: 3421, mime: 'HTML' },
    { id: 2, host: 'vulnerable-bank.com', method: 'POST', url: '/auth', status: 302, length: 0, mime: '-' },
    { id: 3, host: 'vulnerable-bank.com', method: 'GET', url: '/dashboard', status: 200, length: 15402, mime: 'HTML' },
    { id: 4, host: 'api.google.com', method: 'GET', url: '/analytics', status: 204, length: 0, mime: '-' },
    { id: 5, host: 'vulnerable-bank.com', method: 'GET', url: '/api/user/1', status: 200, length: 450, mime: 'JSON' },
];

export const MOCK_PACKETS: Packet[] = [
    { id: 1, time: '0.000000', source: '192.168.1.15', destination: '1.1.1.1', protocol: 'DNS', length: 74, info: 'Standard query 0x1234 A google.com', hex: '' },
    { id: 2, time: '0.045123', source: '1.1.1.1', destination: '192.168.1.15', protocol: 'DNS', length: 90, info: 'Standard query response 0x1234 A google.com A 142.250.190.46', hex: '' },
    { id: 3, time: '0.120456', source: '192.168.1.15', destination: '142.250.190.46', protocol: 'TCP', length: 66, info: '54321 > 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460', hex: '' },
    { id: 24, time: '5.234567', source: '192.168.1.15', destination: '10.0.0.5', protocol: 'HTTP', length: 418, info: 'POST /admin-login HTTP/1.1 (application/x-www-form-urlencoded)', hex: '' }
];

export const SECURITY_LOGS: LogEntry[] = [
    { id: 1, timestamp: 'Oct 27 08:41:22', level: 'WARN', source: 'sshd', message: 'Failed password for invalid user admin from 192.168.1.44 port 43211 ssh2' },
    { id: 2, timestamp: 'Oct 27 08:41:24', level: 'WARN', source: 'sshd', message: 'Failed password for invalid user root from 192.168.1.44 port 43215 ssh2' },
    { id: 3, timestamp: 'Oct 27 08:42:01', level: 'ERROR', source: 'apache2', message: 'File does not exist: /var/www/html/phpmyadmin' },
    { id: 4, timestamp: 'Oct 27 08:45:12', level: 'CRITICAL', source: 'kernel', message: 'Possible SYN flooding on port 80. Sending cookies.' }
];

export const NEOFETCH_ART = `
       _
      | |
      | |__   __ _  ___| | __
      | '_ \\ / _' |/ __| |/ /
      | | | | (_| | (__|   <
      |_| |_|\\__,_|\\___|_|\\_\\
`;

export const SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/keamo-",
    github: "https://github.com/Bl-ack-Major",
    instagram: "https://instagram.com/cephi.co",
    email: "keamo.motlhamme@outlook.com"
};

export const TIMELINE_EVENTS: TimelineEvent[] = [];
export const CERTIFICATIONS: Course[] = [
    { name: "Cisco Certified Support Technician (CCST) Networking", platform: "Cisco", status: "completed", completedDate: "Sep 2024", badge: "Certified", progress: 100 },
    { name: "Cisco Certified Support Technician (CCST) Cybersecurity", platform: "Cisco", status: "completed", completedDate: "Oct 2024", badge: "Certified", progress: 100 },
    { name: "Certified in Cybersecurity (CC)", platform: "ISC2", status: "completed", completedDate: "Nov 2024", badge: "Certified", progress: 100 },
    { name: "CompTIA PenTest+", platform: "CompTIA", status: "in-progress", completedDate: undefined, badge: "Target 2026", progress: 35 },
    { name: "Microsoft Azure Security Engineer Associate (AZ-500)", platform: "Microsoft", status: "in-progress", badge: "In Progress", progress: 25 },
    { name: "Microsoft Security Operations Analyst (SC-200)", platform: "Microsoft", status: "in-progress", badge: "In Progress", progress: 20 },
    { name: "eJPTv2", platform: "INE Security", status: "planned", badge: "Goal 2025" }
];
export const COURSES: Course[] = [
    { name: "Introduction to Cybersecurity", platform: "Cisco Networking Academy", status: "completed", completedDate: "Feb 2024", progress: 100 },
    { name: "Networking Basics", platform: "Cisco Networking Academy", status: "completed", completedDate: "Mar 2024", progress: 100 },
    { name: "Endpoint Security", platform: "Cisco Networking Academy", status: "completed", completedDate: "Apr 2024", progress: 100 },
    { name: "Cyber Threat Management", platform: "Cisco Networking Academy", status: "completed", completedDate: "May 2024", progress: 100 }
];
export const SKILLS_MATRIX: SkillDomain[] = [
    { category: "Security Operations", skills: [{ name: "Incident Response", level: 7, max: 10 }, { name: "Log Analysis", level: 8, max: 10 }, { name: "SIEM (Sentinel)", level: 6, max: 10 }] },
    { category: "Penetration Testing", skills: [{ name: "Web App (OWASP)", level: 7, max: 10 }, { name: "Network Scanning", level: 9, max: 10 }, { name: "Privilege Escalation", level: 6, max: 10 }] },
    { category: "Cloud Security", skills: [{ name: "AWS IAM", level: 7, max: 10 }, { name: "Azure Entra ID", level: 6, max: 10 }, { name: "Cloud Defense", level: 6, max: 10 }] }
];
export const CTF_STATS: CTFPlatform[] = [
    { name: "TryHackMe", rank: "Novice (Level 2)", score: 450, badges: ["OhSINT", "Webbed"], badgeImageUrl: "https://tryhackme-badges.s3.amazonaws.com/Kea.mo.png", profileUrl: "https://tryhackme-badges.s3.amazonaws.com/Kea.mo.png" },
    { name: "HackTheBox", rank: "Noob", score: 0, badges: [], profileUrl: "https://app.hackthebox.com/profile/1" }
];
export const CTF_GOALS: CTFGoal[] = [
    { id: '1', title: 'Reach Top 5% on TryHackMe', description: 'Complete advanced learning paths.', status: 'In Progress', progress: 15, currentValue: 'Newcomer', targetValue: 'Top 5%' },
    { id: '2', title: 'Root 10 HTB Machines', description: 'Focus on Linux privilege escalation.', status: 'Pending', progress: 10, currentValue: '1', targetValue: '10' }
];
export const FAVORITE_CHALLENGES: CTFChallenge[] = [
    { name: "Pickle Rick", platform: "TryHackMe", difficulty: "Easy", category: "Web / Linux", date: "Jan 2025", description: "Exploited command injection in web app." },
    { name: "Basic Pentesting", platform: "TryHackMe", difficulty: "Easy", category: "Network", date: "Dec 2024", description: "Enumeration and bruteforcing." }
];
export const WRITEUPS_DATA: WriteUp[] = [
    {
        id: 'w1', title: 'Exploiting Insecure Direct Object References (IDOR)', category: 'Articles & Reports', date: '2025-01-15', tags: ['Web', 'OWASP', 'IDOR'], summary: 'A deep dive into how IDOR vulnerabilities occur and how to remediate them.', readingTime: '5 min', status: 'Completed',
        levels: [{ level: 'Phase 1', title: 'Discovery', objective: 'Identify parameter tampering.', thoughtProcess: 'Changed ID in URL from 1 to 2.', keySteps: ['Intercept Request', 'Modify ID'], evidence: 'User 2 profile loaded.', learned: 'Always validate authorization on object access.' }]
    },
    {
        id: 'w2', title: 'Orange Cyberdefense Academy Challenge: A 3-Day Challenge', category: 'CTF Write-ups', date: '2025-10-03', tags: ['CTF', 'Orange Cyberdefense', 'Web Security', 'Cryptography', 'Academy'], summary: 'A retrospective on the vigorous 3-day technical assessment for the Orange Cyberdefense Academy 2025 cohort. Competing against 600+ applicants, I secured a top 20% placement by navigating a series of increasingly complex web, crypto, and logic puzzles.', readingTime: '15 min', status: 'Completed',
        pdfPath: 'https://drive.google.com/file/d/19G1e1bSZY-MMUD5KXFHApl80LzPZC_I-/view?usp=sharing',
        levels: [
            {
                level: "Overview",
                title: "The Objective",
                objective: "Demonstrate problem-solving and technical aptitude under strict time constraints.",
                thoughtProcess: "The challenge wasn't just about finding flags; it was about persistence. We were given 3 days to solve a multi-stage CTF that required pivoting from basic reconnaissance to advanced cryptographic analysis.",
                keySteps: ["DNS Enumeration", "Client-side Code Review", "Steganography", "Logic & Timing Attacks", "Hash Cracking"],
                evidence: "Progression to Level 8. Top 20% Rank.",
                learned: "Time management and documentation are as critical as technical skill in high-pressure assessments."
            },
            {
                level: "Level 0",
                title: "Reconnaissance (DNS)",
                objective: "Find the IP address of `secure.orangecyberdefense.academy`.",
                thoughtProcess: "The site was timing out in the browser. This suggested either a down service or a non-routable IP. DNS enumeration was the next logical step.",
                keySteps: ["Used \`nslookup\` with Google's 8.8.8.8 resolver.", " queried the authoritative nameserver.", "Discovered the A record pointed to \`127.0.0.0\` (Localhost Loopback)."],
                evidence: "A Record: 127.0.0.0",
                learned: "Always check DNS when HTTP fails. Sinkholing is a common CTF tactic."
            },
            {
                level: "Level 1 & 2",
                title: "Client-Side Bypass",
                objective: "Bypass password gates and timing restrictions.",
                thoughtProcess: "Level 1 asked for a password with no server feedback, implying client-side validation. Level 2 introduced a 5-second page reset timer to frustrate analysis.",
                keySteps: ["Level 1: Inspected inline JS to find the hardcoded password string.", "Level 2: Overrode the \`delayer()\` function in the console to stop the refresh timer.", "Decoded the Base64 variable \`YmFzZV82NF9pc19ub3RfZW5jcnlwdGlvbg==\` to get the key."],
                evidence: "Passwords found in source code.",
                learned: "Client-side controls are not security controls. Base64 is encoding, not encryption."
            },
            {
                level: "Level 3 & 4",
                title: "Obfuscation & Logic",
                objective: "Reconstruct hidden credentials from scattered data.",
                thoughtProcess: "Level 3 constructed the password dynamically using character codes and substrings. Level 4 trapped the user in an infinite alert loop ('You can't close me').",
                keySteps: ["Level 3: Used the console to reconstruct the string from \`String.fromCharCode\` and substrings.", "Level 4: Viewed page source (\`view-source:\`) to bypass the alert loop script execution.", "Identified the redirect URL in the static HTML and navigated directly to it."],
                evidence: "Password: 'The_Obstacle_istheway'. Bypassed loop.",
                learned: "Browser developer tools are essential for de-obfuscating dynamic logic."
            },
            {
                level: "Level 5",
                title: "Crypto & Puzzles",
                objective: "Decrypt AES payload using a key hidden in a Sudoku puzzle.",
                thoughtProcess: "The page presented a Sudoku grid and an AES decryption function. The key was derived from specific red cells in the grid.",
                keySteps: ["Solved the Sudoku puzzle offline.", "Extracted digits from red cells to form the key \`45716\`.", "Used \`CryptoJS\` in the console to decrypt the payload \`U2FsdGVk...\`."],
                evidence: "Decrypted Payload: 'Onto_th3_n3xtl3v3l'.",
                learned: "Combining logic puzzles with cryptography tests attention to detail."
            },
            {
                level: "Level 6",
                title: "Automated Interaction",
                objective: "Beat a precise timing attack.",
                thoughtProcess: "The challenge required retyping a long text string within a randomized time window (e.g., between 60s and 65s). Human typing is too slow or inconsistent.",
                keySteps: ["Analyzed the \`totalTypingTime\` logic in the source code.", "Identified the success condition: \`time > rndInt - 10 && time < rndInt\`.", "Simulated the timing by manipulating the \`startTime\` variable in the console before submitting."],
                evidence: "Automated submission accepted.",
                learned: "Understanding the validation logic allows for automation to bypass human constraints."
            },
            {
                level: "Level 7",
                title: "Advanced Gates & Cracking",
                objective: "Crack a hash and bypass state checks.",
                thoughtProcess: "Access was blocked by two gates: a \`localStorage\` failure count and a \`Referrer\` header check. Once passed, I had to crack an MD5 hash.",
                keySteps: ["Manually set \`localStorage.setItem('status', 5)\` to satisfy the failure gate.", "Navigated from the correct previous URL to pass the Referrer check.", "Identified the hash \`0192023a...\` as the MD5 for 'admin123'."],
                evidence: "Hash cracked: admin123.",
                learned: "State management (Cookies/Storage) and HTTP headers are trusted user inputs that can be manipulated."
            },
            {
                level: "Level 8",
                title: "The Final Boss",
                objective: "Decrypt OpenSSL AES-256 payload using combined intelligence.",
                thoughtProcess: "The final level presented a raw OpenSSL AES-256 ciphertext with no client-side validator. The hint 'Everything Matters' suggested the key was a combination of artifacts from all previous levels (IPs, passwords, hashes).",
                keySteps: ["Analyzed the provided PCAP file for hidden clues (none found).", "Collected MD5 hashes from all previous level success flags.", "Attempted to derive the key by concatenating previous answers.", "Status: Incomplete at deadline."],
                evidence: "Reached Level 8 interface.",
                learned: "The final challenge required a holistic view of the entire engagement, reinforcing the importance of meticulous note-taking."
            }
        ]
    }
];

export const QUESTS_LIST: Quest[] = [];
export const CAREER_GOALS = {
    interests: [
        { title: "Cloud Security", desc: "Securing AWS/Azure infrastructure." },
        { title: "Red Teaming", desc: "Advanced adversary simulation." },
        { title: "DevSecOps", desc: "Integrating security into CI/CD." },
        { title: "Threat Hunting", desc: "Proactive threat detection." }
    ],
    shortTerm: [
        "Microsoft Azure Security Engineer (AZ-500)",
        "CompTIA PenTest+",
        "Microsoft Security Ops Analyst (SC-200)"
    ],
    mediumTerm: [
        "CompTIA Security+",
        "CompTIA AI Security+"
    ],
    dreamProjects: ["Build a fully automated home security lab", "Speak at a security conference"]
};

export const TOOLS_DATA: Tool[] = [
    // Previous Tools
    { name: "Nmap", category: "Networking", proficiency: "Proficient", description: "Network discovery and security auditing tool used to discover hosts and services on a computer network.", useCase: "Host discovery, Port scanning, OS detection." },
    { name: "Metasploit", category: "Exploitation", proficiency: "Comfortable", description: "Penetration testing framework used to find, exploit, and validate vulnerabilities.", useCase: "Exploit development, Payload delivery, Post-exploitation." },
    { name: "Wireshark", category: "Networking", proficiency: "Comfortable", description: "Network protocol analyzer that captures and interacts with packet data.", useCase: "Network troubleshooting, Protocol analysis, Packet inspection." },
    { name: "Burp Suite", category: "Web Application", proficiency: "Familiar", description: "Integrated platform for performing security testing of web applications.", useCase: "Intercepting proxy, Fuzzing, Scanning vulnerabilities." },
    { name: "AWS", category: "Cloud Security", proficiency: "Familiar", description: "Comprehensive cloud computing platform provided by Amazon.", useCase: "IAM Configuration, Cloud Infrastructure Security, S3 Bucket Hardening." },
    { name: "Kali Linux", category: "Networking", proficiency: "Expert", description: "Debian-based Linux distribution designed for digital forensics and penetration testing.", useCase: "Daily driver for security operations, server administration." },
    { name: "SQL", category: "Programming", proficiency: "Familiar", description: "Standard language for managing data held in a relational database.", useCase: "Database queries, SQL Injection testing." },
    { name: "Bash", category: "Programming", proficiency: "Comfortable", description: "Unix shell and command language.", useCase: "System administration, Task automation, Shell scripting." },
    { name: "Hashcat", category: "Password Attacks", proficiency: "Familiar", description: "World's fastest and most advanced password recovery utility.", useCase: "Password cracking, Hash identification." },
    { name: "CyberChef", category: "Forensics", proficiency: "Familiar", description: "The Cyber Swiss Army Knife - a web app for encryption, encoding, compression and data analysis.", useCase: "Decoding payloads, Data analysis, File format conversion." },
    { name: "John the Ripper", category: "Password Attacks", proficiency: "Familiar", description: "Fast password cracker.", useCase: "Offline password cracking, unshadowing." },
    { name: "Hydra", category: "Password Attacks", proficiency: "Comfortable", description: "Parallelized login cracker.", useCase: "Online brute-force attacks against SSH, FTP, etc." },
    { name: "Aircrack-ng", category: "Wireless", proficiency: "Familiar", description: "Suite of tools to assess WiFi network security.", useCase: "Monitoring, attacking, cracking, and testing WiFi networks." },
    { name: "Netcat", category: "Networking", proficiency: "Comfortable", description: "Computer networking utility for reading from and writing to network connections.", useCase: "Banner grabbing, reverse shells, file transfer." },
    { name: "Nikto", category: "Web Application", proficiency: "Comfortable", description: "Open Source (GPL) web server scanner.", useCase: "Scanning for dangerous files/CGIs, outdated server software." },
    { name: "SQLmap", category: "Web Application", proficiency: "Familiar", description: "Open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws.", useCase: "Automated SQL injection and database takeover." },
    { name: "Gobuster", category: "Information Gathering", proficiency: "Familiar", description: "Tool used to brute-force URIs and DNS subdomains.", useCase: "Directory enumeration, discord discovery." },
    { name: "Impacket", category: "Post-Exploitation", proficiency: "Familiar", description: "Network protocol manipulation, relay attacks (NTLM).", useCase: "Interacting with Windows network protocols and performing relay attacks." },
    { name: "Nuclei", category: "Vulnerability Analysis", proficiency: "Comfortable", description: "Fast and customizable vulnerability scanner based on simple YAML based templates.", useCase: "Automated vulnerability detection, compliance checks, misconfiguration scanning." },
    { name: "OpenSSL", category: "Vulnerability Analysis", proficiency: "Familiar", description: "Robust, full-featured commercial-grade toolkit for the Transport Layer Security (TLS) and Secure Sockets Layer (SSL) protocols.", useCase: "Certificate verification, testing SSL/TLS handshakes, debugging connection issues." },
    { name: "OpenSSL", category: "Vulnerability Analysis", proficiency: "Familiar", description: "Robust, full-featured commercial-grade toolkit for the Transport Layer Security (TLS) and Secure Sockets Layer (SSL) protocols.", useCase: "Certificate verification, testing SSL/TLS handshakes, debugging connection issues." },
    { name: "Curl", category: "Web Application", proficiency: "Familiar", description: "Command-line tool for transferring data using various network protocols.", useCase: "Manual request crafting, header analysis, API interaction." },

    // AZ-500 & Cloud Specific Additions
    { name: "Microsoft Entra ID", category: "Cloud Security", proficiency: "Comfortable", description: "Cloud-based identity and access management service.", useCase: "Identity governance, MFA, SSO, Conditional Access policies." },
    { name: "Microsoft Sentinel", category: "Cloud Security", proficiency: "Proficient", description: "Scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution.", useCase: "Threat detection, visibility, incident response, hunting." },
    { name: "Microsoft Defender for Cloud", category: "Cloud Security", proficiency: "Proficient", description: "Cloud security posture management (CSPM) and cloud workload protection (CWP).", useCase: "Security recommendations, vulnerability assessment, threat protection." },
    { name: "Azure Key Vault", category: "Cloud Security", proficiency: "Comfortable", description: "Cloud service for securely storing and accessing secrets.", useCase: "Secret management, key management, certificate management." },
    { name: "Azure Policy", category: "Cloud Security", proficiency: "Comfortable", description: "Service to create, assign, and manage policies that enforce different rules over resources.", useCase: "Compliance enforcement, resource governance." },
    { name: "Azure Firewall", category: "Cloud Security", proficiency: "Comfortable", description: "Managed, cloud-based network security service that protects Azure Virtual Network resources.", useCase: "Network traffic filtering, threat intelligence-based filtering." },

    // New Additions (Kubernetes & Azure SQL)
    { name: "Kubernetes", category: "Cloud Security", proficiency: "Comfortable", description: "Open-source container orchestration system for automating software deployment, scaling, and management.", useCase: "Container orchestration, securing clusters, pod security policies." },
    { name: "Azure SQL Database", category: "Cloud Security", proficiency: "Comfortable", description: "Fully managed platform-as-a-service (PaaS) database engine that handles most of the database management functions without user involvement.", useCase: "Data discovery, classification, dynamic data masking, SQL auditing, threat detection." },

    // Automation & Scripting
    { name: "PowerShell", category: "AI & Automation", proficiency: "Comfortable", description: "Cross-platform task automation and configuration management framework.", useCase: "Azure administration, scripting security tasks, automation." },

    // Web Application Security
    { name: "WPScan", category: "Web Application", proficiency: "Comfortable", description: "WordPress security scanner.", useCase: "Detecting vulnerable themes, plugins, and core WordPress misconfigurations." },

    // Virtualization / Infrastructure
    { name: "VMware Workstation", category: "Cloud Security", proficiency: "Comfortable", description: "Hosted hypervisor that runs on x64 versions of Windows and Linux operating systems.", useCase: "Lab environment setup, malware analysis sandboxing." },
    { name: "VirtualBox", category: "Cloud Security", proficiency: "Comfortable", description: "Open source virtualization product.", useCase: "Running virtual machines, testing operating systems." },
    { name: "Windows Server", category: "Networking", proficiency: "Familiar", description: "Group of operating systems designed by Microsoft that supports enterprise-level management, data storage, applications, and communications.", useCase: "Active Directory management, IIS hosting, DNS/DHCP." },
    { name: "Active Directory", category: "Networking", proficiency: "Familiar", description: "Directory service developed by Microsoft for Windows domain networks.", useCase: "User management, Group Policy, Domain authentication." },

    // AI & Automation
    { name: "ChatGPT", category: "AI & Automation", proficiency: "Proficient", description: "Large language model for code generation, analysis, and drafting.", useCase: "Scripting assistance, report writing, log analysis explanation." },
    { name: "Claude", category: "AI & Automation", proficiency: "Proficient", description: "AI assistant with large context window.", useCase: "Analyzing large config files, code review." },
    { name: "DeepSeek", category: "AI & Automation", proficiency: "Proficient", description: "Advanced coding assistant.", useCase: "Code generation and debugging." },
    { name: "Gemini", category: "AI & Automation", proficiency: "Proficient", description: "Multimodal AI model.", useCase: "Log analysis, image analysis in security context." }
];

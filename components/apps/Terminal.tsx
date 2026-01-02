
import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../../contexts/SoundContext';
import { SOUND_KEYS, NEOFETCH_ART, MSF_BANNER, SEARCHSPLOIT_OUTPUT } from '../../constants';
import { useAuth } from '../../auth/AuthContext';
import { getAvailableCommands } from '../../auth/permissions';
import { useChallenge } from '../../contexts/ChallengeContext';
import { AccountType } from '../../auth/accountTypes';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useQuest } from '../../contexts/QuestContext';
import { askGemini } from '../../services/geminiService';
import { useTheme } from '../../contexts/ThemeContext';
import { useNarrative } from '../../contexts/NarrativeContext';

const COMMON_UNIMPLEMENTED = [
    'rm', 'vi', 'vim', 'nano',
    'chmod', 'chown', 'useradd', 'apt', 'apt-get',
    'su', 'reboot', 'shutdown', 'mv', 'cp', 'ifconfig', 'ip'
];

const Terminal: React.FC = () => {
    const [history, setHistory] = useState<string[]>(['Kali GNU/Linux Rolling', 'Type "help" for a list of commands.']);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isTopRunning, setIsTopRunning] = useState(false);
    const [isMatrixRunning, setIsMatrixRunning] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { playSound } = useSound();
    const { account } = useAuth();
    const { advanceStage, stage } = useChallenge();
    const { currentPath, changeDir, readdir, readFile, mkdir, touch } = useFileSystem();
    const { trackEvent, level } = useQuest();
    const { isLightMode } = useTheme();
    const { discoverClue } = useNarrative();

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, isTopRunning, isMatrixRunning, isProcessing]);

    useEffect(() => {
        const handleClick = () => {
            // On mobile, do not auto-focus on global clicks to prevent keyboard from popping up
            if (!isTopRunning && !isMatrixRunning && !window.getSelection()?.toString() && !isProcessing && window.innerWidth >= 768) {
                inputRef.current?.focus();
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [isTopRunning, isMatrixRunning, isProcessing]);

    useEffect(() => {
        if (!isMatrixRunning || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const columns = Math.floor(canvas.width / 20);
        const drops: number[] = new Array(columns).fill(1);
        const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF";

        const interval = setInterval(() => {
            if (isLightMode) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#059669';
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0';
            }

            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 33);

        const handleKill = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'c') {
                setIsMatrixRunning(false);
                setHistory(prev => [...prev, '^C']);
                playSound(SOUND_KEYS.CLOSE);
            }
        };
        window.addEventListener('keydown', handleKill);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('keydown', handleKill);
        };
    }, [isMatrixRunning, isLightMode, playSound]);

    const executeSingleCommand = async (cmdStr: string, inputData: string | null = null): Promise<string> => {
        // Basic sanitization
        const sanitizedCmd = cmdStr.trim().replace(/<[^>]*>/g, '');
        const parts = (sanitizedCmd || '').split(/\s+/);
        const command = (parts[0] || '').toLowerCase();
        const args = parts.slice(1);

        if (command) {
            trackEvent('TERMINAL_CMD', command);
        }

        const getTextContent = (fileArgs: string[]) => {
            if (inputData !== null) return inputData;
            if (fileArgs.length === 0) return 'Error: Missing filename or input';
            try {
                return readFile(fileArgs[0]);
            } catch (e: any) {
                return e.message;
            }
        };

        if (command.startsWith('./')) {
            const filename = command.substring(2);
            let content = "";
            try {
                content = readFile(filename) || "";
            } catch (e: any) {
                return `bash: ${filename}: No such file or directory`;
            }

            if (content.startsWith('echo ')) return content.substring(5).replace(/['"]/g, '');
            if (content.includes('console.log("')) {
                const match = content.match(/console\.log\(\s*["'](.+)["']\s*\)/);
                return match ? match[1] : "";
            }

            return `bash: ${filename}: permission denied (simulation: script not executable)`;
        }

        switch (command) {
            case 'grep':
                if (args.length === 0) return "usage: grep [pattern] [file]";
                const pattern = (args[0] || '').replace(/['"]/g, '');
                const contentToGrep = getTextContent(args.slice(1));
                if (!contentToGrep || contentToGrep.startsWith('Error') || contentToGrep.startsWith('cat:')) return contentToGrep;
                return contentToGrep.split('\n')
                    .filter(line => line && line.includes(pattern))
                    .join('\n');

            case 'cat':
                return getTextContent(args);

            case 'ls':
                try {
                    const target = args[0] || '.';
                    return readdir(target).join('  ');
                } catch (e: any) {
                    return e.message;
                }

            case 'pwd':
                return currentPath;

            case 'cd':
                if (args.length === 0) return "";
                try {
                    changeDir(args[0]);
                    return "";
                } catch (e: any) {
                    return e.message;
                }

            case 'mkdir':
                if (args.length === 0) return "mkdir: missing operand";
                try {
                    mkdir(args[0]);
                    return "";
                } catch (e: any) {
                    return e.message;
                }

            case 'touch':
                if (args.length === 0) return "touch: missing operand";
                try {
                    touch(args[0]);
                    return "";
                } catch (e: any) {
                    return e.message;
                }

            case 'whoami':
                return account?.username || 'guest';

            case 'date':
                return new Date().toString();

            case 'history':
                return commandHistory.map((cmd, idx) => `  ${idx + 1}  ${cmd}`).join('\n');

            case 'man':
                if (args.length === 0) return "What manual page do you want?";
                const cmdToMan = (args[0] || '').toLowerCase();
                switch (cmdToMan) {
                    case 'ascii':
                        return "NAME\n    ascii - convert ASCII decimal codes to characters\n\nSYNOPSIS\n    ascii [CODE1] [CODE2]...\n\nDESCRIPTION\n    Converts a sequence of decimal numbers into their corresponding ASCII characters.";
                    case 'charat':
                        return "NAME\n    charat - extract characters at specific indices from a string\n\nSYNOPSIS\n    charat \"[STRING]\" [INDEX1] [INDEX2]...\n\nDESCRIPTION\n    Extracts characters from the provided quoted string at the specified 0-based indices.";
                    case 'decode64':
                        return "NAME\n    decode64 - decode Base64 encoded strings\n\nSYNOPSIS\n    decode64 [STRING]\n\nDESCRIPTION\n    Decodes a Base64 encoded string into its original representation.";
                    case 'submit-report':
                        return "NAME\n    submit-report - Finalize the incident response campaign\n\nSYNOPSIS\n    submit-report [SUSPECT] [DESTINATION_IP]\n\nDESCRIPTION\n    Submits the final findings of the investigation to HQ.";
                    default:
                        return `No manual entry for ${cmdToMan}`;
                }

            case 'echo':
                const redirectIndex = args.indexOf('>');
                if (redirectIndex !== -1 && redirectIndex < args.length - 1) {
                    const text = args.slice(0, redirectIndex).join(' ').replace(/['"]/g, '');
                    const file = args[redirectIndex + 1];
                    try {
                        touch(file, text);
                        return "";
                    } catch (e: any) {
                        return e.message;
                    }
                }
                return args.join(' ').replace(/['"]/g, '');

            case 'node':
                if (args.length === 0) return "Welcome to Node.js v18.16.0.\nType \".help\" for more information.";
                const jsContent = getTextContent(args);
                if (!jsContent || jsContent.startsWith('Error') || jsContent.startsWith('cat:')) return `node: internal/modules/cjs/loader.js:988: throw err;`;

                const logMatch = jsContent.match(/console\.log\(\s*["'](.+)["']\s*\)/);
                if (logMatch) return logMatch[1];
                return "";

            case 'sudo':
                if (account?.accountType === AccountType.ADMINISTRATOR) {
                    if (args.length === 0) return "usage: sudo [command]";
                    return executeSingleCommand(args.join(' '), inputData);
                } else {
                    playSound(SOUND_KEYS.ERROR);
                    return `[sudo] password for ${account?.username}: \nSorry, user ${account?.username} is not allowed to execute '${args[0]}' as root on this machine.`;
                }

            case 'ascii':
                try {
                    const res = args.map(c => String.fromCharCode(parseInt(c, 10))).join('');
                    const fullArgs = args.join(' ');
                    if (fullArgs.includes('101') && fullArgs.includes('72') && fullArgs.includes('65') && fullArgs.includes('99')) {
                        advanceStage(1);
                        trackEvent('CTF_PROGRESS', 'FRAGMENT_2');
                    }
                    return `Result: ${res}`;
                } catch (e) { return 'Error: Invalid ASCII codes. Usage: ascii 65 66 67'; }

            case 'decode64':
                try {
                    const decoded = atob(args[0] || '');

                    if (decoded.trim() === 'yOuHav') {
                        advanceStage(0);
                        trackEvent('CTF_PROGRESS', 'FRAGMENT_1');
                    }

                    if (decoded.includes('admin:yOuHaveHAckedM3.EnJOY') || decoded.includes('admin:YouThoughtYouWereSmart')) {
                        advanceStage(3);
                        trackEvent('CTF_PROGRESS', 'FRAGMENT_4');
                    }

                    return `Decoded: ${decoded}`;
                } catch (e) { return 'Error: Invalid Base64 string'; }

            case 'charat':
                if (args.length < 2) return "Usage: charat \"string\" index1 index2...";
                try {
                    const fullArgs = args.join(' ');
                    const quoteMatch = fullArgs.match(/"([^"]+)"/);
                    if (!quoteMatch) return "Error: String must be in quotes.";

                    const text = quoteMatch[1];
                    const indices = fullArgs.replace(quoteMatch[0], '').trim().split(/\s+/).map(n => parseInt(n));

                    const result = indices.map(i => text[i] || '').join('');

                    if (text === "Stack code demo M3" && indices.includes(4) && indices.includes(9) && indices.includes(8) && indices.includes(16) && indices.includes(17)) {
                        advanceStage(2);
                        trackEvent('CTF_PROGRESS', 'FRAGMENT_3');
                    }
                    return `Result: ${result}`;
                } catch (e) {
                    return "Error: Could not parse arguments.";
                }

            case 'gemini':
                if (args.length === 0) return "gemini: missing prompt. Usage: gemini \"your question\"";
                const prompt = args.join(' ');
                trackEvent('TERMINAL_CMD', 'gemini');
                return await askGemini(prompt);

            case 'msfconsole':
                return MSF_BANNER + "\n[+] Metasploit Framework initialized.\n[+] Connected to database.\nmsf6 >";

            case 'searchsploit':
                if (args.length === 0) return "Usage: searchsploit [term]";
                return SEARCHSPLOIT_OUTPUT;

            case 'john':
                if (args.length === 0) return "Usage: john [password_file]";
                return "Loaded 1 password hash (md5crypt [MD5 32/64])\nadmin: 123456 (admin)\n1g 0:00:00:00 DONE (2025-10-27 12:00) 100.0g/s";

            case 'aircrack-ng':
                return "Interface wlan0mon:\nBSSID              PWR  Beacons    #Data, #/s  CH  MB   ENC  CIPHER AUTH ESSID\n00:11:22:33:44:55  -50        2        0    0   6  54e  WPA2 CCMP   PSK  CorpWifi";

            case 'ping':
                if (args.length === 0) return "usage: ping [destination]";
                return `PING ${args[0]} (${args[0]}) 56(84) bytes of data.
64 bytes from ${args[0]}: icmp_seq=1 ttl=119 time=14.2 ms
64 bytes from ${args[0]}: icmp_seq=2 ttl=119 time=15.1 ms
64 bytes from ${args[0]}: icmp_seq=3 ttl=119 time=14.8 ms
64 bytes from ${args[0]}: icmp_seq=4 ttl=119 time=14.5 ms
--- ${args[0]} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms`;

            case 'whois':
                if (args.length === 0) return "usage: whois [domain]";
                return `Domain Name: ${(args[0] || '').toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.markmonitor.com
Registrar URL: http://www.markmonitor.com
Updated Date: 2024-01-24T00:00:00Z
Creation Date: 2005-01-24T00:00:00Z
Registry Expiry Date: 2026-01-24T00:00:00Z
Registrar: MarkMonitor Inc.
Registrant Organization: ${account?.username === 'keamo' ? 'Keamo Sec' : 'Unknown Entity'}`;

            case 'netstat':
                return `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 192.168.1.15:43210      104.21.55.2:443         ESTABLISHED
tcp        0      0 192.168.1.15:ssh        192.168.1.44:55123      ESTABLISHED
udp        0      0 192.168.1.15:bootpc     192.168.1.1:bootps      ESTABLISHED`;

            case 'submit-report':
                if (args.length < 2) return "Usage: submit-report [suspect_username] [destination_ip]";
                if (args[0] === 'dev_ops_phantom' && args[1] === '45.33.22.11') {
                    discoverClue('submit-report', 'terminal');
                    return "[+] REPORT SUBMITTED. HQ confirms receipt. Investigation closed.";
                }
                return "[-] Incorrect parameters. Please verify your findings from logs and network traffic.";

            case 'cowsay':
                return ` __________________
< ${args.join(' ') || 'Moo'} >
 ------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

            case 'sl':
                return "  (  ) (@@) ( )  (@)  ()    @@    O     @     O     @\n (@@@)  )(    (@@)  (@@)  (@@)  (@@)  (@@)  (@@)  (@@)\n (   )  (    (   )  (   )  (   )  (   )  (   )  (   )\n  (@@)  (    (@@)  (@@)  (@@)  (@@)  (@@)  (@@)  (@@";

            case 'neofetch':
                return NEOFETCH_ART +
                    `
OS: Kali GNU/Linux Rolling x86_64
Host: Portfolio VM
Kernel: 6.5.0-kali3-amd64
Uptime: ${Math.floor(performance.now() / 60000)} mins
Packages: 2451 (dpkg)
Shell: zsh 5.9
Theme: ${isLightMode ? 'Glassmorphism [Light]' : 'Kali-Dark [GTK2/3]'}
Icons: Flat-Remix-Blue [GTK2/3]
Terminal: qterminal
CPU: Virtual CPU (4) @ 2.80GHz
GPU: VMware SVGA II Adapter
Memory: 32768MiB
`;

            case 'help':
                const allCmds = getAvailableCommands(account?.accountType || AccountType.GUEST).sort();

                const fileSystem = ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'rm', 'cp', 'mv'];
                const network = ['ping', 'whois', 'netstat', 'ifconfig', 'ip', 'aircrack-ng', 'nmap'];
                const tools = ['node', 'grep', 'searchsploit', 'msfconsole', 'john'];
                const system = ['whoami', 'date', 'history', 'clear', 'exit', 'man', 'help', 'top', 'ps', 'neofetch', 'submit-report'];
                const ctf = ['decode64', 'ascii', 'charat', 'hint', 'gemini'];
                const fun = ['cmatrix', 'cowsay', 'sl'];

                const categorize = (cmd: string) => {
                    if (fileSystem.includes(cmd)) return 'File System';
                    if (network.includes(cmd)) return 'Network';
                    if (tools.includes(cmd)) return 'Tools';
                    if (system.includes(cmd)) return 'System';
                    if (ctf.includes(cmd)) return 'CTF / Crypto';
                    if (fun.includes(cmd)) return 'Fun';
                    return 'Other';
                };

                const grouped: Record<string, string[]> = {};
                allCmds.forEach(cmd => {
                    const cat = categorize(cmd);
                    if (!grouped[cat]) grouped[cat] = [];
                    grouped[cat].push(cmd);
                });

                let helpOutput = `GNU bash, version 5.1.16(1)-release\nThese shell commands are defined internally. Type 'help' to see this list.\n\n`;

                Object.keys(grouped).forEach(cat => {
                    helpOutput += `--- ${cat} ---\n`;
                    helpOutput += grouped[cat].join(', ') + '\n\n';
                });

                return helpOutput.trim();

            case 'hint':
                return `[+] Challenge Hint: The admin password is fragmented across the system.
    Step 1: Check system logs for encoded data.
    Step 2: Check developer notes for character codes.
    Step 3: Check source viewer for logic.
    Step 4: Analyze network traffic in Wireshark for credential remnants.`;

            case 'clear':
                setHistory([]);
                return '';

            case 'exit':
                return 'Logout not supported in terminal. Use Start Menu.';

            case 'top':
                setIsTopRunning(true);
                return '';

            case 'cmatrix':
            case 'matrix':
                if (level < 3) {
                    playSound(SOUND_KEYS.ERROR);
                    return "Permission Denied: Matrix Protocol requires Security Level 3 clearance (Check Quest Rewards).";
                }
                setIsMatrixRunning(true);
                playSound(SOUND_KEYS.OPEN);
                return '';

            default:
                if (COMMON_UNIMPLEMENTED.includes(command)) {
                    playSound(SOUND_KEYS.ERROR);
                    return `${command}: permission denied (simulation restricted)`;
                }
                return `bash: ${command}: command not found`;
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            setHistory(prev => [...prev, `${account?.username || 'guest'}@kali:${currentPath}$ ${cmd}`]);

            if (cmd) {
                setCommandHistory(prev => [...prev, cmd]);
                setHistoryIndex(-1);
                playSound(SOUND_KEYS.TYPING);

                if (cmd.includes('|')) {
                    const pipeParts = cmd.split('|');
                    let pipeInput: string | null = null;
                    let lastOutput = '';

                    setIsProcessing(true);
                    for (const part of pipeParts) {
                        lastOutput = await executeSingleCommand(part.trim(), pipeInput);
                        pipeInput = lastOutput;
                    }
                    setIsProcessing(false);
                    if (lastOutput) setHistory(prev => [...prev, lastOutput]);
                } else {
                    setIsProcessing(true);
                    const output = await executeSingleCommand(cmd);
                    setIsProcessing(false);
                    if (output) setHistory(prev => [...prev, output]);
                }
            }

            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex + 1;
                if (newIndex < commandHistory.length) {
                    setHistoryIndex(newIndex);
                    setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'c' && e.ctrlKey) {
            setHistory(prev => [...prev, `${account?.username || 'guest'}@kali:${currentPath}$ ${input}^C`]);
            setInput('');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const parts = input.split(' ');
            const currentWord = parts[parts.length - 1];

            if (!currentWord) return;

            const commands = getAvailableCommands(account?.accountType || AccountType.GUEST);
            let files: string[] = [];
            try {
                files = readdir(currentPath);
            } catch { /* ignore */ }

            const candidates = [...commands, ...files].filter(c => c.startsWith(currentWord));

            if (candidates.length === 1) {
                parts[parts.length - 1] = candidates[0];
                setInput(parts.join(' ') + ' ');
            } else if (candidates.length > 1) {
                setHistory(prev => [
                    ...prev,
                    `${account?.username || 'guest'}@kali:${currentPath}$ ${input}`,
                    candidates.join('  ')
                ]);
            }
        }
    };

    if (isTopRunning) {
        return (
            <div className={`h-full w-full ${isLightMode ? 'bg-white/90 text-slate-800' : 'bg-black/95 text-[#00ff00]'} backdrop-blur-xl font-mono text-sm p-4 overflow-hidden select-none relative`}>
                <div className={`absolute inset-0 ${isLightMode ? 'bg-blue-50/5' : 'bg-[#00ff00]/5'} pointer-events-none`}></div>
                <div className="mb-2">top - {new Date().toLocaleTimeString()} up 1:23,  1 user,  load average: 0.08, 0.03, 0.01</div>
                <div className="mb-2">Tasks: 187 total,   1 running, 186 sleeping,   0 stopped,   0 zombie</div>
                <div className="mb-2">%Cpu(s):  1.5 us,  0.5 sy,  0.0 ni, 97.9 id,  0.0 wa,  0.0 hi,  0.1 si,  0.0 st</div>
                <div className="mb-4">MiB Mem :  32768.0 total,  28500.0 free,   2500.0 used,   1768.0 buff/cache</div>

                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className={`${isLightMode ? 'bg-slate-200 text-slate-900' : 'bg-white text-black'}`}>
                            <th>PID</th><th>USER</th><th>PR</th><th>NI</th><th>VIRT</th><th>RES</th><th>SHR</th><th>S</th><th>%CPU</th><th>%MEM</th><th>TIME+</th><th>COMMAND</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1337</td><td>root</td><td>20</td><td>0</td><td>12.5g</td><td>400m</td><td>100m</td><td>S</td><td>1.2</td><td>1.2</td><td>0:15.42</td><td>Xorg</td></tr>
                        <tr><td>2024</td><td>keamo</td><td>20</td><td>0</td><td>8.2g</td><td>350m</td><td>80m</td><td>S</td><td>0.8</td><td>1.0</td><td>0:08.21</td><td>chrome</td></tr>
                        <tr><td>3001</td><td>keamo</td><td>20</td><td>0</td><td>400m</td><td>45m</td><td>20m</td><td>R</td><td>0.3</td><td>0.1</td><td>0:00.05</td><td>top</td></tr>
                        <tr><td>1</td><td>root</td><td>20</td><td>0</td><td>168m</td><td>12m</td><td>8m</td><td>S</td><td>0.0</td><td>0.0</td><td>0:02.11</td><td>systemd</td></tr>
                    </tbody>
                </table>
                <div className={`mt-4 px-2 ${isLightMode ? 'text-blue-900 bg-blue-100' : 'text-white bg-blue-900'}`}>
                    Tip: Press Ctrl+C to exit process
                </div>
            </div>
        );
    }

    const terminalClasses = isLightMode
        ? "h-full w-full bg-white/20 backdrop-blur-2xl text-slate-800 font-mono text-sm p-4 overflow-y-auto relative selection:bg-blue-500/20 selection:text-blue-900 shadow-inner"
        : "h-full w-full bg-[#050505]/90 backdrop-blur-xl text-[#00ff00] font-mono text-sm p-4 overflow-y-auto relative selection:bg-[#00ff00]/30 selection:text-white";

    const promptUserClass = isLightMode ? "text-indigo-600 font-bold mr-1" : "text-blue-400 font-bold mr-1";
    const promptSymbolClass = isLightMode ? "text-indigo-500 font-bold mr-2" : "text-blue-400 font-bold mr-2";
    const inputClass = isLightMode
        ? "bg-transparent border-none outline-none text-slate-900 flex-1 caret-indigo-600 disabled:opacity-50 font-medium placeholder-slate-400"
        : "bg-transparent border-none outline-none text-[#00ff00] flex-1 caret-white disabled:opacity-50";

    const isMobile = window.innerWidth < 768;

    return (
        <div
            className={terminalClasses}
            style={{ WebkitOverflowScrolling: 'touch' }}
            onClick={() => {
                // On mobile, only focus if tapping the input directly (handled by input's onClick), 
                // preventing keyboard popup when just tapping/scrolling the terminal area
                if (!isMobile) {
                    inputRef.current?.focus();
                }
            }}
        >
            {isMatrixRunning && (
                <div className={`absolute inset-0 z-50 ${isLightMode ? 'bg-white/80' : 'bg-black'}`}>
                    <canvas ref={canvasRef} className="w-full h-full" />
                    <div className={`absolute bottom-4 left-4 px-2 rounded ${isLightMode ? 'bg-white/80 text-black shadow-lg' : 'bg-black/50 text-white'}`}>
                        Press Ctrl+C to exit Matrix
                    </div>
                </div>
            )}

            {!isLightMode && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            )}

            {!isLightMode && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/10 bg-[length:100%_4px]"></div>
            )}

            <div className="relative z-10 space-y-1">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words leading-relaxed">{line}</div>
                ))}

                {isProcessing && <div className={isLightMode ? "text-indigo-500 animate-pulse" : "text-blue-400 animate-pulse"}>Processing...</div>}

                <div className="flex items-center" ref={bottomRef}>
                    <span className={promptUserClass}>
                        ┌──({account?.username === 'keamo' ? 'root' : account?.username || 'guest'}㉿kali)-[{currentPath}]
                    </span>
                </div>
                <div className="flex items-center">
                    <span className={promptSymbolClass}>└─{account?.username === 'keamo' ? '#' : '$'}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                        className={inputClass}
                        autoFocus={!isMobile}
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
};

export default Terminal;

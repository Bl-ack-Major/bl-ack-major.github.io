
import React, { createContext, useContext, useState, useCallback } from 'react';

export type FileType = 'file' | 'folder' | 'symlink';

export interface FsNode {
    type: FileType;
    content?: string;
    children?: Record<string, FsNode>;
}

// Initial State moved here for persistence
const INITIAL_FS: Record<string, FsNode> = {
    'home': {
        type: 'folder',
        children: {
            'keamo': {
                type: 'folder',
                children: {
                    'Desktop': {
                        type: 'folder',
                        children: {
                            'resume.pdf': { type: 'file', content: 'Binary PDF data...' },
                            'manifesto.txt': { type: 'file', content: 'The Hacker Manifesto...\nI am a Hacker, enter my world...' },
                            'hello.c': { type: 'file', content: '#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}' },
                            'hello.sh': { type: 'file', content: 'echo "Hello World from Bash!"' },
                            'script.js': { type: 'file', content: 'console.log("Hello World");' }
                        }
                    },
                    'Documents': {
                        type: 'folder',
                        children: {
                            'notes.txt': { type: 'file', content: 'Meeting notes: Discuss red team engagement timeline.' },
                            'project_ideas.md': { type: 'file', content: '# Project Ideas\n1. AD Lab\n2. Node.js Port Scanner' }
                        }
                    },
                    'Downloads': {
                        type: 'folder',
                        children: {
                            'payload.exe': { type: 'file', content: 'MZ......' }
                        }
                    },
                    '.dev_notes': {
                        type: 'file',
                        content: 'CONFIDENTIAL\nFragment 2: ASCII character codes [101, 72, 65, 99]\n\nTodo: Remove hardcoded credentials from validation logic.'
                    },
                    'scan_results.txt': {
                        type: 'file',
                        content: 'Scan Results:\nPort 22: OPEN (SSH)\nPort 80: OPEN (HTTP)\nPort 3306: CLOSED (MySQL)'
                    }
                }
            },
            'guest': {
                type: 'folder',
                children: {
                    'welcome.msg': { type: 'file', content: 'Welcome to the guest session.' }
                }
            }
        }
    },
    'var': {
        type: 'folder',
        children: {
            'log': {
                type: 'folder',
                children: {
                    'system.log': { type: 'file', content: '[2024-01-15 14:23:45] SYSTEM: Password piece 1 encoded: eU91SGF2 (Base64)\n[WARN] Failed login attempt from 192.168.1.5' },
                    'auth.log': { type: 'file', content: 'Oct 12 08:00:00 kali sshd[123]: Accepted password for keamo from 192.168.1.10' }
                }
            },
            'www': {
                type: 'folder',
                children: {
                    'html': { type: 'folder', children: { 'index.html': { type: 'file', content: '<html><body><h1>It Works!</h1></body></html>' } } }
                }
            }
        }
    },
    'etc': {
        type: 'folder',
        children: {
            'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nkeamo:x:1000:1000:Keamo,,,:/home/keamo:/bin/zsh\nguest:x:1001:1001:Guest,,,:/home/guest:/bin/bash' },
            'shadow': { type: 'file', content: 'root:!:19700:0:99999:7:::\nkeamo:$y$j9T$SaltString$HashString:19700:0:99999:7:::' },
            'config.bak': { type: 'file', content: '# Backup Config\n# admin_pass = "yOuHaveHAckedM3" # TODO: remove' },
            'hostname': { type: 'file', content: 'kali-linux' }
        }
    },
    'usr': {
        type: 'folder',
        children: {
            'bin': { type: 'folder', children: {} }, 
            'share': { type: 'folder', children: { 'wordlists': { type: 'folder', children: { 'rockyou.txt': { type: 'file', content: '123456\npassword\nadmin' } } } } }
        }
    },
    'tmp': { type: 'folder', children: {} }
};

interface FileSystemContextType {
    fs: Record<string, FsNode>;
    updateFs: (newFs: Record<string, FsNode>) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fs, setFs] = useState<Record<string, FsNode>>(INITIAL_FS);

    const updateFs = useCallback((newFs: Record<string, FsNode>) => {
        setFs(newFs);
    }, []);

    return (
        <FileSystemContext.Provider value={{ fs, updateFs }}>
            {children}
        </FileSystemContext.Provider>
    );
};

export const useFileSystemContext = () => {
    const context = useContext(FileSystemContext);
    if (!context) {
        throw new Error('useFileSystemContext must be used within a FileSystemProvider');
    }
    return context;
};

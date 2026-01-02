
import { useState, useCallback } from 'react';
import { useFileSystemContext, FsNode, FileType } from '../contexts/FileSystemContext';

export const useFileSystem = (initialPath: string = '/home/keamo') => {
    const [currentPath, setCurrentPath] = useState<string>(initialPath);
    const { fs, updateFs } = useFileSystemContext();

    // --- Helpers ---

    const resolvePath = useCallback((path: string): string => {
        let targetPath = path;
        if (targetPath.startsWith('~')) {
            targetPath = targetPath.replace('~', '/home/keamo'); 
        }

        let parts = targetPath.split('/').filter(p => p.length > 0);
        
        // Handle absolute path
        let stack = targetPath.startsWith('/') ? [] : currentPath.split('/').filter(p => p.length > 0);

        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') {
                if (stack.length > 0) stack.pop();
            } else {
                stack.push(part);
            }
        }

        return '/' + stack.join('/');
    }, [currentPath]);

    const getNode = useCallback((path: string): FsNode | null => {
        const resolved = resolvePath(path);
        if (resolved === '/') return { type: 'folder', children: fs };

        const parts = resolved.split('/').filter(p => p.length > 0);
        let current: FsNode = { type: 'folder', children: fs };

        for (const part of parts) {
            if (current.type !== 'folder' || !current.children || !current.children[part]) {
                return null;
            }
            current = current.children[part];
        }
        return current;
    }, [fs, resolvePath]);

    // --- Actions ---

    const readdir = useCallback((path: string = '.') : string[] => {
        const node = getNode(path);
        if (!node) throw new Error(`ls: cannot access '${path}': No such file or directory`);
        if (node.type !== 'folder') return [path.split('/').pop() || ''];
        return node.children ? Object.keys(node.children) : [];
    }, [getNode]);

    const readFile = useCallback((path: string): string => {
        const node = getNode(path);
        if (!node) throw new Error(`cat: ${path}: No such file or directory`);
        if (node.type === 'folder') throw new Error(`cat: ${path}: Is a directory`);
        return node.content || '';
    }, [getNode]);

    const changeDir = useCallback((path: string) => {
        const target = resolvePath(path);
        const node = getNode(target);
        
        if (!node) throw new Error(`cd: ${path}: No such file or directory`);
        if (node.type !== 'folder') throw new Error(`cd: ${path}: Not a directory`);
        
        setCurrentPath(target);
    }, [getNode, resolvePath]);

    // --- Write Actions (Persistence) ---

    const createNode = useCallback((path: string, type: FileType, content: string = '') => {
        const fullPath = resolvePath(path);
        const parts = fullPath.split('/').filter(p => p.length > 0);
        const fileName = parts.pop();
        
        if (!fileName) throw new Error(`cannot create root`);

        // Deep copy FS to mutate
        const newFs = JSON.parse(JSON.stringify(fs));
        let current = newFs;

        // Traverse to parent
        for (const part of parts) {
            if (!current[part] || current[part].type !== 'folder') {
                throw new Error(`cannot create '${path}': No such file or directory`);
            }
            current = current[part].children;
        }

        if (current[fileName]) {
             // For mkdir EEXIST, for touch update time (simulated by doing nothing/overwriting)
             if(type === 'folder') throw new Error(`cannot create directory '${path}': File exists`);
             // If touch and exists, just return (update timestamp not implemented)
             return; 
        }

        current[fileName] = {
            type,
            content: type === 'file' ? content : undefined,
            children: type === 'folder' ? {} : undefined
        };

        updateFs(newFs);
    }, [fs, resolvePath, updateFs]);

    const mkdir = useCallback((path: string) => createNode(path, 'folder'), [createNode]);
    
    const touch = useCallback((path: string, content: string = '') => createNode(path, 'file', content), [createNode]);

    return {
        currentPath,
        fs,
        resolvePath,
        readdir,
        readFile,
        changeDir,
        mkdir,
        touch
    };
};

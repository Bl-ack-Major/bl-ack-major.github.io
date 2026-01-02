
import React from 'react';
import { Code, Lock } from 'lucide-react';
import { useChallenge } from '../../contexts/ChallengeContext';
import { useTheme } from '../../contexts/ThemeContext';

const SourceViewer: React.FC = () => {
    const { stage } = useChallenge();
    const { isLightMode } = useTheme();

    if (stage < 2) {
        return (
            <div className={`h-full flex flex-col items-center justify-center p-8 text-center border-l-4 ${isLightMode ? 'bg-slate-50 text-slate-500 border-red-400' : 'bg-[#1e1e1e] text-gray-500 border-red-900'}`}>
                <Code size={64} className="mb-4 opacity-20" />
                <h1 className={`text-xl font-bold mb-2 ${isLightMode ? 'text-red-500' : 'text-red-400'}`}>SOURCE CODE ENCRYPTED</h1>
                <p className="text-sm">You do not have the required permissions to view authentication logic.</p>
                <p className="text-xs mt-4">Hint: Solve the Dev Notes puzzle first.</p>
            </div>
        );
    }

    const code = `
// AUTHENTICATION MODULE v3.0
// Logic for Fragment 3 generation

const PHRASE = "Stack code demo M3";

function getFragment3() {
    // The third part of the password is constructed 
    // by taking specific characters from our secret phrase.
    
    // Logic: Extract characters at indices 4, 9, 8, 16, 17.
    // Use the 'charat' tool in terminal to test this.
    // NOTE: Indices are 0-based. Spaces count as characters.
    
    // "Stack code demo M3"
    //  012345678901234567
    
    const i1 = PHRASE.charAt(4);
    const i2 = PHRASE.charAt(9);
    const i3 = PHRASE.charAt(8);
    const i4 = PHRASE.charAt(16);
    const i5 = PHRASE.charAt(17);
    
    return i1 + i2 + i3 + i4 + i5; 
}
`;

    // Theme Variables
    const bgMain = isLightMode ? 'bg-[#ffffff]' : 'bg-[#1e1e1e]';
    const textBase = isLightMode ? 'text-[#24292e]' : 'text-[#d4d4d4]';
    const headerBg = isLightMode ? 'bg-[#f6f8fa]' : 'bg-[#2d2d2d]';
    const borderColor = isLightMode ? 'border-[#e1e4e8]' : 'border-black';

    return (
        <div className={`h-full flex flex-col font-mono text-sm ${bgMain} ${textBase}`}>
            <div className={`${headerBg} p-2 flex items-center justify-between border-b ${borderColor}`}>
                <span className="flex items-center gap-2"><Code size={14} className="text-blue-400"/> auth/validation.js</span>
                <span className="text-xs text-green-500 font-bold flex items-center gap-1"><Lock size={10}/> UNLOCKED</span>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <pre className="whitespace-pre-wrap leading-relaxed">
                    <code className="language-javascript">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default SourceViewer;

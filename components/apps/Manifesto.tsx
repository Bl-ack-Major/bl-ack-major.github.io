import React from 'react';
import { FileText, Lock } from 'lucide-react';

const Manifesto: React.FC = () => {
    return (
        <div className="h-full bg-black text-green-500 font-mono p-8 overflow-y-auto leading-relaxed">
            <h1 className="text-3xl font-bold text-white mb-8 border-b border-green-800 pb-4">The Ethical Hacker's Manifesto</h1>
            
            <div className="max-w-3xl mx-auto space-y-6 text-lg">
                <p>
                    <span className="text-white font-bold">I am a Hacker, enter my world...</span><br/>
                    Mine is a world that begins with school... I'm smarter than most of the other kids, this crap they teach us bores me...
                </p>

                <p>
                    We explore... and you call us criminals. We seek after knowledge... and you call us criminals. We exist without skin color, without nationality, without religious bias... and you call us criminals.
                </p>

                <div className="my-12 p-6 border border-red-900 bg-red-900/10 rounded">
                    <h2 className="text-red-500 font-bold mb-2 flex items-center gap-2"><Lock size={20}/> Encrypted Message</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        A hidden file 'secret.enc' exists on this system. To verify your skills, you must decrypt it using the GPG tool in the terminal.
                    </p>
                    <p className="text-red-400 font-bold">Hint: The passphrase is the year the original Hacker Manifesto was written.</p>
                </div>

                <h2 className="text-2xl text-white font-bold mt-12 mb-4">My Philosophy</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li><strong className="text-green-400">Curiosity First:</strong> Always ask "what if?" and "why not?".</li>
                    <li><strong className="text-green-400">Responsible Disclosure:</strong> Finding bugs is a service; exploiting them without permission is a crime.</li>
                    <li><strong className="text-green-400">Continuous Learning:</strong> Technology evolves daily, and so must we.</li>
                    <li><strong className="text-green-400">Share Knowledge:</strong> The community grows only when we teach each other.</li>
                </ul>
                
                <p className="mt-12 text-gray-500 italic text-sm text-center">
                    "This is our world now... the world of the electron and the switch, the beauty of the baud."
                </p>
            </div>
        </div>
    );
};

export default Manifesto;
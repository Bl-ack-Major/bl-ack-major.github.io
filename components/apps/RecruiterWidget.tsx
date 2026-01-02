
import React from 'react';
import { FileText, Layers, Award, Mail } from 'lucide-react';
import { AppId } from '../../types';

// Simple widget that redirects to main apps, meant for the desktop
const RecruiterWidget: React.FC = () => {
    // In a real implementation this would likely invoke openApp from context
    // For now, it's a static visual as the main navigation is via Desktop Icons
    return (
        <div className="h-full flex flex-col bg-white text-gray-800 p-4">
            <h2 className="font-bold text-lg border-b pb-2 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded hover:bg-blue-50 cursor-pointer">
                    <FileText size={24} className="text-red-500 mb-2" />
                    <span className="text-sm font-medium">Resume</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded hover:bg-blue-50 cursor-pointer">
                    <Layers size={24} className="text-purple-500 mb-2" />
                    <span className="text-sm font-medium">Projects</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded hover:bg-blue-50 cursor-pointer">
                    <Award size={24} className="text-yellow-500 mb-2" />
                    <span className="text-sm font-medium">Certs</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded hover:bg-blue-50 cursor-pointer">
                    <Mail size={24} className="text-teal-500 mb-2" />
                    <span className="text-sm font-medium">Contact</span>
                </div>
            </div>
        </div>
    );
};

export default RecruiterWidget;

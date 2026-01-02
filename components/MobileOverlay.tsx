
import React, { useState } from 'react';
import { Smartphone, Monitor, FileText, X } from 'lucide-react';

const MobileOverlay: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d1117] flex flex-col items-center justify-center p-6 md:hidden text-center">
      <div className="bg-[#1f2229] p-8 rounded-xl border border-gray-700 shadow-2xl max-w-sm">
        <div className="w-16 h-16 bg-[#367BF0]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-8 h-8 text-[#367BF0]" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Desktop Experience</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          This portfolio is a simulated Kali Linux desktop environment designed for larger screens. 
          For the best experience, please view on a desktop or laptop.
        </p>

        <div className="space-y-3">
          <button 
            className="w-full flex items-center justify-center gap-2 bg-[#367BF0] text-white py-3 rounded-lg font-medium hover:bg-[#2d6cdb] transition-colors"
            onClick={() => window.open('https://drive.google.com/file/d/1DLKUPEC1VHe13CKf_iQ7mp1IdeLWrS0S/view?usp=sharing', '_blank')}
          >
            <FileText size={18} />
            View Resume (PDF)
          </button>
          
          <button 
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-gray-600 text-gray-300 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
            onClick={() => setIsDismissed(true)}
          >
            <Smartphone size={18} />
            Proceed Anyway
          </button>
        </div>
        
        <p className="mt-6 text-xs text-gray-500">
          Note: Some features may not work correctly on touch devices.
        </p>
      </div>
    </div>
  );
};

export default MobileOverlay;

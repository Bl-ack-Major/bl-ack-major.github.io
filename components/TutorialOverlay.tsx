
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TutorialStep {
  target?: string;
  title: string;
  content: string;
  position: 'center' | 'bottom-left' | 'top-left' | 'top-right' | 'bottom-right';
}

const STEPS: TutorialStep[] = [
  {
    title: "Welcome to Kali Web",
    content: "This is an interactive portfolio designed to look and feel like Kali Linux. Let's take a quick tour.",
    position: 'center'
  },
  {
    title: "Start Menu",
    content: "Click the Dragon icon to access all applications, including my projects and contact info.",
    position: 'center'
  },
  {
    title: "Ready to Explore",
    content: "You're all set. A README file will open automatically to guide you to my resume, projects, and contact details.",
    position: 'center'
  }
];

const TutorialOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Skip if already seen
  useEffect(() => {
    const seen = localStorage.getItem('tutorial_seen');
    if (seen) onClose();
  }, []);

  const handleFinish = () => {
    localStorage.setItem('tutorial_seen', 'true');
    onClose();
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm transition-opacity duration-300" />
      
      <div 
        className={`pointer-events-auto bg-[#1f2229] border border-[#367BF0] shadow-[0_0_30px_rgba(54,123,240,0.3)] rounded-lg p-6 w-96 max-w-[90vw] relative transition-all duration-300 z-50
            ${step.position === 'bottom-left' ? 'absolute bottom-20 left-4' : ''}
            ${step.position === 'center' ? 'relative' : ''}
        `}
      >
        <button onClick={handleFinish} className="absolute top-2 right-2 text-gray-500 hover:text-white">
          <X size={16} />
        </button>

        <div className="mb-4">
            <span className="text-xs font-bold text-[#367BF0] uppercase tracking-wider">Step {currentStep + 1} of {STEPS.length}</span>
            <h3 className="text-xl font-bold text-white mt-1">{step.title}</h3>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {step.content}
        </p>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`text-gray-400 hover:text-white flex items-center gap-1 text-sm ${currentStep === 0 ? 'invisible' : ''}`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button 
            onClick={() => currentStep === STEPS.length - 1 ? handleFinish() : setCurrentStep(currentStep + 1)}
            className="bg-[#367BF0] hover:bg-[#2d6cdb] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors"
          >
            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/ToastNotification';
import { SOUND_KEYS } from '../constants';
import { useSound } from './SoundContext';

type Difficulty = 'casual' | 'hard';

interface ChallengeContextType {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  stage: number; // 0 = Start, 1 = Found F1, 2 = Found F2, 3 = Found F3 (Wireshark Unlocked)
  advanceStage: (currentStage: number) => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('casual');
  // Load initial stage from local storage or default to 0
  const [stage, setStage] = useState<number>(() => {
      const saved = localStorage.getItem('challenge_stage');
      return saved ? parseInt(saved, 10) : 0;
  });

  const { addNotification } = useToast();
  const { playSound } = useSound();

  const advanceStage = (triggerStage: number) => {
      // Only advance if we are currently AT the trigger stage (prevents skipping or re-triggering)
      if (stage === triggerStage) {
          const nextStage = stage + 1;
          setStage(nextStage);
          localStorage.setItem('challenge_stage', nextStage.toString());
          
          playSound(SOUND_KEYS.LOGIN); // Victory sound for progress
          
          let message = "";
          if (nextStage === 1) message = "Fragment 1 Verified. Decryption Key found. Unlocking Dev Notes...";
          if (nextStage === 2) message = "Fragment 2 Verified. Source Code Access Granted.";
          if (nextStage === 3) message = "Fragment 3 Verified. Network Sniffer (Wireshark) Unlocked.";
          
          addNotification(message, 'success');
      }
  };

  return (
    <ChallengeContext.Provider value={{ difficulty, setDifficulty, stage, advanceStage }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};

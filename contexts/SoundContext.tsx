
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { SOUND_KEYS } from '../constants';

interface SoundContextType {
  playSound: (soundKey: string) => void;
  toggleMute: () => void;
  isMuted: boolean;
  setVolume: (vol: number) => void;
  volume: number;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.15); // Much lower default volume for subtlety
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Ambient oscillator references
  const ambientOscillators = useRef<OscillatorNode[]>([]);
  const ambientGain = useRef<GainNode | null>(null);

  // Initialize AudioContext
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
        const mainGain = audioContextRef.current.createGain();
        mainGain.gain.value = volume;
        mainGain.connect(audioContextRef.current.destination);
        gainNodeRef.current = mainGain;
      }
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume().catch(() => { });
    }
  }, [volume]);

  // Update master volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.1);
    }
  }, [volume]);

  // --- SYNTHESIZER FUNCTIONS ---

  const playTone = (
    freq: number,
    type: OscillatorType,
    duration: number,
    startTime: number = 0,
    vol: number = 1
  ) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    // Ultra-short envelopes for UI sounds to prevent lingering annoyance
    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(gainNodeRef.current);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  };

  // --- SFX PRESETS (Subtle / Minimalist) ---

  const playClick = () => {
    // Very soft "tick" (High pass sine)
    if (!audioContextRef.current || !gainNodeRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.1, ctx.currentTime); // Very quiet
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  };

  const playTyping = () => {
    // Extremely subtle key tap (Filtered noise or high sine)
    // Used for auto-typing, must be non-intrusive
    playTone(800, 'sine', 0.02, 0, 0.05);
  };

  const playError = () => {
    // Soft "bonk"
    playTone(150, 'triangle', 0.1, 0, 0.2);
  };

  const playOpen = () => {
    // Airy swoosh - barely audible
    if (!audioContextRef.current || !gainNodeRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playClose = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(gainNodeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playBoot = () => {
    // Modern Startup Chime (C Major Chord) - Keep this one clear but smooth
    const now = 0;
    playTone(523.25, 'sine', 1.2, now, 0.2); // C5
    playTone(659.25, 'sine', 1.2, now, 0.2); // E5
    playTone(783.99, 'sine', 1.2, now, 0.2); // G5
  };

  const playLogin = () => {
    // Simple Success Chime
    playTone(880, 'sine', 0.4, 0, 0.1);
    playTone(1760, 'sine', 0.4, 0.1, 0.05);
  };

  const startAmbient = () => {
    // Near-silent noise floor to keep audio context active and add "air"
    if (ambientOscillators.current.length > 0 || isMuted || !audioContextRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = 0.005; // Extremely quiet

    noise.connect(gain);
    gain.connect(gainNodeRef.current);
    noise.start();

    ambientOscillators.current.push(noise as any);
    ambientGain.current = gain;
  };

  const stopAmbient = () => {
    ambientOscillators.current.forEach(osc => {
      try { osc.stop(); } catch (e) { }
    });
    ambientOscillators.current = [];
    ambientGain.current = null;
  };

  // --- MAIN HANDLER ---

  const playSound = useCallback((soundKey: string) => {
    initAudioContext();
    if (isMuted) return;

    switch (soundKey) {
      case SOUND_KEYS.CLICK:
      case SOUND_KEYS.UI_CLICK:
        playClick();
        break;
      case SOUND_KEYS.TYPING:
        playTyping();
        break;
      case SOUND_KEYS.BOOT:
        playBoot();
        break;
      case SOUND_KEYS.LOGIN:
        playLogin();
        break;
      case SOUND_KEYS.OPEN:
        playOpen();
        break;
      case SOUND_KEYS.CLOSE:
        playClose();
        break;
      case SOUND_KEYS.ERROR:
        playError();
        break;
      case SOUND_KEYS.AMBIENT:
        startAmbient();
        break;
      default:
        break;
    }
  }, [isMuted, initAudioContext]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) stopAmbient();
      else if (audioContextRef.current) startAmbient();
      return next;
    });
  };

  useEffect(() => {
    if (isMuted) stopAmbient();
  }, [isMuted]);

  // Allow interaction to unlock audio context
  useEffect(() => {
    const handleInteraction = () => {
      initAudioContext();
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      stopAmbient();
    };
  }, [initAudioContext]);

  return (
    <SoundContext.Provider value={{ playSound, toggleMute, isMuted, setVolume, volume }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

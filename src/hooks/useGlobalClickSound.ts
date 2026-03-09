import { useEffect } from 'react';

export function useGlobalClickSound() {
  useEffect(() => {
    let audioCtx: AudioContext | null = null;

    const playClickSound = () => {
      try {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) return;
          audioCtx = new AudioContextClass();
        }

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        // Quick frequency drop for a "click/tick" sound
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

        // Quick volume envelope
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    };

    const handleClick = (event: MouseEvent) => {
      // Find the closest button element from the clicked target
      const target = event.target as HTMLElement;
      const button = target.closest('button, a[role="button"], input[type="button"], input[type="submit"], .cursor-pointer');

      if (button) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(e => console.warn('Audio close failed', e));
      }
    };
  }, []);
}

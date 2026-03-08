import { useCallback } from 'react';

export function useSound(soundFile: string, volume: number = 0.5) {
  const play = useCallback(() => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = volume;
      audio.play().catch(error => {
        // Auto-play policies might block playback if not triggered by user interaction
        console.warn('Audio playback failed:', error);
      });
    } catch (error) {
      console.error('Error creating Audio object:', error);
    }
  }, [soundFile, volume]);

  return play;
}

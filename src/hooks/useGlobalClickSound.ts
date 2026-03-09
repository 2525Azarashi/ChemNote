import { useEffect } from 'react';
import clickSoundFile from '../assets/click.mp3';

export function useGlobalClickSound() {
  useEffect(() => {
    const audio = new Audio(clickSoundFile);
    audio.volume = 0.5;

    const handleClick = (event: MouseEvent) => {
      // Find the closest button element from the clicked target
      const target = event.target as HTMLElement;
      const button = target.closest('button, a[role="button"], input[type="button"], input[type="submit"], .cursor-pointer');

      if (button) {
        // Clone the audio node to allow overlapping sounds if clicked rapidly
        const sound = audio.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(e => console.warn('Audio play failed', e));
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}

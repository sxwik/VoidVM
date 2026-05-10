import { useCallback } from 'react';

export function useFullscreen(screenRef: React.RefObject<HTMLDivElement | null>) {
  const goFullscreen = useCallback(() => {
    if (screenRef.current) {
      const el = screenRef.current;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
  }, [screenRef]);

  return { goFullscreen };
}

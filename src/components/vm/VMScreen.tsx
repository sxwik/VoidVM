import React, { useEffect } from 'react';

interface VMScreenProps {
  screenRef: React.RefObject<HTMLDivElement | null>;
}

const V86_HTML_STRUCTURE = `
  <div style="white-space: pre; font: 14px monospace; line-height: 14px; display: none; color: white;"></div>
  <canvas style="display: none"></canvas>
`;

export const VMScreen: React.FC<VMScreenProps> = React.memo(({ screenRef }) => {
  useEffect(() => {
    // Explicitly focus the screen container on mount to ensure keyboard events are captured
    if (screenRef.current) {
      screenRef.current.focus();
    }
  }, [screenRef]);

  return (
    <div 
      id="screen_container"
      ref={screenRef} 
      className="bg-black w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden relative outline-none focus:ring-2 focus:ring-primary/50"
      style={{ imageRendering: 'pixelated' }}
      dangerouslySetInnerHTML={{ __html: V86_HTML_STRUCTURE }}
      tabIndex={0}
      onMouseEnter={(e) => {
        // Also ensure window itself has focus, as we are in an iframe
        window.focus();
        e.currentTarget.focus();
      }}
      onClick={(e) => {
        window.focus();
        e.currentTarget.focus();
      }}
    />
  );
});

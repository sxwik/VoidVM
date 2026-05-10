import React from 'react';

interface V86ScreenProps {
  screenRef: React.RefObject<HTMLDivElement | null>;
}

// v86 expects to find a div for text mode and a canvas for graphical mode 
// inside the container. We provide them raw here and let v86 do its DOM updates.
const V86_HTML_STRUCTURE = `
  <div style="white-space: pre; font: 14px monospace; line-height: 14px; display: none; color: white;"></div>
  <canvas style="display: none"></canvas>
`;

export const V86Screen: React.FC<V86ScreenProps> = React.memo(({ screenRef }) => {
  return (
    <div 
      ref={screenRef} 
      className="bg-black w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden relative"
      style={{ imageRendering: 'pixelated' }}
      dangerouslySetInnerHTML={{ __html: V86_HTML_STRUCTURE }}
    />
  );
});

import React, { useState, useRef } from 'react';

interface ZoomViewerProps {
  src: string;
  alt: string;
}

export const ZoomViewer: React.FC<ZoomViewerProps> = ({ src, alt }) => {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate cursor percentage coordinates
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${src})`,
      backgroundSize: '220%' // Zoom factor
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square bg-[#0D0D0D] border border-gold-primary/10 rounded flex items-center justify-center overflow-hidden cursor-zoom-in group"
    >
      <img 
        src={src} 
        alt={alt}
        className="max-h-[90%] max-w-[90%] object-contain select-none transition-opacity duration-300 group-hover:opacity-40"
      />

      {/* Magnified zoom layer */}
      <div 
        style={zoomStyle}
        className="absolute inset-0 pointer-events-none bg-no-repeat bg-[#0D0D0D] transition-opacity duration-150 rounded"
      />

      {/* Zoom Helper Alert */}
      <div className="absolute top-4 right-4 text-[10px] uppercase font-body tracking-wider text-gold-light bg-black/50 border border-gold-primary/20 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
        Hover to Zoom
      </div>
    </div>
  );
};
export default ZoomViewer;

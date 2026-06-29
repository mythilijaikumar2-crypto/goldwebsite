import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, MoveHorizontal } from 'lucide-react';

interface Image360Props {
  images: string[]; // Requires exactly 8 images for 8 angles
}

export const Image360: React.FC<Image360Props> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startIdx = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback if we don't have exactly 8 images
  const safeImages = images.slice(0, 8);
  const totalFrames = safeImages.length;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
    startIdx.current = currentIndex;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diffX = clientX - startX.current;
    
    // Sensitivity factor: drag 40px to rotate 1 frame
    const sensitivity = 30;
    const offset = Math.floor(diffX / sensitivity);
    
    // Calculate new index wrapping around
    let newIndex = (startIdx.current - offset) % totalFrames;
    if (newIndex < 0) {
      newIndex = totalFrames + newIndex;
    }
    
    setCurrentIndex(newIndex);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };
    const handleGlobalEnd = () => {
      handleEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
    };
  }, [isDragging, currentIndex]);

  return (
    <div className="relative w-full aspect-square bg-[#0D0D0D] border border-gold-primary/10 rounded flex items-center justify-center overflow-hidden group select-none">
      {/* 360 Indicator Badge */}
      <div className="absolute top-4 left-4 z-10 bg-luxury-bg/80 border border-gold-primary/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
        <RotateCw className="w-3.5 h-3.5 text-gold-primary animate-spin" style={{ animationDuration: '4s' }} />
        <span className="text-[10px] uppercase font-body tracking-wider text-gold-light font-semibold">360° Interactive</span>
      </div>

      {/* Main Image View */}
      <div 
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <img 
          src={safeImages[currentIndex]} 
          alt={`Jewellery 360 View - Frame ${currentIndex + 1}`}
          className="max-h-[90%] max-w-[90%] object-contain select-none pointer-events-none transition-all duration-75"
        />
      </div>

      {/* Drag Tutorial Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 text-[11px] font-body tracking-widest text-gold-light uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
          <MoveHorizontal className="w-3.5 h-3.5 text-gold-primary animate-pulse" />
          <span>Drag to Rotate</span>
        </div>
      </div>

      {/* Angle dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {safeImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'bg-gold-primary scale-125 shadow-[0_0_8px_#D4AF37]' 
                : 'bg-neutral-700 hover:bg-neutral-500'
            }`}
            aria-label={`Frame ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
export default Image360;

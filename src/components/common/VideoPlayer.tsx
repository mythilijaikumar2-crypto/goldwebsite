import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, posterUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration || 0;
    const current = videoRef.current.currentTime || 0;
    setProgress(duration > 0 ? (current / duration) * 100 : 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * (videoRef.current.duration || 0);
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Hide controls after 2.5s of inactivity
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  return (
    <div 
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded border border-gold-primary/10 overflow-hidden group"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        loop
        playsInline
        onTimeUpdate={handleProgress}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Cinematic Ambient Backdrop Shadow */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Play/Pause Large Center Button */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center rounded-full bg-gold-primary text-black hover:bg-gold-light hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          aria-label="Play Video"
        >
          <Play className="w-8 h-8 fill-black stroke-black translate-x-0.5" />
        </button>
      )}

      {/* Luxury Styled Control Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 p-4 flex flex-col gap-2 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Custom Progress Bar */}
        <div className="flex items-center w-full">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-gold-primary [&::-webkit-slider-runnable-track]:bg-neutral-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-primary"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-gold-primary transition" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-5 h-5 fill-white stroke-white" /> : <Play className="w-5 h-5 fill-white stroke-white" />}
            </button>

            <button onClick={toggleMute} className="hover:text-gold-primary transition" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleFullscreen} className="hover:text-gold-primary transition" aria-label="Fullscreen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoPlayer;

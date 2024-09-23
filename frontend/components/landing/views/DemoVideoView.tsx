import { useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

export function DemoVideoView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-auto rounded-lg shadow-lg"
        muted
        playsInline
        onClick={togglePlay}
      >
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30"
          onClick={togglePlay}
        >
          <div className="bg-black bg-opacity-50 rounded-full p-4">
            <FaPlay className="text-white text-4xl" />
          </div>
        </div>
      )}
    </div>
  );
}
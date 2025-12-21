// src/components/VideoBackground.jsx
// ============================================================================

import React from 'react';

const VideoBackground = ({ videoSrc, videoRef, onVideoEnd, isMuted }) => {
  return (
    <video
      ref={videoRef}
      className="absolute top-0 left-0 min-w-full min-h-full"
      style={{
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: 0
      }}
      muted={isMuted}
      playsInline
      onEnded={onVideoEnd}
    >
      <source src={videoSrc} type="video/mp4" />
      Tu navegador no soporta el tag de video.
    </video>
  );
};

export default VideoBackground;
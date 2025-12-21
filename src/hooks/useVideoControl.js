// ============================================================================
// src/hooks/useVideoControl.js
// ============================================================================

import { useState, useRef, useEffect, useCallback } from 'react';

export const useVideoControl = (videoSrc) => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    console.log('🎬 Cargando video:', videoSrc);
    setVideoEnded(false);
    setVideoError(null);
    
    if (videoRef.current) {
      // Agregar event listeners para debugging
      const video = videoRef.current;
      
      const handleLoadStart = () => console.log('📥 Video: loadstart');
      const handleLoadedMetadata = () => console.log('📊 Video: metadata cargada');
      const handleLoadedData = () => console.log('📦 Video: data cargada');
      const handleCanPlay = () => console.log('▶️ Video: puede reproducir');
      const handlePlaying = () => console.log('🎥 Video: reproduciendo');
      const handleError = (e) => {
        console.error('❌ Error de video:', e);
        setVideoError('Error al cargar el video');
      };
      
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);
      
      video.load();
      
      // Intentar reproducir
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Video iniciado correctamente');
          })
          .catch(err => {
            console.error('⚠️ Autoplay bloqueado:', err);
            setVideoError('Click para reproducir el video');
          });
      }
      
      // Cleanup
      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc]);

  const handleVideoEnd = useCallback(() => {
    console.log('🏁 Video terminado');
    setVideoEnded(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = videoRef.current.duration - 0.1;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  const restartVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
    }
  }, []);

  const skipVideo = useCallback(() => {
    console.log('⏩ Saltando video');
    setVideoEnded(true);
  }, []);

  return {
    videoRef,
    videoEnded,
    isMuted,
    videoError,
    handleVideoEnd,
    toggleMute,
    restartVideo,
    skipVideo,
  };
};
// ============================================================================
// src/pages/GamePage.jsx
// ============================================================================

import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useVideoControl } from '../hooks/useVideoControl';
import VideoBackground from '../components/VideoBackground';
import MuteButton from '../components/MuteButton';
import CharacterSheet from '../components/CharacterSheet';
import NarrativeBox from '../components/NarrativeBox';
import ChoiceButton from '../components/ChoiceButton';
import LoadingIndicator from '../components/LoadingIndicator';
import CharacterCreation from '../components/CharacterCreation';
import { SkipForward, Play } from 'lucide-react';

const GamePage = () => {
  const [showCharSheet, setShowCharSheet] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const {
    gameState,
    narrative,
    options,
    isGameOver,
    loading,
    error,
    createCharacter,
    makeChoice,
    resetGame,
  } = useGameState();

  // Mapeo de entradas a videos
  const getVideoForEntry = (entryId) => {
    const videoMap = {
      'START': '/clips/scene__1.mp4',
      'ADVENTUREBEGINS': '/clips/scene__1.mp4',
      'BREWSKI': '/clips/scene__2.mp4',
      'KEEPGOING': '/clips/scene__3.mp4',
      'QUESTCONVO': '/clips/scene__2.mp4',
      'REPLENISH': '/clips/scene__2.mp4',
      'FORESTENTRY': '/clips/scene__1.mp4',
      'CHALLENGE': '/clips/scene__1.mp4',
      'HIDEAWAY': '/clips/scene__1.mp4',
      'VICTORY': '/clips/scene__1.mp4',
      'DEATH': '/clips/scene__3.mp4',
    };
    return videoMap[entryId] || '/clips/scene__1.mp4';
  };

  const currentVideo = gameState 
    ? getVideoForEntry(gameState.currentEntry)
    : '/clips/scene__1.mp4';

  const {
    videoRef,
    videoEnded,
    isMuted,
    videoError,
    handleVideoEnd,
    toggleMute,
    skipVideo,
  } = useVideoControl(currentVideo);

  const handleCreateCharacter = async (name, charClass) => {
    try {
      await createCharacter(name, charClass);
    } catch (err) {
      console.error('Error al crear personaje:', err);
    }
  };

  const handleChoice = async (choiceIndex) => {
    setIsTransitioning(true);
    setVideoPlaying(false);
    try {
      await makeChoice(choiceIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    } catch (err) {
      console.error('Error al procesar elección:', err);
      setIsTransitioning(false);
    }
  };

  const handleRestart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      resetGame();
      setIsTransitioning(false);
      setVideoPlaying(false);
    }, 800);
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          console.log('✅ Video reproducido manualmente');
          setVideoPlaying(true);
        })
        .catch(err => {
          console.error('❌ Error al reproducir:', err);
        });
    }
  };

  // Si no hay gameState, mostrar creación de personaje
  if (!gameState) {
    return (
      <CharacterCreation
        onCreateCharacter={handleCreateCharacter}
        loading={loading}
        error={error}
      />
    );
  }

  const getSceneTitle = () => {
    const titles = {
      'START': 'EL ESCUDERO DEL CABALLERO DE LA MUERTE',
      'ADVENTUREBEGINS': 'LA AVENTURA COMIENZA',
      'BREWSKI': 'LA TABERNA DEL CAMINO',
      'KEEPGOING': 'EL CAMINO CONTINÚA',
      'QUESTCONVO': 'RUMORES DEL CABALLERO',
      'REPLENISH': 'DESCANSO MERECIDO',
      'FORESTENTRY': 'EL BOSQUE WEATHERCOTE',
      'CHALLENGE': 'ENFRENTAMIENTO',
      'HIDEAWAY': 'SIGILO Y OBSERVACIÓN',
      'VICTORY': '¡VICTORIA!',
      'DEATH': 'GAME OVER',
    };
    return titles[gameState.currentEntry] || 'AVENTURA';
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video de fondo */}
      <VideoBackground
        videoSrc={currentVideo}
        videoRef={videoRef}
        onVideoEnd={handleVideoEnd}
        isMuted={isMuted}
      />

      {/* Overlay oscuro */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
          videoEnded ? 'opacity-60' : 'opacity-30'
        }`}
        style={{ zIndex: 10 }}
      />

      {/* Botón de mute */}
      <MuteButton isMuted={isMuted} onToggle={toggleMute} />

      {/* Botón de Skip Video */}
      {!videoEnded && (
        <button
          onClick={skipVideo}
          className="absolute top-6 right-20 z-50 bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full transition-all backdrop-blur-sm border border-amber-700"
          aria-label="Saltar video"
        >
          <SkipForward className="w-6 h-6 text-amber-300" />
        </button>
      )}

      {/* Hoja de personaje */}
      <CharacterSheet
        character={gameState?.character}
        isOpen={showCharSheet}
        onToggle={() => setShowCharSheet(!showCharSheet)}
      />

      {/* Botón PLAY grande en el centro */}
      {!videoEnded && !videoPlaying && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer"
          onClick={handlePlayVideo}
        >
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-full border-4 border-amber-700 hover:border-amber-500 hover:scale-110 transition-all">
            <Play className="w-24 h-24 text-amber-300" fill="currentColor" />
          </div>
          <p className="text-amber-200 text-xl font-serif text-center mt-4">
            Click para reproducir
          </p>
        </div>
      )}

      {/* Error de video */}
      {videoError && (
        <div 
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-900 bg-opacity-90 backdrop-blur-md px-8 py-4 rounded-lg border-2 border-red-500">
            <p className="text-red-200 text-lg font-serif text-center">
              {videoError}
            </p>
            <button
              onClick={skipVideo}
              className="mt-4 w-full py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white font-bold transition-all"
            >
              Continuar sin video
            </button>
          </div>
        </div>
      )}

      {/* Mensaje "Observa la escena..." solo cuando está reproduciendo */}
      {!videoEnded && videoPlaying && !videoError && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"
          style={{ zIndex: 30 }}
        >
          <div className="bg-black bg-opacity-70 backdrop-blur-md px-8 py-4 rounded-lg border-2 border-amber-700">
            <p className="text-amber-200 text-lg font-serif text-center">
              Observa la escena...
            </p>
          </div>
        </div>
      )}

      {/* Contenido principal - solo visible cuando el video termina */}
      <div 
        className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-1000 ${
          videoEnded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="max-w-4xl w-full space-y-8">
          <NarrativeBox
            title={getSceneTitle()}
            description={narrative}
          />

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-900 bg-opacity-70 backdrop-blur-md rounded-lg p-4 border border-red-500">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Opciones de elección */}
          {!isGameOver && (
            <div className="space-y-4">
              {options.map((option) => (
                <ChoiceButton
                  key={option.optionIndex}
                  text={option.optionText_}
                  onClick={() => handleChoice(option.optionIndex)}
                  disabled={loading || isTransitioning}
                />
              ))}
            </div>
          )}

          {/* Game Over - Opciones de reinicio */}
          {isGameOver && (
            <div className="space-y-4">
              <div className="bg-amber-900 bg-opacity-50 backdrop-blur-md rounded-lg p-6 border-2 border-amber-600 text-center">
                <p className="text-amber-100 text-xl font-serif mb-4">
                  {gameState.character.charHP <= 0 
                    ? '¡Has caído en combate!'
                    : '¡Aventura completada!'}
                </p>
                <div className="grid grid-cols-2 gap-4 text-amber-200 text-sm">
                  <div>
                    <p className="font-bold">XP Ganada:</p>
                    <p>{gameState.character.charXP}</p>
                  </div>
                  <div>
                    <p className="font-bold">Pistas:</p>
                    <p>{gameState.character.charClues.length}</p>
                  </div>
                  <div>
                    <p className="font-bold">Objetos:</p>
                    <p>{gameState.character.charInventory.length}</p>
                  </div>
                  <div>
                    <p className="font-bold">Escenas:</p>
                    <p>{gameState.visitedEntries.length}</p>
                  </div>
                </div>
              </div>

              <ChoiceButton
                text="Comenzar Nueva Aventura"
                onClick={handleRestart}
                disabled={loading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <LoadingIndicator text="Procesando..." />
      )}

      {/* Indicador "Reproduciendo..." */}
      {!videoEnded && videoPlaying && !loading && !videoError && (
        <LoadingIndicator text="Reproduciendo..." />
      )}

      {/* Transición entre escenas */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-800 pointer-events-none ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 60 }}
      />
    </div>
  );
};

export default GamePage;
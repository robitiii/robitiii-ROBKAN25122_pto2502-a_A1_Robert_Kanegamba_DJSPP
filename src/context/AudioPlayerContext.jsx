import { createContext, useEffect, useRef, useState } from "react";

export const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isPlaying) return;
      event.preventDefault();
      event.returnValue = "";
    };

    if (isPlaying) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack.audioUrl;
    setCurrentTime(0);
    setDuration(0);

    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to play audio", error);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [currentTrack]);

  const playEpisode = (track) => {
    setCurrentTrack(track);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.error("Failed to resume audio", error);
      });
  };

  const seek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const value = {
    audioRef,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    setCurrentTime,
    setDuration,
    playEpisode,
    pause,
    resume,
    seek,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

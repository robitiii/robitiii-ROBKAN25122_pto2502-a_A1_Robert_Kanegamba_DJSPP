import { useContext } from "react";
import styles from "./GlobalAudioPlayer.module.css";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function GlobalAudioPlayer() {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    setCurrentTime,
    setDuration,
    pause,
    resume,
    seek,
  } = useContext(AudioPlayerContext);

  if (!currentTrack) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleSeek = (event) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    seek(value);
  };

  return (
    <div className={styles.playerBar}>
      <div className={styles.infoSection}>
        {currentTrack.image && (
          <img
            src={currentTrack.image}
            alt={currentTrack.showTitle}
            className={styles.thumbnail}
          />
        )}
        <div className={styles.titles}>
          <div className={styles.showTitle}>{currentTrack.showTitle}</div>
          <div className={styles.episodeTitle}>{currentTrack.episodeTitle}</div>
        </div>
      </div>

      <div className={styles.controlsSection}>
        <button
          type="button"
          className={styles.playPauseButton}
          onClick={handleTogglePlay}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className={styles.progressWrapper}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={duration ? currentTime : 0}
            onChange={handleSeek}
            className={styles.progress}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          setDuration(audioRef.current.duration || 0);
        }}
      />
    </div>
  );
}

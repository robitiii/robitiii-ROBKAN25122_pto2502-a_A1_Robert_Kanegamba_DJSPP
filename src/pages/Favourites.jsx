import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FavouritesContext } from "../context/FavouritesContext";
import { AudioPlayerContext } from "../context/AudioPlayerContext";
import styles from "./Favourites.module.css";

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

export default function Favourites() {
  const { favourites, toggleFavourite } = useContext(FavouritesContext);
  const { playEpisode, pause, currentTrack, isPlaying } =
    useContext(AudioPlayerContext);
  const [sortKey, setSortKey] = useState("date-desc");
  const [showFilter, setShowFilter] = useState("all");

  if (!favourites.length) {
    return (
      <main className={styles.main}>
        <Link to="/" className={styles.backButton}>
          ← Back
        </Link>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Favourite Episodes</h1>
          <p className={styles.pageSubtitle}>
            Your saved episodes from all shows.
          </p>
        </header>
        <p className={styles.empty}>You have no favourite episodes yet.</p>
      </main>
    );
  }

  const sorted = [...favourites];

  switch (sortKey) {
    case "title-asc":
      sorted.sort((a, b) => a.episodeTitle.localeCompare(b.episodeTitle));
      break;
    case "title-desc":
      sorted.sort((a, b) => b.episodeTitle.localeCompare(a.episodeTitle));
      break;
    case "date-asc":
      sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      break;
    case "date-desc":
    default:
      sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      break;
  }

  const showOptions = useMemo(() => {
    const map = new Map();
    favourites.forEach((fav) => {
      const key = String(fav.showId);
      if (!map.has(key)) {
        map.set(key, fav.showTitle);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [favourites]);

  const filteredByShow =
    showFilter === "all"
      ? sorted
      : sorted.filter((fav) => String(fav.showId) === showFilter);

  const groupList = Object.values(
    filteredByShow.reduce((acc, fav) => {
      const key = String(fav.showId);
      if (!acc[key]) {
        acc[key] = {
          showId: fav.showId,
          showTitle: fav.showTitle,
          items: [],
        };
      }
      acc[key].items.push(fav);
      return acc;
    }, {}),
  );

  return (
    <main className={styles.main}>
      <Link to="/" className={styles.backButton}>
        ← Back
      </Link>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Favourite Episodes</h1>
        <p className={styles.pageSubtitle}>
          Your saved episodes from all shows.
        </p>
      </header>

      <div className={styles.controlsRow}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Sort by:</span>
          <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            <option value="date-desc">Newest Added</option>
            <option value="date-asc">Oldest Added</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Show:</span>
          <select
            className={styles.showSelect}
            value={showFilter}
            onChange={(event) => setShowFilter(event.target.value)}
          >
            <option value="all">All Shows</option>
            {showOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {groupList.map((group) => (
        <section key={group.showId} className={styles.showSection}>
          <div className={styles.showHeader}>
            <h3 className={styles.showTitle}>{group.showTitle}</h3>
            <span className={styles.showCount}>
              {group.items.length} episode
              {group.items.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className={styles.list}>
            {group.items.map((fav) => (
              <li key={fav.id} className={styles.itemRow}>
                <div className={styles.itemLeft}>
                  <div className={styles.coverBox}>
                    {fav.image && (
                      <img
                        src={fav.image}
                        alt={fav.showTitle}
                        className={styles.coverImage}
                      />
                    )}
                  </div>
                  <div className={styles.itemMain}>
                    <div className={styles.itemTitle}>{fav.episodeTitle}</div>
                    <div className={styles.itemMetaTop}>
                      Season {fav.seasonNumber} · Episode {fav.episodeNumber}
                    </div>
                    {fav.description && (
                      <div className={styles.itemDescription}>{fav.description}</div>
                    )}
                    <div className={styles.itemMetaBottom}>
                      Added {formatDateTime(fav.addedAt)}
                    </div>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.itemHeart}
                    onClick={() =>
                      toggleFavourite({
                        showId: fav.showId,
                        seasonIndex: fav.seasonIndex,
                        episodeIndex: fav.episodeIndex,
                        showTitle: fav.showTitle,
                        seasonNumber: fav.seasonNumber,
                        episodeNumber: fav.episodeNumber,
                        episodeTitle: fav.episodeTitle,
                        image: fav.image,
                        description: fav.description,
                        audioUrl: fav.audioUrl,
                      })
                    }
                    aria-label="Remove episode from favourites"
                  >
                    ♥
                  </button>
                  <button
                    type="button"
                    className={styles.playButton}
                    onClick={() => {
                      const isActive =
                        currentTrack &&
                        currentTrack.showId === fav.showId &&
                        currentTrack.seasonIndex === fav.seasonIndex &&
                        currentTrack.episodeIndex === fav.episodeIndex;

                      if (isActive && isPlaying) {
                        pause();
                        return;
                      }

                      playEpisode({
                        showId: fav.showId,
                        showTitle: fav.showTitle,
                        seasonIndex: fav.seasonIndex,
                        episodeIndex: fav.episodeIndex,
                        episodeTitle: fav.episodeTitle,
                        audioUrl:
                          fav.audioUrl ||
                          "https://podcast-api.netlify.app/placeholder-audio.mp3",
                        image: fav.image,
                      });
                    }}
                  >
                    {currentTrack &&
                    currentTrack.showId === fav.showId &&
                    currentTrack.seasonIndex === fav.seasonIndex &&
                    currentTrack.episodeIndex === fav.episodeIndex &&
                    isPlaying
                      ? "Pause"
                      : "Play"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

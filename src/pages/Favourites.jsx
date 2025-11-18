import { useContext, useState } from "react";
import { FavouritesContext } from "../context/FavouritesContext";
import styles from "./Favourites.module.css";

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

export default function Favourites() {
  const { favourites, toggleFavourite } = useContext(FavouritesContext);
  const [sortKey, setSortKey] = useState("date-desc");

  if (!favourites.length) {
    return (
      <main className={styles.main}>
        <h2 className={styles.heading}>Favourites</h2>
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

  const groupsByShow = sorted.reduce((acc, fav) => {
    const key = String(fav.showId);
    if (!acc[key]) {
      acc[key] = { showId: fav.showId, showTitle: fav.showTitle, items: [] };
    }
    acc[key].items.push(fav);
    return acc;
  }, {});

  const groupList = Object.values(groupsByShow);

  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Favourites</h2>
        <select
          className={styles.sortSelect}
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value)}
        >
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="date-desc">Date added (newest)</option>
          <option value="date-asc">Date added (oldest)</option>
        </select>
      </div>

      {groupList.map((group) => (
        <section key={group.showId} className={styles.showSection}>
          <h3 className={styles.showTitle}>{group.showTitle}</h3>
          <ul className={styles.list}>
            {group.items.map((fav) => (
              <li key={fav.id} className={styles.itemRow}>
                <div className={styles.itemMain}>
                  <div className={styles.itemTitle}>{fav.episodeTitle}</div>
                  <div className={styles.itemMeta}>
                    <span>
                      Season {fav.seasonNumber} · Episode {fav.episodeNumber}
                    </span>
                    <span>Added {formatDateTime(fav.addedAt)}</span>
                  </div>
                </div>
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
                    })
                  }
                >
                  ♥
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

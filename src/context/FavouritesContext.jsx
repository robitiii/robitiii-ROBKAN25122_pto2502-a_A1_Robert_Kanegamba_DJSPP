import { createContext, useEffect, useState } from "react";

export const FavouritesContext = createContext();

const STORAGE_KEY = "favourites";

function makeId(showId, seasonIndex, episodeIndex) {
  return `${showId}-${seasonIndex}-${episodeIndex}`;
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setFavourites(parsed);
      }
    } catch (error) {
      console.error("Failed to load favourites from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (error) {
      console.error("Failed to save favourites to localStorage", error);
    }
  }, [favourites]);

  const toggleFavourite = (meta) => {
    const id = makeId(meta.showId, meta.seasonIndex, meta.episodeIndex);

    setFavourites((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }

      const favourite = {
        id,
        showId: meta.showId,
        showTitle: meta.showTitle,
        seasonIndex: meta.seasonIndex,
        seasonNumber: meta.seasonNumber,
        episodeIndex: meta.episodeIndex,
        episodeNumber: meta.episodeNumber,
        episodeTitle: meta.episodeTitle,
        image: meta.image,
        addedAt: new Date().toISOString(),
      };

      return [...prev, favourite];
    });
  };

  const isFavourite = ({ showId, seasonIndex, episodeIndex }) => {
    const id = makeId(showId, seasonIndex, episodeIndex);
    return favourites.some((item) => item.id === id);
  };

  const value = {
    favourites,
    toggleFavourite,
    isFavourite,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

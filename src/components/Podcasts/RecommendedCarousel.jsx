import { useContext, useMemo } from "react";
import { PodcastContext } from "../../context/PodcastContext";
import PodcastCard from "./PodcastCard";
import styles from "./RecommendedCarousel.module.css";

export default function RecommendedCarousel() {
  const { allPodcasts, loading, error } = useContext(PodcastContext);

  const recommended = useMemo(() => {
    if (!allPodcasts || !allPodcasts.length) {
      return [];
    }

    return [...allPodcasts]
      .sort((a, b) => new Date(b.updated) - new Date(a.updated))
      .slice(0, 10);
  }, [allPodcasts]);

  if (loading || error || !recommended.length) {
    return null;
  }

  return (
    <section className={styles.carousel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recommended Shows</h2>
        <p className={styles.subtitle}>Recently updated shows you might like.</p>
      </div>
      <div className={styles.trackWrapper}>
        <div className={styles.track}>
          {recommended.map((podcast) => (
            <div key={podcast.id} className={styles.item}>
              <PodcastCard podcast={podcast} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

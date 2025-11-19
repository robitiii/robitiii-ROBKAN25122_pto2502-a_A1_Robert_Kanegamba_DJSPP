import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={styles.appHeader}>
      <h1>
        {" "}
        <Link to="/">🎙️ Podcast App</Link>
      </h1>
      <nav className={styles.nav}>
        <Link
          to="/favourites"
          className={`${styles.navLink} ${styles.navHeart}`}
          aria-label="View favourite episodes"
        >
          ♥
        </Link>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Toggle color theme"
        >
          {theme === "light" ? "🌞" : "🌙"}
        </button>
      </nav>
    </header>
  );
}

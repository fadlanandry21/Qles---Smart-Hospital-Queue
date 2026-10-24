import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './ThemeToggle.css';

/**
 * Persisted Light/Dark Theme Toggle:
 * - Stores theme in localStorage ('qless_theme')
 * - Applies attribute [data-theme="dark" | "light"] to <html>
 * - Animated icon switch with accessible label
 */
export function ThemeToggle({ className = '' }) {
  // Check system preference if no localStorage value exists yet
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useLocalStorage('qless_theme', prefersDark ? 'dark' : 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      title={isDark ? 'Mode Terang (Light Theme)' : 'Mode Gelap (Dark Theme)'}
    >
      <div className={`theme-toggle-icons ${isDark ? 'is-dark' : 'is-light'}`}>
        <Sun className="icon-sun" size={18} />
        <Moon className="icon-moon" size={18} />
      </div>
    </button>
  );
}

export default ThemeToggle;

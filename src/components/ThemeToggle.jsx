import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button type="button" onClick={onToggle} className="icon-btn border border-zinc-200 dark:border-zinc-700" aria-label={label} title={label}>
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </button>
  );
}

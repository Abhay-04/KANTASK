import { CalendarDays, Menu, Plus } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { formatLongDate, getTodayISO } from '../utils/taskHelpers';

export default function Header({ onOpenMenu, showSearch, searchQuery, onSearchChange, theme, onToggleTheme, onAddTask }) {
  const today = getTodayISO();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md lg:sticky lg:top-0 lg:z-30 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onOpenMenu} className="icon-btn -ml-2 lg:hidden" aria-label="Open navigation">
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={today}>{formatLongDate(today)}</time>
          </p>
          <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight sm:text-xl">My Workspace</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your tasks and stay productive.</p>
        </div>

        {/* On mobile the search moves to its own full-width row */}
        {showSearch && (
          <div className="order-last w-full md:order-0 md:w-64 lg:w-72">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>
        )}

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <button type="button" onClick={onAddTask} className="btn btn-primary">
          <Plus className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Add Task</span>
        </button>
      </div>
    </header>
  );
}

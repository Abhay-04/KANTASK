import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="task-search" className="sr-only">
        Search tasks by title
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
      <input
        id="task-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks..."
        autoComplete="off"
        // Hide the browser's built-in clear icon; we render our own button
        className="form-input pr-9 pl-9 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="icon-btn absolute top-1/2 right-1 size-7 -translate-y-1/2"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

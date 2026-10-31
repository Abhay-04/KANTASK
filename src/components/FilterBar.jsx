import { FilterX } from 'lucide-react';
import Select from './Select';
import { PRIORITIES, STATUSES } from '../utils/taskHelpers';

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  ...PRIORITIES.map((priority) => ({ value: priority, label: `${priority} priority` })),
];

const STATUS_OPTIONS = [{ value: 'all', label: 'All statuses' }, ...STATUSES];

export default function FilterBar({
  title,
  priorityFilter,
  statusFilter,
  onPriorityChange,
  onStatusChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
          Showing <span className="font-medium text-zinc-900 tabular-nums dark:text-zinc-100">{resultCount}</span> of{' '}
          <span className="tabular-nums">{totalCount}</span> tasks
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="priority-filter" className="sr-only">
          Filter by priority
        </label>
        <Select
          id="priority-filter"
          value={priorityFilter}
          onChange={onPriorityChange}
          options={PRIORITY_OPTIONS}
          className="min-w-0 flex-1 sm:w-44 sm:flex-none"
        />

        <label htmlFor="status-filter" className="sr-only">
          Filter by status
        </label>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
          className="min-w-0 flex-1 sm:w-40 sm:flex-none"
        />

        {hasActiveFilters && (
          <button type="button" onClick={onClearFilters} className="btn btn-secondary w-full sm:w-auto">
            <FilterX className="size-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

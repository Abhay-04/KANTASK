// Small presentational pieces shared by TaskCard (board view) and TaskList (list view)
import { CalendarDays, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { STATUSES, formatDueDate, getDueDateState } from '../utils/taskHelpers';
import { PRIORITY_DOT, STATUS_META } from '../utils/taskStyles';

const PRIORITY_BADGE = {
  High: 'bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  Low: 'bg-zinc-50 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-600/40',
};

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_BADGE[priority]}`}>
      <span className={`size-1.5 rounded-full ${PRIORITY_DOT[priority]}`} aria-hidden="true" />
      {priority}
    </span>
  );
}

const DUE_DATE_STYLES = {
  overdue: 'text-rose-600 dark:text-rose-400',
  today: 'text-amber-600 dark:text-amber-400',
  default: 'text-zinc-500 dark:text-zinc-400',
};

export function DueDate({ dueDate, status }) {
  if (!dueDate) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        No due date
      </span>
    );
  }

  const state = getDueDateState(dueDate, status);
  const label = state === 'today' ? 'Due today' : formatDueDate(dueDate);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${DUE_DATE_STYLES[state]}`}>
      <CalendarDays className="size-3.5" aria-hidden="true" />
      <time dateTime={dueDate}>
        {state === 'overdue' && 'Overdue · '}
        {label}
      </time>
    </span>
  );
}

// Shows the current status and doubles as a status changer.
// This is the keyboard/touch alternative to drag-and-drop (native DnD doesn't work on most mobile browsers).
export function StatusSelect({ value, onChange, taskTitle }) {
  const { icon: Icon, iconClass, pillClass } = STATUS_META[value];

  return (
    <div className="relative inline-flex">
      <Icon className={`pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 ${iconClass}`} aria-hidden="true" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={`Status of "${taskTitle}"`}
        className={`cursor-pointer appearance-none rounded-md py-1 pr-6 pl-7 text-xs font-medium transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:hover:brightness-125 ${pillClass}`}
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 opacity-60" aria-hidden="true" />
    </div>
  );
}

export function TaskActions({ task, onEdit, onDelete }) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onEdit(task)}
        className="icon-btn size-8"
        aria-label={`Edit "${task.title}"`}
        title="Edit task"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        className="icon-btn size-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        aria-label={`Delete "${task.title}"`}
        title="Delete task"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

import { LayoutList } from 'lucide-react';
import { countByStatus } from '../utils/taskHelpers';
import { STATUS_META } from '../utils/taskStyles';

// Statistics are derived from the full task list on every render — never stored separately,
// so they can't get out of sync after add / edit / delete / move.
export default function DashboardStats({ tasks }) {
  const total = tasks.length;
  const todo = countByStatus(tasks, 'todo');
  const inProgress = countByStatus(tasks, 'in-progress');
  const completed = countByStatus(tasks, 'completed');
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      hint: `${completionRate}% completed`,
      icon: LayoutList,
      tileClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    },
    {
      label: 'Todo',
      value: todo,
      hint: 'Not started yet',
      icon: STATUS_META.todo.icon,
      tileClass: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
    },
    {
      label: 'In Progress',
      value: inProgress,
      hint: 'Being worked on',
      icon: STATUS_META['in-progress'].icon,
      tileClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    },
    {
      label: 'Completed',
      value: completed,
      hint: 'Finished tasks',
      icon: STATUS_META.completed.icon,
      tileClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
  ];

  return (
    <section aria-label="Task statistics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {stats.map(({ label, value, hint, icon: Icon, tileClass }) => (
        <div
          key={label}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
            <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${tileClass}`}>
              <Icon className="size-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</p>
          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
        </div>
      ))}
    </section>
  );
}

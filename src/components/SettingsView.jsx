import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

const CONFIRM_CONTENT = {
  reset: {
    title: 'Restore sample tasks?',
    message: 'Your current tasks will be replaced with the sample tasks. This action cannot be undone.',
    confirmLabel: 'Restore samples',
  },
  clear: {
    title: 'Delete all tasks?',
    message: 'Every task stored in this browser will be permanently deleted. This action cannot be undone.',
    confirmLabel: 'Delete all',
  },
};

export default function SettingsView({ theme, onThemeChange, taskCount, onResetTasks, onClearTasks }) {
  const [pendingAction, setPendingAction] = useState(null); // 'reset' | 'clear' | null

  const handleConfirm = () => {
    if (pendingAction === 'reset') onResetTasks();
    if (pendingAction === 'clear') onClearTasks();
    setPendingAction(null);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-base font-semibold">Settings</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage appearance and the data stored in this browser.</p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold">Appearance</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Choose how KanTask looks to you.</p>

        <div className="mt-4 grid max-w-xs grid-cols-2 gap-2" role="group" aria-label="Theme">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onThemeChange(value)}
                aria-pressed={isActive}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold">Data</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tasks are saved in your browser&apos;s localStorage. You currently have{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{taskCount}</span> {taskCount === 1 ? 'task' : 'tasks'}.
        </p>

        <div className="mt-4 divide-y divide-zinc-100 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Restore sample tasks</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Replace your tasks with the demo data.</p>
            </div>
            <button type="button" onClick={() => setPendingAction('reset')} className="btn btn-secondary">
              Restore
            </button>
          </div>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Delete all tasks</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Permanently remove every task from this browser.</p>
            </div>
            <button type="button" onClick={() => setPendingAction('clear')} className="btn btn-danger" disabled={taskCount === 0}>
              Delete all
            </button>
          </div>
        </div>
      </section>

      {pendingAction && (
        <ConfirmDialog {...CONFIRM_CONTENT[pendingAction]} onConfirm={handleConfirm} onCancel={() => setPendingAction(null)} />
      )}
    </div>
  );
}

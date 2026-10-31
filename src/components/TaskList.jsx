import { ClipboardList } from 'lucide-react';
import EmptyState from './EmptyState';
import { DueDate, PriorityBadge, StatusSelect, TaskActions } from './TaskMeta';
import { sortByDueDate } from '../utils/taskHelpers';

// Same column template for the header row and every task row (md and up)
const ROW_GRID = 'md:grid md:grid-cols-[minmax(0,1fr)_6.5rem_9rem_9.5rem_4.5rem] md:items-center md:gap-4';

// "My Tasks" view: the same filtered tasks as the board, as a list sorted by due date
export default function TaskList({ tasks, onAddTask, onEditTask, onDeleteTask, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No tasks yet"
        description="Create your first task to start tracking your work."
        action={
          <button type="button" onClick={() => onAddTask()} className="btn btn-primary">
            Add Task
          </button>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div
        className={`hidden border-b border-zinc-200 bg-zinc-50/80 px-5 py-2.5 text-xs font-medium tracking-wide text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 ${ROW_GRID}`}
        aria-hidden="true"
      >
        <span>Task</span>
        <span>Priority</span>
        <span>Due date</span>
        <span>Status</span>
        <span />
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {sortByDueDate(tasks).map((task) => (
          <li
            key={task.id}
            className={`flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-zinc-50/80 sm:px-5 dark:hover:bg-zinc-800/40 ${ROW_GRID}`}
          >
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-medium ${
                  task.status === 'completed' ? 'text-zinc-500 line-through dark:text-zinc-400' : ''
                }`}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">{task.description}</p>
              )}
            </div>

            {/* On mobile these wrap in one row; `md:contents` turns them into grid cells on larger screens */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:contents">
              <div>
                <PriorityBadge priority={task.priority} />
              </div>
              <div>
                <DueDate dueDate={task.dueDate} status={task.status} />
              </div>
              <div>
                <StatusSelect value={task.status} taskTitle={task.title} onChange={(status) => onStatusChange(task.id, status)} />
              </div>
              <div className="ml-auto md:ml-0 md:flex md:justify-end">
                <TaskActions task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

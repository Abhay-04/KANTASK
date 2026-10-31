import { Droppable } from '@hello-pangea/dnd';
import { Inbox, Plus, SearchX } from 'lucide-react';
import TaskCard from './TaskCard';
import { STATUS_META } from '../utils/taskStyles';

export default function KanbanColumn({ status, tasks, hasActiveFilters, onAddTask, onEditTask, onDeleteTask, onStatusChange }) {
  const { icon: StatusIcon, iconClass } = STATUS_META[status.value];
  const headingId = `column-${status.value}`;

  return (
    // droppableId is the status, so onDragEnd knows which column a card was dropped into
    <Droppable droppableId={status.value}>
      {(provided, snapshot) => (
        <section
          aria-labelledby={headingId}
          className={`flex w-[85vw] max-w-sm shrink-0 flex-col rounded-2xl border transition-colors sm:w-80 xl:w-auto xl:max-w-xl xl:min-w-0 xl:flex-1 ${
            snapshot.isDraggingOver
              ? 'border-indigo-400 bg-indigo-50/70 ring-4 ring-indigo-500/10 dark:border-indigo-500/60 dark:bg-indigo-500/7'
              : 'border-zinc-200/80 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/40'
          }`}
        >
          <header className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-3">
            <div className="flex min-w-0 items-center gap-2">
              <StatusIcon className={`size-4 shrink-0 ${iconClass}`} aria-hidden="true" />
              <h2 id={headingId} className="truncate text-sm font-semibold">
                {status.label}
              </h2>
              <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums dark:bg-zinc-800 dark:text-zinc-300">
                {tasks.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onAddTask(status.value)}
              className="icon-btn size-8 hover:bg-zinc-200/70 dark:hover:bg-zinc-800"
              aria-label={`Add task to ${status.label}`}
              title={`Add task to ${status.label}`}
            >
              <Plus className="size-4" />
            </button>
          </header>

          {/* The drop area fills the rest of the column so cards can be dropped anywhere in it */}
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex min-h-48 flex-1 flex-col px-3 pb-3">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            ))}

            {/* Reserves space for the dragged card while it is over this column */}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center dark:border-zinc-700">
                {hasActiveFilters ? (
                  <>
                    <SearchX className="size-5 text-zinc-400" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">No matching tasks</p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Try a different search or filter.</p>
                  </>
                ) : (
                  <>
                    <Inbox className="size-5 text-zinc-400" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">No tasks yet</p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Drag a task here or</p>
                    <button
                      type="button"
                      onClick={() => onAddTask(status.value)}
                      className="mt-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      add a new task
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </Droppable>
  );
}

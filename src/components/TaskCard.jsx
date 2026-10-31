import { Draggable } from '@hello-pangea/dnd';
import { DueDate, PriorityBadge, StatusSelect, TaskActions } from './TaskMeta';

export default function TaskCard({ task, index, onEdit, onDelete, onStatusChange }) {
  const isCompleted = task.status === 'completed';

  return (
    // The library ignores drags that start on buttons/selects, so the card's actions still work
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // The drag handle is focusable (Space to lift, arrows to move); give it a short accessible name
          aria-label={`${task.title}, ${task.priority} priority`}
          // Margin instead of flex `gap`: the library measures margins to animate cards smoothly
          className={`mb-3 cursor-grab rounded-xl border bg-white p-4 transition-[box-shadow,border-color] dark:bg-zinc-900 ${
            snapshot.isDragging
              ? 'rotate-1 border-indigo-300 shadow-xl ring-2 ring-indigo-500/20 dark:border-indigo-500/60'
              : 'border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <PriorityBadge priority={task.priority} />
            <div className="-mt-1.5 -mr-2">
              <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>

          <h3
            className={`mt-2 text-sm leading-snug font-semibold break-words ${
              isCompleted ? 'text-zinc-500 line-through decoration-zinc-400 dark:text-zinc-400' : ''
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm break-words text-zinc-500 dark:text-zinc-400">{task.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <DueDate dueDate={task.dueDate} status={task.status} />
            <StatusSelect
              value={task.status}
              taskTitle={task.title}
              onChange={(status) => onStatusChange(task.id, status)}
            />
          </div>
        </article>
      )}
    </Draggable>
  );
}

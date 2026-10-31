import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { STATUSES } from '../utils/taskHelpers';

// Drag-and-drop is handled by @hello-pangea/dnd (maintained fork of react-beautiful-dnd).
// It supports mouse, touch and keyboard dragging, and tells us where the card was dropped.
export default function KanbanBoard({ tasks, statusFilter, hasActiveFilters, onAddTask, onEditTask, onDeleteTask, onMoveTask }) {
  // When filtering by status, only that column is shown
  const visibleColumns = statusFilter === 'all' ? STATUSES : STATUSES.filter((s) => s.value === statusFilter);

  const handleDragEnd = ({ draggableId, source, destination }) => {
    // Dropped outside a column, or back in the exact same spot
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // destination.index is the position among the cards shown in the target column.
    // Find the card that will sit right after the dropped one, so App can insert before it.
    const targetColumnTasks = tasks.filter(
      (task) => task.status === destination.droppableId && task.id !== draggableId,
    );
    const nextTask = targetColumnTasks[destination.index];

    onMoveTask(draggableId, destination.droppableId, nextTask?.id);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {visibleColumns.map((status) => (
          <KanbanColumn
            key={status.value}
            status={status}
            tasks={tasks.filter((task) => task.status === status.value)}
            hasActiveFilters={hasActiveFilters}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onStatusChange={onMoveTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

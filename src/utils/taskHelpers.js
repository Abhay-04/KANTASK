// Single source of truth for the board columns and their order
export const STATUSES = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const PRIORITIES = ['Low', 'Medium', 'High'];

const STATUS_VALUES = STATUSES.map((status) => status.value);

export function getStatusLabel(statusValue) {
  return STATUSES.find((status) => status.value === statusValue)?.label ?? statusValue;
}

export function generateId() {
  // crypto.randomUUID is only available in secure contexts (https / localhost)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTask({ title, description = '', priority = 'Medium', status = 'todo', dueDate = '' }) {
  return {
    id: generateId(),
    title,
    description,
    priority,
    status,
    dueDate,
    createdAt: new Date().toISOString(),
  };
}

// Changes a task's status and position. The array order is the order of cards in each column.
// The task is inserted before `beforeTaskId`, or at the end (bottom of its column) if none is given.
export function moveTask(tasks, taskId, newStatus, beforeTaskId = null) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return tasks;

  const movedTask = { ...task, status: newStatus };
  const otherTasks = tasks.filter((t) => t.id !== taskId);
  const insertIndex = otherTasks.findIndex((t) => t.id === beforeTaskId);

  if (insertIndex === -1) return [...otherTasks, movedTask];
  return [...otherTasks.slice(0, insertIndex), movedTask, ...otherTasks.slice(insertIndex)];
}

export function filterTasks(tasks, { searchQuery, priority, status }) {
  const query = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch = query === '' || task.title.toLowerCase().includes(query);
    const matchesPriority = priority === 'all' || task.priority === priority;
    const matchesStatus = status === 'all' || task.status === status;
    return matchesSearch && matchesPriority && matchesStatus;
  });
}

export function countByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status).length;
}

// Tasks without a due date go to the end
export function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31'));
}

// ---------- Validation (used when reading from localStorage) ----------

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof (task.description ?? '') === 'string' &&
    typeof (task.dueDate ?? '') === 'string' &&
    PRIORITIES.includes(task.priority) &&
    STATUS_VALUES.includes(task.status)
  );
}

export function isValidTaskList(value) {
  return Array.isArray(value) && value.every(isValidTask);
}

// ---------- Dates ----------
// Due dates are stored as "YYYY-MM-DD" strings. `new Date("2026-11-05")` is parsed as
// UTC midnight, which can show the previous day in some time zones, so we parse manually.

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO() {
  return toISODate(new Date());
}

export function parseLocalDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// "Saturday, October 31, 2026"
export function formatLongDate(isoDate) {
  return parseLocalDate(isoDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDueDate(isoDate) {
  const date = parseLocalDate(isoDate);
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: isCurrentYear ? undefined : 'numeric',
  });
}

// "YYYY-MM-DD" strings can be compared alphabetically
export function getDueDateState(dueDate, status) {
  if (!dueDate || status === 'completed') return 'default';

  const today = getTodayISO();
  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';
  return 'default';
}

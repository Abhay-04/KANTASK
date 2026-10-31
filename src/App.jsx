import { useCallback, useEffect, useState } from 'react';
import { SearchX } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import FilterBar from './components/FilterBar';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import SettingsView from './components/SettingsView';
import TaskModal from './components/TaskModal';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';

import { useLocalStorage } from './hooks/useLocalStorage';
import { createInitialTasks } from './data/initialTasks';
import { createTask, filterTasks, getStatusLabel, isValidTaskList, moveTask } from './utils/taskHelpers';

const TASKS_STORAGE_KEY = 'kantask-tasks';
const THEME_STORAGE_KEY = 'kantask-theme';

const getPreferredTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const isValidTheme = (value) => value === 'light' || value === 'dark';

export default function App() {
  // ----- Persisted state -----
  // Sample tasks are created only when nothing is stored yet (first visit)
  const [tasks, setTasks] = useLocalStorage(TASKS_STORAGE_KEY, createInitialTasks, isValidTaskList);
  const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, getPreferredTheme, isValidTheme);

  // ----- UI state -----
  const [activeView, setActiveView] = useState('board'); // 'tasks' | 'board' | 'settings'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [taskModal, setTaskModal] = useState(null); // null (closed) | { task, defaultStatus }
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ----- Derived state (computed on every render, never stored) -----
  // Filtering a few hundred tasks is cheap, so no memoization is needed
  const filters = { searchQuery, priority: priorityFilter, status: statusFilter };
  const filteredTasks = filterTasks(tasks, filters);
  const hasActiveFilters = searchQuery.trim() !== '' || priorityFilter !== 'all' || statusFilter !== 'all';
  const openTaskCount = tasks.filter((task) => task.status !== 'completed').length;

  // ----- Helpers -----
  const showToast = (message) => setToast({ id: Date.now(), message });
  const dismissToast = useCallback(() => setToast(null), []); // stable, so Toast's timer isn't reset on every render
  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  const handleNavigate = (view) => {
    setActiveView(view);
    setIsMobileNavOpen(false);
  };

  // ----- Task CRUD -----
  const openCreateModal = (status = 'todo') => setTaskModal({ task: null, defaultStatus: status });
  const openEditModal = (task) => setTaskModal({ task, defaultStatus: task.status });
  const closeTaskModal = () => setTaskModal(null);

  const handleSaveTask = (values) => {
    const editingTask = taskModal.task;

    if (editingTask) {
      setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? { ...task, ...values } : task)));
      showToast('Task updated');
    } else {
      const newTask = createTask(values);
      setTasks((prev) => [newTask, ...prev]);
      // Let the user know if the new task is hidden by the current search/filters
      const isHidden = filterTasks([newTask], filters).length === 0;
      showToast(isHidden ? 'Task created (hidden by current filters)' : 'Task created');
    }
    closeTaskModal();
  };

  // Used by drag-and-drop (status + position) and by the status dropdown (status only -> bottom of column)
  const handleMoveTask = (taskId, newStatus, beforeTaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) => moveTask(prev, taskId, newStatus, beforeTaskId));
    if (task.status !== newStatus) {
      showToast(`Moved to ${getStatusLabel(newStatus)}`);
    }
  };

  const handleConfirmDelete = () => {
    const idToDelete = taskToDelete.id;
    setTasks((prev) => prev.filter((task) => task.id !== idToDelete));
    setTaskToDelete(null);
    showToast('Task deleted');
  };

  // ----- Settings actions -----
  const handleResetTasks = () => {
    setTasks(createInitialTasks());
    clearFilters();
    showToast('Sample tasks restored');
  };

  const handleClearTasks = () => {
    setTasks([]);
    clearFilters();
    showToast('All tasks deleted');
  };

  const taskHandlers = {
    onAddTask: openCreateModal,
    onEditTask: openEditModal,
    onDeleteTask: setTaskToDelete,
  };

  const renderTaskView = () => {
    if (hasActiveFilters && filteredTasks.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="No tasks found"
          description={
            searchQuery.trim()
              ? `No tasks match "${searchQuery.trim()}" with the selected filters.`
              : 'No tasks match the selected filters.'
          }
          action={
            <button type="button" onClick={clearFilters} className="btn btn-secondary">
              Clear filters
            </button>
          }
        />
      );
    }

    if (activeView === 'tasks') {
      return <TaskList tasks={filteredTasks} {...taskHandlers} onStatusChange={handleMoveTask} />;
    }

    return (
      <KanbanBoard
        tasks={filteredTasks}
        statusFilter={statusFilter}
        hasActiveFilters={hasActiveFilters}
        {...taskHandlers}
        onMoveTask={handleMoveTask}
      />
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={closeMobileNav}
        openTaskCount={openTaskCount}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenMenu={() => setIsMobileNavOpen(true)}
          showSearch={activeView !== 'settings'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          // New tasks default to the filtered status (if any) so they stay visible
          onAddTask={() => openCreateModal(statusFilter === 'all' ? 'todo' : statusFilter)}
        />

        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {activeView === 'settings' ? (
            <SettingsView
              theme={theme}
              onThemeChange={setTheme}
              taskCount={tasks.length}
              onResetTasks={handleResetTasks}
              onClearTasks={handleClearTasks}
            />
          ) : (
            <>
              <DashboardStats tasks={tasks} />
              <FilterBar
                title={activeView === 'board' ? 'Board' : 'My Tasks'}
                priorityFilter={priorityFilter}
                statusFilter={statusFilter}
                onPriorityChange={setPriorityFilter}
                onStatusChange={setStatusFilter}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                resultCount={filteredTasks.length}
                totalCount={tasks.length}
              />
              {renderTaskView()}
            </>
          )}
        </main>
      </div>

      {taskModal && (
        <TaskModal
          task={taskModal.task}
          defaultStatus={taskModal.defaultStatus}
          onSave={handleSaveTask}
          onClose={closeTaskModal}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={
            <>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">&ldquo;{taskToDelete.title}&rdquo;</span> will be
              permanently deleted. This action cannot be undone.
            </>
          }
          confirmLabel="Delete task"
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

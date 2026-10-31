import { useEffect } from 'react';
import { Kanban, ListTodo, PanelLeftClose, PanelLeftOpen, Settings, SquareKanban, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'tasks', label: 'My Tasks', icon: ListTodo },
  { id: 'board', label: 'Board', icon: SquareKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Desktop (lg+): static sidebar that can collapse to icons.
// Mobile/tablet: off-canvas drawer opened from the header's menu button.
export default function Sidebar({ activeView, onNavigate, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile, openTaskCount }) {
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseMobile();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // On desktop, labels hide when collapsed. The mobile drawer always shows labels.
  const labelClass = isCollapsed ? 'lg:hidden' : '';

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 animate-fade-in bg-zinc-950/40 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-[translate,width,visibility] duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-900 ${
          isMobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full lg:visible'
        } ${isCollapsed ? 'lg:w-18' : 'lg:w-64'}`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 px-5 dark:border-zinc-800">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Kanban className="size-4.5" aria-hidden="true" />
          </div>
          <span className={`text-base font-semibold tracking-tight ${labelClass}`}>KanTask</span>
          <button type="button" onClick={onCloseMobile} className="icon-btn ml-auto lg:hidden" aria-label="Close navigation">
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? label : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                <span className={labelClass}>{label}</span>
                {id === 'tasks' && openTaskCount > 0 && (
                  <span
                    className={`ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums dark:bg-zinc-800 dark:text-zinc-300 ${labelClass}`}
                  >
                    {openTaskCount}
                    <span className="sr-only"> open tasks</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden px-3 pb-2 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : undefined}
          >
            {isCollapsed ? <PanelLeftOpen className="size-4.5 shrink-0" /> : <PanelLeftClose className="size-4.5 shrink-0" />}
            <span className={labelClass}>Collapse</span>
          </button>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
            aria-hidden="true"
          >
            AS
          </div>
          <div className={`min-w-0 ${labelClass}`}>
            <p className="truncate text-sm font-medium">Abhay Sharma</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">Personal workspace</p>
          </div>
        </div>
      </aside>
    </>
  );
}

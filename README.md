# KanTask — Kanban Task Board

KanTask is a Kanban task board built with React. Tasks move across three columns (**Todo**, **In Progress** and **Completed**) by drag-and-drop or with a status dropdown. Everything is saved in the browser's `localStorage`, so there is no backend.

It was built as a frontend machine coding challenge (2.5-hour time box). The priorities were working features, readable code and a responsive, accessible UI.

## Features

- **Kanban board** with Todo, In Progress and Completed columns. Each column has a task count, an add-task button and an empty state.
- **Drag-and-drop** between columns and within a column, using `@hello-pangea/dnd`. It works with a mouse, on touch screens and from the keyboard (focus a card, press <kbd>Space</kbd> to lift it, use the arrow keys to move it, press <kbd>Space</kbd> to drop it).
- **Status dropdown on every card**, as a quick alternative to dragging (useful on mobile).
- **Create, edit and delete tasks**:
  - The form is a modal with validation: the title is required (at least 3 characters), and new tasks can't have a due date in the past.
  - The edit form is prefilled with the task's current values.
  - Deleting a task asks for confirmation in a custom dialog, not a browser `confirm()`.
- **Live dashboard stats** for Total, Todo, In Progress and Completed, plus the completion rate. They are calculated from the task data on every render.
- **Search and filters**:
  - Search matches task titles as you type and ignores letter case.
  - Priority and status filters combine with the search.
  - One button clears the search and all filters, and a "no results" state appears when nothing matches.
- **Two views of the same data**: the Board, and **My Tasks**, a list sorted by due date.
- **Due date hints**: overdue tasks are shown in red and tasks due today in amber.
- **Light and dark mode**. The default follows the system setting, the choice is saved, and the page never flashes the wrong theme on load.
- **Settings page**: switch the theme, restore the sample tasks, or delete all tasks (each with confirmation).
- **Responsive layout**:
  - On desktop the sidebar can collapse to icons.
  - On tablet and mobile the sidebar becomes a drawer and the board scrolls horizontally.
  - On mobile the modals open as bottom sheets.
- **Success toasts** after creating, editing, moving and deleting tasks.

## Tech stack

| Purpose | Library |
| --- | --- |
| UI | React 19 (function components and hooks) |
| Build tool / dev server | Vite 8 |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Drag-and-drop | @hello-pangea/dnd (maintained fork of react-beautiful-dnd) |
| Icons | lucide-react |
| Linting | oxlint |

## Getting started

Requires **Node.js 20.19+ or 22.12+**.

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
```

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
npm run lint      # run oxlint
```

### Deploying (Vercel / Netlify)

This is a static Vite app:

- **Build command:** `npm run build`
- **Output directory:** `dist`

The app has no URL routes (views are switched with React state), so no SPA redirect rules are needed.

## Project structure

```
src/
├── App.jsx                   # App state, task handlers, layout
├── main.jsx                  # React entry point
├── index.css                 # Tailwind setup, theme tokens, shared button/input classes
├── components/
│   ├── Sidebar.jsx           # Navigation; collapsible on desktop, drawer on mobile
│   ├── Header.jsx            # Title, date, search, theme toggle, Add Task
│   ├── SearchBar.jsx
│   ├── ThemeToggle.jsx
│   ├── DashboardStats.jsx    # The four statistics cards
│   ├── FilterBar.jsx         # Priority/status filters and result count
│   ├── KanbanBoard.jsx       # DragDropContext and the drop logic
│   ├── KanbanColumn.jsx      # Droppable column with header and empty state
│   ├── TaskCard.jsx          # Draggable card
│   ├── TaskList.jsx          # "My Tasks" list view
│   ├── TaskMeta.jsx          # Priority badge, due date, status dropdown, card actions
│   ├── TaskModal.jsx         # Create/edit form with validation
│   ├── ConfirmDialog.jsx     # Reusable confirmation dialog
│   ├── Modal.jsx             # Shared overlay (Escape to close, scroll lock, ARIA)
│   ├── Select.jsx            # Styled native <select>
│   ├── EmptyState.jsx
│   ├── SettingsView.jsx
│   └── Toast.jsx
├── hooks/
│   └── useLocalStorage.js    # useState that is persisted to localStorage
├── utils/
│   ├── taskHelpers.js        # Pure functions: create, move, filter, validate, dates
│   └── taskStyles.js         # Status and priority colours and icons
└── data/
    └── initialTasks.js       # Sample tasks for the first visit
```

## How it works

### Task model

```js
{
  id: "6f1c…",                  // crypto.randomUUID(), with a fallback for non-HTTPS pages
  title: "Complete API integration",
  description: "Integrate the authentication API.",
  priority: "High",             // "Low" | "Medium" | "High"
  status: "in-progress",        // "todo" | "in-progress" | "completed"
  dueDate: "2026-11-05",        // "YYYY-MM-DD", or "" for no due date
  createdAt: "2026-10-31T10:00:00.000Z"
}
```

### Task status management

- All tasks live in **one array** in `App`. A column is that array filtered by `status`, so the order of the array is also the order of the cards in each column.
- The `STATUSES` constant in `taskHelpers.js` is the single source of truth for the column ids, labels and order.
- Every change makes a **new array** and never mutates state: `map` for edits, `filter` for deletes, and a spread for creates.
- **Moving a task** goes through one function, `moveTask(tasks, taskId, newStatus, beforeTaskId)`. It changes the status and inserts the task before `beforeTaskId`, or at the end when no id is given.
  - **Drag-and-drop:** the library's `onDragEnd` reports the target column and its index there. `KanbanBoard` turns that index into "the card that will come after the dropped one", so drops land in the right place even when filters hide some cards.
  - **Status dropdown:** it passes only the new status, so the task goes to the bottom of the target column.
- Statistics, column counts and filtered results are **derived** during render and never stored, so they can't get out of sync.

### localStorage persistence

`useLocalStorage(key, initialValue, validate)` works like `useState`, but saves its value in the browser:

1. **On first render**, a lazy initializer reads the key once:
   - If the key doesn't exist yet (first visit), the sample tasks are used.
   - If the stored JSON is corrupted or has the wrong shape (checked by `isValidTaskList`), a warning is logged and the sample tasks are used instead, so the app doesn't crash.
2. **After every change**, a `useEffect` writes the value back. That covers create, edit, delete and move. If saving fails (for example, storage is full or disabled), the app keeps working in memory.
3. **Saved data is never overwritten by the samples.** An empty list (`[]`) is valid saved data, so a user who deletes every task is not re-seeded on reload.

The theme is stored the same way under `kantask-theme`. A small inline script in `index.html` applies it before React loads, which avoids a flash of the wrong theme.

### Search and filters

The search text, priority filter and status filter are three separate pieces of state. `filterTasks()` applies them together:

- The search matches titles, ignoring letter case and surrounding spaces.
- The priority and status filters match exactly, or are skipped when set to "all".

When a status filter is active, the board shows only that column.

## Assumptions and limitations

- **Single user, single browser.** The data lives in `localStorage`, so it doesn't sync across devices or browsers. Two open tabs don't sync live either; the last write wins.
- **Search matches titles only**, as the requirements specify.
- **Due dates** are optional. They can't be in the past when creating a task, but existing overdue tasks can still be edited.
- **The user profile in the sidebar is placeholder data**. There is no authentication.
- **The sample tasks' due dates are relative to the first visit**, so the demo data always looks current.
- **The Inter font loads from Google Fonts**, with a system-font fallback when offline.
- **No automated tests are included in the repository.** The features were tested in Chrome at 375px, 768px, 1024px and 1440px widths.

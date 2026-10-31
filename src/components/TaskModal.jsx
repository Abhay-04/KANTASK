import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from './Modal';
import Select from './Select';
import { PRIORITIES, STATUSES, getTodayISO } from '../utils/taskHelpers';
import { PRIORITY_DOT } from '../utils/taskStyles';

const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 300;

function getInitialForm(task, defaultStatus) {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'Medium',
    status: task?.status ?? defaultStatus,
    dueDate: task?.dueDate ?? '',
  };
}

function validateForm(form, isEditing) {
  const errors = {};
  const title = form.title.trim();

  if (!title) {
    errors.title = 'Task title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  // Existing tasks may already be overdue, so only block past dates for new tasks
  if (!isEditing && form.dueDate && form.dueDate < getTodayISO()) {
    errors.dueDate = 'Due date cannot be in the past.';
  }

  return errors;
}

// The parent renders this only while open, so the form state starts fresh on every open
// (no useEffect needed to sync the `task` prop into state).
export default function TaskModal({ task, defaultStatus = 'todo', onSave, onClose }) {
  const isEditing = Boolean(task);
  const [form, setForm] = useState(() => getInitialForm(task, defaultStatus));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as the user fixes it
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm(form, isEditing);
    const invalidFields = Object.keys(validationErrors);
    if (invalidFields.length > 0) {
      setErrors(validationErrors);
      document.getElementById(`task-${invalidFields[0]}`)?.focus();
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <Modal onClose={onClose} labelledBy="task-modal-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 id="task-modal-title" className="text-base font-semibold">
              {isEditing ? 'Edit task' : 'Create new task'}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {isEditing ? 'Update the details of this task.' : 'Add a task to your board.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn -mt-1 -mr-2" aria-label="Close dialog">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="form-label">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="e.g. Complete API integration"
              maxLength={TITLE_MAX_LENGTH}
              autoFocus
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'task-title-error' : undefined}
              className="form-input"
            />
            {errors.title && (
              <p id="task-title-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="task-description" className="form-label">
                Description
              </label>
              <span className="text-xs text-zinc-400 tabular-nums">
                {form.description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Add more details about this task..."
              maxLength={DESCRIPTION_MAX_LENGTH}
              className="form-input resize-none"
            />
          </div>

          {/* Priority: radio group styled as a segmented control */}
          <fieldset>
            <legend className="form-label">Priority</legend>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((priority) => {
                const isSelected = form.priority === priority;
                return (
                  <label
                    key={priority}
                    className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-indigo-500/50 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={isSelected}
                      onChange={() => updateField('priority', priority)}
                      className="sr-only"
                    />
                    <span className={`size-2 rounded-full ${PRIORITY_DOT[priority]}`} aria-hidden="true" />
                    {priority}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className="form-label">
                Status
              </label>
              <Select id="task-status" value={form.status} onChange={(value) => updateField('status', value)} options={STATUSES} />
            </div>

            {/* Due date */}
            <div>
              <label htmlFor="task-dueDate" className="form-label">
                Due date
              </label>
              <input
                id="task-dueDate"
                type="date"
                value={form.dueDate}
                onChange={(event) => updateField('dueDate', event.target.value)}
                min={isEditing ? undefined : getTodayISO()}
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? 'task-dueDate-error' : undefined}
                className="form-input"
              />
              {errors.dueDate && (
                <p id="task-dueDate-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-50/60 px-6 py-4 sm:flex-row sm:justify-end dark:border-zinc-800 dark:bg-zinc-900">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

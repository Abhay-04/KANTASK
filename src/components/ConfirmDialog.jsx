import { TriangleAlert } from 'lucide-react';
import Modal from './Modal';

// Reusable confirmation dialog (used for deleting a task, and for resetting/clearing data in Settings)
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal
      onClose={onCancel}
      role="alertdialog"
      labelledBy="confirm-title"
      describedBy="confirm-message"
      maxWidth="max-w-md"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold">
              {title}
            </h2>
            <p id="confirm-message" className="mt-1.5 text-sm break-words text-zinc-500 dark:text-zinc-400">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {/* Focus Cancel first so pressing Enter never deletes by accident */}
          <button type="button" onClick={onCancel} className="btn btn-secondary" autoFocus>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

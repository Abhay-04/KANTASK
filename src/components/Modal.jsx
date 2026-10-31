import { useEffect } from 'react';

// Shared overlay + dialog shell used by TaskModal and ConfirmDialog.
// Closes on Escape and on clicking the backdrop; locks page scroll while open.
export default function Modal({ onClose, labelledBy, describedBy, role = 'dialog', maxWidth = 'max-w-lg', children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-zinc-950/50 backdrop-blur-[2px] sm:items-center sm:p-4"
      // mousedown (not click) so selecting text and releasing outside doesn't close the modal
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`max-h-[92vh] w-full ${maxWidth} animate-dialog-in overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white shadow-xl motion-reduce:animate-none sm:rounded-2xl dark:border-zinc-800 dark:bg-zinc-900`}
      >
        {children}
      </div>
    </div>
  );
}

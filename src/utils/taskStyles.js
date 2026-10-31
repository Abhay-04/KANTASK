// Visual config shared by several components (kept out of component files so Fast Refresh works)
import { Circle, CircleCheck, CircleDotDashed } from 'lucide-react';

export const STATUS_META = {
  todo: {
    icon: Circle,
    iconClass: 'text-zinc-400',
    pillClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  },
  'in-progress': {
    icon: CircleDotDashed,
    iconClass: 'text-blue-500',
    pillClass: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  completed: {
    icon: CircleCheck,
    iconClass: 'text-emerald-500',
    pillClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
};

export const PRIORITY_DOT = {
  High: 'bg-rose-500',
  Medium: 'bg-amber-500',
  Low: 'bg-zinc-400',
};

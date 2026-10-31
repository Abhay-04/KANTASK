import { createTask, toISODate } from '../utils/taskHelpers';

// Due dates are relative to today so the sample data always looks realistic
function daysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

const SAMPLE_TASKS = [
  {
    title: 'Fix API rate limit handling',
    description: 'Retry failed requests with exponential backoff when the server responds with 429.',
    priority: 'High',
    status: 'todo',
    dueInDays: -1,
  },
  {
    title: 'Design onboarding flow',
    description: 'Create wireframes for the three-step onboarding experience for new users.',
    priority: 'High',
    status: 'todo',
    dueInDays: 3,
  },
  {
    title: 'Document public API endpoints',
    description: 'Add request and response examples for every endpoint in the developer docs.',
    priority: 'Medium',
    status: 'todo',
    dueInDays: 6,
  },
  {
    title: 'Write unit tests for auth utils',
    description: 'Cover token parsing and session expiry edge cases.',
    priority: 'Low',
    status: 'todo',
    dueInDays: 10,
  },
  {
    title: 'Complete API integration',
    description: 'Integrate the authentication API with the login and signup forms.',
    priority: 'High',
    status: 'in-progress',
    dueInDays: 0,
  },
  {
    title: 'Refactor dashboard components',
    description: 'Split large dashboard widgets into smaller, reusable components.',
    priority: 'Medium',
    status: 'in-progress',
    dueInDays: 4,
  },
  {
    title: 'Set up CI pipeline',
    description: 'Run lint and build checks automatically on every pull request.',
    priority: 'Medium',
    status: 'completed',
    dueInDays: -3,
  },
  {
    title: 'Update project README',
    description: 'Document setup steps, available scripts and the deployment process.',
    priority: 'Low',
    status: 'completed',
    dueInDays: -2,
  },
];

export function createInitialTasks() {
  return SAMPLE_TASKS.map(({ dueInDays, ...task }) =>
    createTask({ ...task, dueDate: daysFromToday(dueInDays) }),
  );
}

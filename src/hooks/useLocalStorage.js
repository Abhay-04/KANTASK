import { useEffect, useState } from 'react';

// `initialValue` may be a value or a function (computed only when needed)
function resolveValue(value) {
  return typeof value === 'function' ? value() : value;
}

function readFromStorage(key, initialValue, validate) {
  try {
    const stored = window.localStorage.getItem(key);

    // First visit: nothing saved yet
    if (stored === null) return resolveValue(initialValue);

    const parsed = JSON.parse(stored);
    if (validate(parsed)) return parsed;

    console.warn(`Ignoring invalid data in localStorage key "${key}".`);
  } catch (error) {
    // Corrupted JSON or storage disabled (e.g. some private browsing modes)
    console.warn(`Could not read localStorage key "${key}".`, error);
  }
  return resolveValue(initialValue);
}

/**
 * Works like useState, but the value is restored from and saved to localStorage.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - used when nothing valid is stored
 * @param {(value: unknown) => boolean} validate - rejects stored data with the wrong shape
 */
export function useLocalStorage(key, initialValue, validate = () => true) {
  // Lazy initializer: localStorage is read only once, on the first render
  const [value, setValue] = useState(() => readFromStorage(key, initialValue, validate));

  // Save on every change (create, edit, delete, move)
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Storage full or unavailable: the app keeps working in memory
      console.warn(`Could not save localStorage key "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

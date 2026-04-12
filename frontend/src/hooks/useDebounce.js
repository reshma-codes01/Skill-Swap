import { useState, useEffect } from "react";

/**
 * useDebounce logic to delay processing of a rapidly changing value.
 * @param {any} value - The value that is changing (e.g., search input text).
 * @param {number} delay - Time in milliseconds to wait before updating the debounced value.
 * @returns {any} - The debounced value.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up if the value changes before the delay ends
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

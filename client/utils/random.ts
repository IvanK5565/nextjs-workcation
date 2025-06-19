/**
 * Adds an event listener that triggers the callback when clicking outside the target element.
 * @param {HTMLElement} element - The DOM element to detect outside clicks for.
 * @param {Function} callback - The function to call when an outside click is detected.
 * @returns {Function} A cleanup function to remove the event listener.
 */
export function clickOutSideTheBlock(element, callback) {
  function handleClick(event) {
    if (element && !element.contains(event.target)) {
      callback(event);
    }
  }

  document.addEventListener('mousedown', handleClick);

  // Return cleanup function
  return () => {
    document.removeEventListener('mousedown', handleClick);
  };
}

// isNumber: checks if a value is a number (and not NaN)
export function isNumber(value:any) {
  return typeof value === 'number' && !isNaN(value);
}

// isFunction: checks if a value is a function
export function isFunction(value:any) {
  return typeof value === 'function';
}

// isEmpty: checks if a object have keys
export function isEmpty(obj: Record<any, any>): boolean {
  return Object.keys(obj).length === 0;
}
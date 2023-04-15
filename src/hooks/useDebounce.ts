import { useState, useEffect } from 'react';

const useDebounce = <T>(valueToDebounce: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(valueToDebounce);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(valueToDebounce), delay);

    return () => clearTimeout(timer);
  }, [valueToDebounce, delay]);

  return debouncedValue;
};

export default useDebounce;

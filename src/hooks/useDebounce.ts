import { useEffect, useState } from 'react';

/**
 * Atrasa a atualização de um valor até que pare de mudar por `delayMs`.
 * Evita disparos excessivos de busca durante a digitação.
 */
export function useDebounce<T>(value: T, delayMs = 350): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}

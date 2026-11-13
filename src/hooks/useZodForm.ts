import { useCallback, useState } from 'react';
import { z } from 'zod';
import { extractFieldErrors, type FormErrors } from '@/utils/schemas';

export function useZodForm<T extends Record<string, unknown>>(schema: z.ZodType<T>, initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const reset = useCallback(
    (nextValues?: T) => {
      setValues(nextValues ?? initialValues);
      setErrors({});
    },
    [initialValues]
  );

  const validate = useCallback((): T | null => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    setErrors(extractFieldErrors<T>(result.error));
    return null;
  }, [schema, values]);

  return {
    values,
    errors,
    setFieldValue,
    reset,
    validate,
  };
}

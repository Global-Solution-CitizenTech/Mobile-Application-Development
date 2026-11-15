import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import type { BoundFieldProps, FormErrors, StringFieldKeys } from '@/types/form';
import { extractFieldErrors } from '@/utils/schemas';

export function bindFieldHelpers<T extends Record<string, unknown>>(
  values: T,
  errors: FormErrors<T>,
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
) {
  return <K extends StringFieldKeys<T>>(name: K): BoundFieldProps => ({
    value: (values[name] ?? '') as string,
    onChangeText: (text: string) => setFieldValue(name, text as T[K]),
    error: errors[name],
  });
}

export function useZodForm<T extends Record<string, unknown>>(schema: z.ZodType<T>, initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const initialValuesRef = useRef(initialValues);

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const reset = useCallback((nextValues?: T) => {
    setValues(nextValues ?? initialValuesRef.current);
    setErrors({});
  }, []);

  const validate = (): T | null => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    setErrors(extractFieldErrors<T>(result.error));
    return null;
  };

  const field = bindFieldHelpers(values, errors, setFieldValue);

  return {
    values,
    errors,
    setFieldValue,
    field,
    reset,
    validate,
  };
}

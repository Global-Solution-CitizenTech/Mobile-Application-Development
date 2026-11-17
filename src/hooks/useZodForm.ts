import { useCallback, useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import type {
  BoundFieldProps,
  FieldBinder,
  FormErrors,
  StringFieldKeys,
  UseZodFormOptions,
  UseZodFormReturn,
} from '@/types/form';
import { extractFieldErrors } from '@/utils/schemas';

export function bindFieldHelpers<T extends Record<string, unknown>>(
  values: T,
  errors: FormErrors<T>,
  onChangeStringField: <K extends StringFieldKeys<T>>(field: K, value: string) => void,
  disabled = false
): FieldBinder<T> {
  return <K extends StringFieldKeys<T>>(name: K): BoundFieldProps => {
    const rawValue = values[name];
    return {
      value: typeof rawValue === 'string' ? rawValue : '',
      onChangeText: (text: string) => onChangeStringField(name, text),
      error: errors[name],
      editable: !disabled,
    };
  };
}

export function useZodForm<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  initialValues: T,
  options: UseZodFormOptions = {}
): UseZodFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const initialValuesRef = useRef(initialValues);

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const setStringField = useCallback(
    <K extends StringFieldKeys<T>>(field: K, value: string) => {
      setValues((prev) => Object.assign({}, prev, { [field]: value }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const reset = useCallback((nextValues?: T) => {
    setValues(nextValues ?? initialValuesRef.current);
    setErrors({});
  }, []);

  const syncValues = useCallback((nextValues: T) => {
    initialValuesRef.current = nextValues;
    setValues(nextValues);
    setErrors({});
  }, []);

  const validate = useCallback((): T | null => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    setErrors(extractFieldErrors<T>(result.error));
    return null;
  }, [schema, values]);

  const field = bindFieldHelpers(values, errors, setStringField, options.disabled);

  return {
    values,
    errors,
    setFieldValue,
    field,
    reset,
    syncValues,
    validate,
  };
}

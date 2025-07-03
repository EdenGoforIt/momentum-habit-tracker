import { useCallback, useState } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = useCallback(
    (fieldName: string, value: string) => {
      const rule = schema[fieldName];
      if (!rule) return true;

      let error = "";

      if (rule.required && !value) {
        error = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      } else if (rule.minLength && value.length < rule.minLength) {
        error = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${rule.minLength} characters`;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        error = `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } cannot exceed ${rule.maxLength} characters`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        error = `Please enter a valid ${fieldName.toLowerCase()}`;
      } else if (rule.custom) {
        error = rule.custom(value) || "";
      }

      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));

      return !error;
    },
    [schema]
  );

  const validateAll = useCallback(
    (values: { [key: string]: string }) => {
      const newErrors: { [key: string]: string } = {};
      let isValid = true;

      Object.keys(schema).forEach((fieldName) => {
        const value = values[fieldName] || "";
        const rule = schema[fieldName];
        let error = "";

        if (rule.required && !value) {
          error = `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required`;
        } else if (rule.minLength && value.length < rule.minLength) {
          error = `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } must be at least ${rule.minLength} characters`;
        } else if (rule.maxLength && value.length > rule.maxLength) {
          error = `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } cannot exceed ${rule.maxLength} characters`;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          error = `Please enter a valid ${fieldName.toLowerCase()}`;
        } else if (rule.custom) {
          error = rule.custom(value) || "";
        }

        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  }, []);

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    clearError,
  };
};

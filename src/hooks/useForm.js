// src/hooks/useForm.js
import { useState, useCallback, useRef } from "react";
import { validateField, validateForm } from "../utils/validation";

/**
 * Custom hook for form handling with validation
 */
export const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const initialValuesRef = useRef(initialValues);

  // Check if form has been modified
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => {
        const newValues = { ...prev, [name]: newValue };

        // Validate on change if field has been touched
        if (touched[name] && validationSchema[name]) {
          const error = validateField(newValue, validationSchema[name], newValues);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
          }));
        }

        return newValues;
      });
    },
    [touched, validationSchema]
  );

  // Handle blur - mark field as touched and validate
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validationSchema[name]) {
        const error = validateField(value, validationSchema[name], values);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validationSchema, values]
  );

  // Set a single field value
  const setFieldValue = useCallback(
    (name, value) => {
      setValues((prev) => {
        const newValues = { ...prev, [name]: value };

        if (touched[name] && validationSchema[name]) {
          const error = validateField(value, validationSchema[name], newValues);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
          }));
        }

        return newValues;
      });
    },
    [touched, validationSchema]
  );

  // Set a single field error
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // Set a single field as touched
  const setFieldTouched = useCallback(
    (name, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));

      if (isTouched && validationSchema[name]) {
        const error = validateField(values[name], validationSchema[name], values);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validationSchema, values]
  );

  // Validate entire form
  const validate = useCallback(() => {
    const result = validateForm(values, validationSchema);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, [values, validationSchema]);

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e?.preventDefault();

      setSubmitCount((prev) => prev + 1);

      // Mark all fields as touched
      const allTouched = Object.keys(validationSchema).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate all fields
      const result = validateForm(values, validationSchema);
      setErrors(result.errors);
      setIsValid(result.isValid);

      if (!result.isValid) {
        // Focus first error field
        const firstErrorField = Object.keys(result.errors)[0];
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.focus();
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validationSchema]
  );

  // Reset form to initial values
  const resetForm = useCallback((newInitialValues) => {
    const resetValues = newInitialValues || initialValuesRef.current;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);

    if (newInitialValues) {
      initialValuesRef.current = newInitialValues;
    }
  }, []);

  // Get field props for easy spreading
  const getFieldProps = useCallback(
    (name) => ({
      name,
      value: values[name] || "",
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    [values, handleChange, handleBlur]
  );

  // Get field meta for validation state
  const getFieldMeta = useCallback(
    (name) => ({
      error: errors[name],
      touched: touched[name],
      isValid: touched[name] && !errors[name] && values[name],
    }),
    [errors, touched, values]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    validate,
    resetForm,
    getFieldProps,
    getFieldMeta,
  };
};

export default useForm;
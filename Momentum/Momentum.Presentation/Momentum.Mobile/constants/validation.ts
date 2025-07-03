export const VALIDATION_PATTERNS = {
  EMAIL: /\S+@\S+\.\S+/,
  PHONE: /^\+?[\d\s-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, length: number) =>
    `${field} must be at least ${length} characters`,
  MAX_LENGTH: (field: string, length: number) =>
    `${field} cannot exceed ${length} characters`,
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD:
    "Password must contain at least 8 characters with uppercase, lowercase, and number",
};

// Common validation schemas
export const AUTH_VALIDATION_SCHEMAS = {
  signIn: {
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.EMAIL,
      custom: (value: string) => {
        if (!value) return "Email is required";
        if (!VALIDATION_PATTERNS.EMAIL.test(value))
          return "Please enter a valid email";
        return null;
      },
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return null;
      },
    },
  },
  signUp: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      custom: (value: string) => {
        if (!value) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        if (value.length > 50) return "First name cannot exceed 50 characters";
        return null;
      },
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      custom: (value: string) => {
        if (!value) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        if (value.length > 50) return "Last name cannot exceed 50 characters";
        return null;
      },
    },
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.EMAIL,
      custom: (value: string) => {
        if (!value) return "Email is required";
        if (!VALIDATION_PATTERNS.EMAIL.test(value))
          return "Please enter a valid email";
        return null;
      },
    },
    password: {
      required: true,
      minLength: 8,
      pattern: VALIDATION_PATTERNS.PASSWORD,
      custom: (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!VALIDATION_PATTERNS.PASSWORD.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        return null;
      },
    },
  },
};

// src/lib/api-error.ts

/**
 * Extracts a human-readable error message from
 * backend / axios / runtime errors.
 */
export function getErrorMessage(error: any): string {
  if (!error) return "Something went wrong";

  // Axios backend error
  if (error.response?.data) {
    const data = error.response.data;

    if (typeof data.error === "string") {
      return data.error;
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  // Custom error object
  if (typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong";
}

/**
 * Extracts field-level validation errors
 * Example backend format:
 * {
 *   details: {
 *     email: "Invalid email"
 *   }
 * }
 */
export function getFieldErrors(error: any): Record<string, string> {
  if (!error) return {};

  const details = error.response?.data?.details;

  if (details && typeof details === "object") {
    return details;
  }

  return {};
}

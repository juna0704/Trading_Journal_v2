// src/lib/api-error.ts

export function getErrorMessage(error: any): string {
  if (!error) return "Something went wrong";

  // Axios error with backend response
  if (error.response?.data) {
    const data = error.response.data;

    // ✅ Your backend format
    if (data.error?.message) {
      return data.error.message;
    }

    // Alternative common formats
    if (typeof data.error === "string") {
      return data.error;
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  // JS / runtime error
  if (typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong";
}

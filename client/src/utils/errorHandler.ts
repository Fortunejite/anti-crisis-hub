import { AxiosError } from 'axios';

export default function errorHandler(error: unknown): string {
  // Check if the error is an AxiosError
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || 'An error occurred';
    console.error("Error:", message);
    return message;
  }

  // Handle other types of errors
  if (error instanceof Error) {
    console.error('Application Error:', error.message);
    return error.message || 'An unexpected error occurred.';
  }

  // Fallback for unknown errors
  console.error('Unknown Error:', error);
  return 'An unknown error occurred. Please try again.';
}

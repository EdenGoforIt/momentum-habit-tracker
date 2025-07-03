import { ProblemDetails } from "@/types/type";
import { Alert } from "react-native";

export const showErrorAlert = (
  error: any,
  fallbackTitle: string = "Error",
  fallbackMessage: string = "Something went wrong. Please try again later."
) => {
  let title = fallbackTitle;
  let message = fallbackMessage;

  const status = error?.response?.status;
  const problemDetails = error?.response?.data as ProblemDetails;

  // Determine title and message based on status code
  switch (status) {
    case 400:
      title = "Invalid Request";
      if (
        problemDetails?.errors &&
        Object.keys(problemDetails.errors).length > 0
      ) {
        title = "Validation Error";
        const errorMessages: string[] = [];
        Object.keys(problemDetails.errors).forEach((field) => {
          const fieldErrors = problemDetails.errors![field];
          if (Array.isArray(fieldErrors)) {
            errorMessages.push(...fieldErrors);
          }
        });
        message = errorMessages.join("\n") || "Please check your input.";
      } else {
        message =
          problemDetails?.title ||
          problemDetails?.detail ||
          "Please check your input and try again.";
      }
      break;

    case 401:
      title = "Authentication Failed";
      message = "Invalid email or password. Please try again.";
      break;

    case 403:
      title = "Access Denied";
      message = "You don't have permission to perform this action.";
      break;

    case 404:
      title = "Not Found";
      message = "The requested resource was not found.";
      break;

    case 409:
      title = "Conflict";
      message =
        problemDetails?.title ||
        problemDetails?.detail ||
        "This action conflicts with existing data.";
      break;

    case 422:
      title = "Invalid Data";
      message =
        problemDetails?.title ||
        problemDetails?.detail ||
        "The provided data is invalid.";
      break;

    case 429:
      title = "Too Many Requests";
      message = "You're making too many requests. Please wait and try again.";
      break;

    case 500:
      title = "Server Error";
      message = "Something went wrong on our end. Please try again later.";
      break;

    case 502:
    case 503:
    case 504:
      title = "Service Unavailable";
      message =
        "The service is temporarily unavailable. Please try again later.";
      break;

    default:
      // Network error or other
      if (!status) {
        title = "Network Error";
        message = "Please check your internet connection and try again.";
      } else {
        title = fallbackTitle;
        message =
          problemDetails?.title ||
          problemDetails?.detail ||
          error?.message ||
          fallbackMessage;
      }
      break;
  }

  Alert.alert(title, message);
};

export const showNetworkErrorAlert = () => {
  Alert.alert(
    "Network Error",
    "Please check your internet connection and try again."
  );
};

export const en = {
  AUTH_USER_EXISTS: "User already exists",
  AUTH_USER_NOT_FOUND: "User not found",
  AUTH_INVALID_PASSWORD: "Invalid password",
  AUTH_REGISTER_FAILED: "Failed to register user",
  AUTH_LOGIN_FAILED: "Failed to login",
  AUTH_REFRESH_TOKEN_NOT_FOUND: "Refresh token not found",
  AUTH_REFRESH_TOKEN_INVALID: "Invalid or expired refresh token",
  AUTH_REFRESH_TOKEN_FAILED: "Failed to refresh token",
  AUTH_UNAUTHORIZED: "Unauthorized",
  AUTH_FAILED: "Failed to authenticate",
  AUTH_FORBIDDEN: "Don't have permission to access this resource",

  VALIDATION_EMAIL: "Please enter a valid email address",
  VALIDATION_PASSWORD_MIN: "Password must be at least 6 characters",
  VALIDATION_PASSWORD_REQUIRED: "Password is required",
  VALIDATION_FIRST_NAME_REQUIRED: "First name is required",
  VALIDATION_LAST_NAME_REQUIRED: "Last name is required",
  VALIDATION_EVENT_ID_REQUIRED: "Event ID is required",

  EVENT_CREATED: "Event created successfully",
  EVENT_UPDATED: "Event updated successfully",
  EVENT_DELETED: "Event deleted successfully",
  EVENT_NOT_FOUND: "Event not found",
  EVENT_DATE_PAST: "Event date cannot be in the past",
  EVENT_INACTIVE: "Event is no longer active",
  EVENT_CREATE_FAILED: "Failed to create event",
  EVENT_UPDATE_FAILED: "Failed to update event",
  EVENT_DELETE_FAILED: "Failed to delete event",
  EVENT_GET_FAILED: "Failed to get event",
  EVENT_GET_ALL_FAILED: "Failed to get events",
  EVENT_HAS_ACTIVE_TICKETS:
    "Event cannot be deleted because there are sold or reserved tickets. The event has been deactivated. Please contact the system administrator for ticket cancellations.",

  BOOKING_RESERVED: "Booking reserved",
  BOOKING_CANCELLED: "Booking cancelled",
  BOOKING_RESERVE_FAILED: "Failed to reserve ticket",
  BOOKING_CANCEL_FAILED: "Failed to cancel booking",

  TICKET_NOT_FOUND: "Ticket not found",
  TICKET_NOT_AVAILABLE: "Ticket is not available for booking",
  TICKET_NOT_RESERVED: "Ticket is not reserved",
  TICKET_NOT_OWNED: "You don't own this ticket",
  TRANSACTION_NOT_FOUND: "Transaction not found",
  TRANSACTION_NOT_OWNED: "You don't own this transaction",
  TRANSACTION_NOT_PENDING: "Transaction is not pending",
  PAYMENT_SUCCESS: "Payment successful",
  PAYMENT_FAILED: "Failed to process payment",
  PAYMENT_INVALID_CARD: "Invalid card information. Please check your card details and try again.",
  EVENT_SOLD_OUT: "This event is sold out. No tickets available.",

  MONITOR_FAILED: "Failed to get event monitor data",
  TICKET_GET_ALL_FAILED: "Failed to get tickets",

  INTERNAL_SERVER_ERROR: "Internal server error",
  RATE_LIMIT: "Too many requests, please try again later.",
} as const;

export type MessageKey = keyof typeof en;

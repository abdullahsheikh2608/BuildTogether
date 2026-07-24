export const AUTH_MESSAGES = {
    // Success Messages
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",

    // Validation Messages
    ALL_FIELDS_REQUIRED: "All fields are required",
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    INVALID_EMAIL: "Invalid email address",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
    INVALID_ROLE: "Role must be founder or developer",

    // Authentication Messages
    EMAIL_ALREADY_EXISTS: "Email already exists",
    USERNAME_ALREADY_EXISTS: "Username already exists",
    INVALID_CREDENTIALS: "Invalid email or password",

    // JWT Messages
    TOKEN_REQUIRED: "Access token is required",
    INVALID_TOKEN: "Invalid or expired token",

    // Authorization Messages
    FORBIDDEN: "You are not authorized to perform this action",
};
export const STARTUP_MESSAGES = {
    CREATED_SUCCESSFULLY: "Startup created successfully",

    TITLE_REQUIRED: "Startup title is required",
    TAGLINE_REQUIRED: "Startup tagline is required",
    DESCRIPTION_REQUIRED: "Startup description is required",

    TECH_STACK_REQUIRED: "Tech stack is required",
    REQUIRED_ROLES_REQUIRED: "Required roles are required",

    STATUS_REQUIRED: "Startup status is required",

    INVALID_STATUS: "Invalid startup status",

    TITLE_LENGTH:
        "Title must be between 3 and 100 characters",

    TAGLINE_LENGTH:
        "Tagline must be between 3 and 150 characters",

    DESCRIPTION_LENGTH:
        "Description must be between 10 and 5000 characters",

    TECH_STACK_ARRAY:
        "Tech stack must be an array",

    REQUIRED_ROLES_ARRAY:
        "Required roles must be an array",

    TECH_STACK_EMPTY:
        "Tech stack must contain at least one item",

    REQUIRED_ROLES_EMPTY:
        "Required roles must contain at least one item",

    FETCH_SUCCESSFULLY: "Startups fetched successfully",
        NO_STARTUPS_FOUND: "No startups found",

    INVALID_STARTUP_ID: "Invalid startup id",

    FETCH_BY_ID_SUCCESSFULLY: "Startup fetched successfully",
        STARTUP_NOT_FOUND: "Startup not found",

    UPDATED_SUCCESSFULLY: "Startup updated successfully",
    UPDATE_NOT_ALLOWED: "You are not allowed to update this startup",
    NOTHING_TO_UPDATE: "No fields provided to update",

    DELETED_SUCCESSFULLY: "Startup deleted successfully",
    DELETE_NOT_ALLOWED: "You are not allowed to delete this startup",
};

export const COMMON_MESSAGES = {
    ROUTE_NOT_FOUND: "Route Not Found",
};

export const APPLICATION_MESSAGES = {
    STARTUP_ID_REQUIRED: "Startup id is required",
    INVALID_STARTUP_ID: "Invalid startup id",

    MESSAGE_TOO_LONG: "Message must not exceed 1000 characters",

    ALREADY_APPLIED: "You have already applied to this startup",

    STARTUP_NOT_FOUND: "Startup not found",

    APPLICATION_SUBMITTED: "Application submitted successfully",

    FETCH_SUCCESSFULLY: "Applications fetched successfully",

    APPLICATION_NOT_FOUND: "Application not found",

    STATUS_REQUIRED: "Status is required",

    INVALID_STATUS: "Invalid application status",

    UPDATED_SUCCESSFULLY: "Application updated successfully",

    INVALID_APPLICATION_ID: "Invalid application id",

    NO_APPLICATIONS_FOUND: "No applications found for this startup",
    FORBIDDEN_STARTUP_ACCESS: "You are not allowed to view applications for this startup",

    ALREADY_UPDATED: "Application has already been updated",

};

export const TASK_MESSAGES = {
    CREATED_SUCCESSFULLY: "Task created successfully",

    FETCH_SUCCESSFULLY: "Tasks fetched successfully",

    UPDATED_SUCCESSFULLY: "Task updated successfully",

    DELETED_SUCCESSFULLY: "Task deleted successfully",

    TASK_NOT_FOUND: "Task not found",

    INVALID_TASK_ID: "Invalid task id",

    TITLE_REQUIRED: "Task title is required",

    DESCRIPTION_REQUIRED: "Task description is required",

    STARTUP_ID_REQUIRED: "Startup id is required",

    ASSIGNED_TO_REQUIRED: "Assigned developer is required",

    PRIORITY_REQUIRED: "Task priority is required",

    STATUS_REQUIRED: "Task status is required",

    DEADLINE_REQUIRED: "Deadline is required",

    INVALID_PRIORITY: "Invalid task priority",

    INVALID_STATUS: "Invalid task status",

    TITLE_LENGTH: "Title must be between 3 and 255 characters",

    DESCRIPTION_LENGTH:
        "Description must be between 10 and 1000 characters",

    DEVELOPER_NOT_ACCEPTED:
        "Developer is not an accepted member of this startup",

    NOTHING_TO_UPDATE: "No fields provided to update",

    FORBIDDEN:
    "You are not allowed to perform this action",
};

export const NOTIFICATION_MESSAGES = {
    FETCH_SUCCESSFULLY: "Notifications fetched successfully.",
    READ_SUCCESSFULLY: "Notification marked as read successfully.",
    READ_ALL_SUCCESSFULLY: "All notifications marked as read successfully.",
    DELETE_SUCCESSFULLY: "Notification deleted successfully.",

    NOTIFICATION_NOT_FOUND: "Notification not found.",
    NO_NOTIFICATIONS_FOUND: "No notifications found.",

    INVALID_NOTIFICATION_ID: "Invalid notification ID.",
};
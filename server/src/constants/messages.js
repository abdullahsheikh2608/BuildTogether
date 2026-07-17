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
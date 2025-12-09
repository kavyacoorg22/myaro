export const userMessages = {
    SUCCESS: {
        OPERATION_SUCCESS: 'Operation completed successfully',
        USER_CREATED: 'User created successfully',
        USER_UPDATED: 'User updated successfully',
        USER_DELETED: 'User deleted successfully',
        PROFILE_FETCHED: 'User profile fetched successfully',
        PASSWORD_UPDATED: 'Password updated successfully',
        EMAIL_VERIFIED: 'Email verified successfully',
    },

    ERROR: {
        INVALID_STATUS: 'Invalid status value',
        INVALID_INPUT: 'Invalid input data',
        MISSING_PARAMETERS: 'Required parameters are missing',
        INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later',
        BAD_REQUEST: 'Invalid request parameters',
        NOT_FOUND: 'Resource not found',
        FORBIDDEN: 'You do not have permission to perform this action',
        CONFLICT: 'Conflict occurred, please check your request',
        INVALID_TOKEN: 'Token is invalid',
        NO_TOKEN: 'No token is provided',
        ROUTE_NOT_FOUND: 'Route not found',
        UPDATE_FAILED:"Failed to update ",

        // 🔥 User-specific errors
        USER_NOT_FOUND: 'User not found',
        USER_BLOCKED: 'User account is blocked',
        USER_INACTIVE: 'User account is inactive',
        USER_ALREADY_EXISTS: 'A user with this email already exists',
        EMAIL_NOT_VERIFIED: 'Email is not verified',
        INVALID_CREDENTIALS: 'Invalid login credentials',
        INVALID_PASSWORD: 'Incorrect password',
        UNAUTHORIZED_ACCESS: 'Unauthorized access attempt',
    },

    INFO: {
        PROCESSING: 'Your request is being processed',
        NO_DATA: 'No data found',


        VERIFICATION_EMAIL_SENT: 'A verification email has been sent',
        PASSWORD_RESET_LINK_SENT: 'Password reset link has been sent to your email',
        PASSWORD_RESET_PENDING: 'Password reset is pending',
        SESSION_EXPIRED: 'Your session has expired, please log in again',
    },
} as const;

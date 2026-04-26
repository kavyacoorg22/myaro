export const beauticianMessages = {
  SUCCESS: {
    REGISTERED: "Beautician registration completed successfully",

    STATUS_FETCHED: "Beautician verification status fetched successfully",
    STATUS_APPROVED: "Your account has been verified successfully",
    STATUS_PENDING: "Your verification is under review",
    STATUS_REJECTED:
      "Your verification was rejected. Please update your details",

    REGISTRATION_UPDATED: "Registration details updated successfully",

    PROFILE_FETCHED: "Profile details fetched successfully",
    PROFILE_UPDATED: "Profile updated successfully",

    SEARCH_RESULTS: "Beautician search results fetched successfully",

    SERVICE_AREA_ADDED: "Service area added successfully",
    SERVICE_AREA_FETCHED: "Service area fetched successfully",

    DASHBOARD_FETCHED: "Dashboard data fetched successfully",
  },

  ERROR: {
    VALIDATION_DATA_MISSING: "Validated request data missing",
    LOCATION_REQUIRED: "At least one service location must be provided",
    INVALID_QUERY: "Invalid search query",
    BEAUTICIAN_NOT_FOUND: "Beautician not found",
    FAILED_TO_UPDATE: "Failed to update",
    INVALID_SERVICE_MODE_ARRAY: "serviceMode must be an array",
    INVALID_SERVICE_MODE: "Invalid service mode",
    SHOP_NAME_REQUIRED: "Shop name required for SHOP service",
    BEAUTICIAN_NOT_AVAILABLE_ON_DATE:
      "Beautician is not available on this date",
    REQUESTED_TIME_NOT_AVAILABLE:
      "Requested time is not within available hours",
  },
};

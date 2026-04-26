export const serviceMessages = {
  SUCCESS: {
    // BeauticianServiceController
    FETCHED: "Services fetched successfully",
    LIST_FETCHED: "Services list fetched successfully",
    UPSERTED: "Services added successfully",
    PAMPHLET_UPLOADED: "Pamphlet uploaded successfully",
    PAMPHLET_DELETED: "Pamphlet deleted successfully",
    PAMPHLET_FETCHED: "Pamphlet fetched successfully",

    // ServiceController
    ADDED: "Service added successfully",
    UPDATED: "Service updated successfully",
    STATUS_CHANGED: "Status changed successfully",

    // CategoryController
    CATEGORY_CREATED: "Category created successfully",
    CATEGORY_UPDATED: "Category updated successfully",
    CATEGORY_FETCHED: "Category fetched successfully",

    // CustomServiceController
    CUSTOM_CREATED: "Custom service created successfully",
    CUSTOM_FETCHED: "Custom services fetched successfully",
    CUSTOM_DETAIL_FETCHED: "Custom service detail fetched successfully",
    CUSTOM_STATUS_UPDATED: "Custom service status updated successfully",
  },

  ERROR: {
    // General
    NOT_FOUND: "Service not found",
    INVALID_STATUS: "Invalid status provided",
    INVALID_CATEGORY_ID: "categoryId must be a string",

    // Category
    CATEGORY_NOT_FOUND: "Category not found",
    CATEGORY_ALREADY_EXISTS: "Category with this name already exists",
    CATEGORY_INACTIVE: "Category is inactive",

    // Service
    SERVICE_NOT_FOUND: "Service not found",
    SERVICE_ALREADY_EXISTS:
      "Service with this name already exists in this category",
    SERVICE_INACTIVE: "Service is currently inactive",
    SERVICE_ALREDY_REJECTED:"Service already rejected",

    // Custom Service
    CUSTOM_SERVICE_NOT_FOUND: "Custom service not found",
    CUSTOM_SERVICE_ALREADY_APPROVED: "Custom service has already been approved",
    CUSTOM_SERVICE_REJECTED_CANNOT_APPROVE:
      "Rejected custom service cannot be approved",
    CUSTOM_SERVICE_APPROVED_CANOT_REJECT: "Approved custom service cannot be Rejected",
    // Pamphlet
    PAMPHLET_NOT_FOUND: "Pamphlet not found",
    PAMPHLET_UPLOAD_FAILED: "Pamphlet upload failed",
    PAMLET_DELETE_FAILED: "Failed to delete pamphlet image",

    // Beautician Service
    BEAUTICIAN_SERVICE_NOT_FOUND: "Beautician service not found",
    BEAUTICIAN_SERVICE_ALREADY_EXISTS: "This service is already added",
  },
};

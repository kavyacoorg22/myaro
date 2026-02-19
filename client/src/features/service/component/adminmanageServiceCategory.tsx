import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { adminApi } from "../../../services/api/admin";
import { publicAPi } from "../../../services/api/public";
import type {
  IGetCategoryDto,
  IGetServiceDto,
} from "../../../types/dtos/service";
import { handleApiError } from "../../../lib/utils/handleApiError";
import { SaidBar } from "../../user/component/saidBar/saidbar";
import { EditModal } from "../../models/service/editModals";
import ManageServicesCategories from "../pages/adminManageServiceCategory";

export default function ManageServicesCategoriesContainer() {
  const [categories, setCategories] = useState<IGetCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesUpdateTrigger, setServicesUpdateTrigger] = useState<{
    categoryId: string;
    services: IGetServiceDto[];
  } | null>(null);

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    type: "service" | "category";
    data: any;
    categoryId: string;
  }>({ isOpen: false, type: "service", data: null, categoryId: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await publicAPi.getCategory();
      setCategories(response.data.data?.category || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async (
    categoryId: string,
  ): Promise<IGetServiceDto[]> => {
    try {
      const response = await publicAPi.getService(categoryId);
      return response.data.data?.services || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  };

  const handleAddCategory = async (name: string, description: string) => {
    try {
      const response = await adminApi.addCategory({ name, description });
      if (response.data.success) {
        toast.success("Category added successfully");
        await loadCategories();
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleAddService = async (categoryId: string, serviceName: string) => {
    try {
      const response = await adminApi.addService({
        categoryId,
        name: serviceName,
      });
      if (response.data.success) {
        toast.success("Service added successfully");
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleEditService = async (categoryId: string, serviceId: string) => {
    try {
      const services = await loadServices(categoryId);
      const service = services.find((s) => s.id === serviceId);

      if (service) {
        setEditModal({
          isOpen: true,
          type: "service",
          data: {
            id: service.id,
            name: service.name,
            isActive: service.isActive,
          },
          categoryId: service.categoryId,
        });
      }
    } catch (error) {
      toast.error("Failed to load service details");
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find((c) => c.categoryId === categoryId);

    if (category) {
      setEditModal({
        isOpen: true,
        type: "category",
        data: {
          id: category.categoryId,
          name: category.name,
          description: category.description,
          isActive: category.isActive,
        },
        categoryId: category.categoryId,
      });
    }
  };

  // Update name/description
  const handleUpdate = async (id: string, data: any) => {
    try {
      const response =
        editModal.type === "service"
          ? await adminApi.updateService(id, data)
          : await adminApi.updateCategory(id, data);

      if (response.data.success) {
        toast.success(
          `${editModal.type === "service" ? "Service" : "Category"} updated successfully`,
        );
        await loadCategories();
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Toggle status

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    if (editModal.type === "category") {
      return;
    }

    try {
      const response = await adminApi.toggleServiceStatus(id, { isActive });

      if (response.data.success) {
        toast.success("Service status updated");
        setEditModal((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            isActive: isActive,
          },
        }));
        if (editModal.categoryId) {
          const updatedServices = await loadServices(editModal.categoryId);
          setServicesUpdateTrigger({
            categoryId: editModal.categoryId,
            services: updatedServices,
          });
        }
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  return (
    <>
      <SaidBar />
      <ManageServicesCategories
        categories={categories}
        onAddCategory={handleAddCategory}
        onAddService={handleAddService}
        onEditService={handleEditService}
        onEditCategory={handleEditCategory}
        onLoadServices={loadServices}
        loading={loading}
        servicesUpdateTrigger={servicesUpdateTrigger}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() =>
          setEditModal({
            isOpen: false,
            type: "service",
            data: null,
            categoryId: "",
          })
        }
        title={editModal.type === "service" ? "Edit service" : "Edit category"}
        type={editModal.type}
        data={editModal.data}
        onUpdate={handleUpdate}
        onToggleStatus={handleToggleStatus}
      />
    </>
  );
}

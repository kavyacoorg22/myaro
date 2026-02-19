import { useEffect, useState } from "react";
import type {
  IGetCategoryDto,
  IGetServiceDto,
} from "../../../types/dtos/service";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";

interface ManageServicesCategoriesProps {
  categories: IGetCategoryDto[];
  onAddCategory: (name: string, description: string) => Promise<void>;
  onAddService: (categoryId: string, serviceName: string) => Promise<void>;
  onEditService: (categoryId: string, serviceId: string) => void;
  onEditCategory: (categoryId: string) => void;
  onLoadServices: (categoryId: string) => Promise<IGetServiceDto[]>;
  loading?: boolean;
  servicesUpdateTrigger?: {
    categoryId: string;
    services: IGetServiceDto[];
  } | null;
}

export default function ManageServicesCategories({
  categories,
  onAddCategory,
  onAddService,
  onEditService,
  onEditCategory,
  onLoadServices,
  loading = false,
  servicesUpdateTrigger,
}: ManageServicesCategoriesProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [servicesData, setServicesData] = useState<{
    [key: string]: IGetServiceDto[];
  }>({});
  const [loadingServices, setLoadingServices] = useState<{
    [key: string]: boolean;
  }>({});
  const [showAddService, setShowAddService] = useState<{
    [key: string]: boolean;
  }>({});

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingService, setAddingService] = useState(false);

  useEffect(() => {
    if (servicesUpdateTrigger) {
      setServicesData((prev) => ({
        ...prev,
        [servicesUpdateTrigger.categoryId]: servicesUpdateTrigger.services,
      }));
    }
  }, [servicesUpdateTrigger]);

  const handleCategoryClick = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }

    setExpandedCategory(categoryId);

    // Load services if not already loaded
    if (!servicesData[categoryId]) {
      setLoadingServices((prev) => ({ ...prev, [categoryId]: true }));
      try {
        const services = await onLoadServices(categoryId);
        setServicesData((prev) => ({
          ...prev,
          [categoryId]: services || [],
        }));
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoadingServices((prev) => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      setAddingCategory(true);
      try {
        await onAddCategory(
          newCategoryName.trim(),
          newCategoryDescription.trim(),
        );
        setNewCategoryName("");
        setNewCategoryDescription("");
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        setAddingCategory(false);
      }
    }
  };

  const handleAddService = async (categoryId: string) => {
    if (newServiceName.trim()) {
      setAddingService(true);
      try {
        await onAddService(categoryId, newServiceName.trim());

        // Refresh services for this category
        const services = await onLoadServices(categoryId);
        setServicesData((prev) => ({
          ...prev,
          [categoryId]: services || [],
        }));

        setNewServiceName("");
        setShowAddService((prev) => ({ ...prev, [categoryId]: false }));
      } catch (error) {
        console.error("Error adding service:", error);
      } finally {
        setAddingService(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Manage Services & Categories
          </h1>
          <p className="text-sm text-gray-500">
            Create, edit, or remove categories and services available for
            beauticians
          </p>
        </div>

        {/* Add New Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Add new category
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter category Name (Hair Service)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={addingCategory}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            <input
              type="text"
              placeholder="description/optional"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              disabled={addingCategory}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || addingCategory}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white py-2 rounded-md text-sm font-medium transition-colors"
            >
              {addingCategory ? "Adding..." : "+ Add category"}
            </button>
          </div>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories yet. Add one above!
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => {
              const isExpanded = expandedCategory === category.categoryId;
              const services = servicesData[category.categoryId] || [];
              const isLoading = loadingServices[category.categoryId];

              return (
                <div
                  key={category.categoryId}
                  className="bg-purple-50 rounded-lg border border-purple-100 overflow-hidden"
                >
                  {/* Category Header */}
                  <div
                    onClick={() => handleCategoryClick(category.categoryId)}
                    className="p-4 cursor-pointer hover:bg-purple-100 transition-colors flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {services.length
                            ? ` ${services.length} services`
                            : `services`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(category.categoryId);
                      }}
                      className="p-1 hover:bg-purple-200 rounded transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      {/* Add Service Button/Form */}
                      {!showAddService[category.categoryId] ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddService((prev) => ({
                              ...prev,
                              [category.categoryId]: true,
                            }));
                          }}
                          className="w-30 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md text-sm font-medium mb-4 transition-colors"
                        >
                          + Add service
                        </button>
                      ) : (
                        <div className="mb-4 space-y-2">
                          <input
                            type="text"
                            placeholder="Enter service name"
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            disabled={addingService}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAddService(category.categoryId)
                              }
                              disabled={!newServiceName.trim() || addingService}
                              className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              {addingService ? "Adding..." : "Add Service"}
                            </button>
                            <button
                              onClick={() => {
                                setShowAddService((prev) => ({
                                  ...prev,
                                  [category.categoryId]: false,
                                }));
                                setNewServiceName("");
                              }}
                              disabled={addingService}
                              className="px-4 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 rounded-md text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Services Table */}
                      {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                          Loading services...
                        </div>
                      ) : services.length > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                                  Service Name
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {services.map((service, idx) => (
                                <tr
                                  key={service.id}
                                  className={
                                    idx !== services.length - 1
                                      ? "border-b border-gray-100"
                                      : ""
                                  }
                                >
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {service.name}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span
                                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                        service.isActive === true
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {service.isActive === true
                                        ? "Active"
                                        : "Inactive"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() =>
                                        onEditService(
                                          category.categoryId,
                                          service.id,
                                        )
                                      }
                                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                      <Pencil className="w-3 h-3" />
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          No services yet. Add one above!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

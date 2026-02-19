import React from 'react';
import { ChevronDown, Edit2, Plus, X, Trash2 } from 'lucide-react';
import type { IServiceSelectionDto } from '../../../../types/dtos/service';
import type { Category } from '../../pages/upsertServices';

// Header Component
export const ServiceHeader: React.FC = () => (
  <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl p-6 mb-6 text-white">
    <h1 className="text-2xl font-semibold mb-1">Set Up Your Services</h1>
    <p className="text-purple-50">Select services you offer and customize pricing</p>
  </div>
);

// Add Custom Button Component
export const AddCustomButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="mb-6">
    <button 
      onClick={onClick}
      className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center gap-2"
    >
      <Plus size={20} />
      Add custom
    </button>
  </div>
);

// Loading Component
export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// Service Item Component
interface ServiceItemProps {
  service: IServiceSelectionDto;
  categoryIndex: number;
  serviceIndex: number;
  editingService: string | null;
  onToggleSelection: () => void;
  onToggleEdit: () => void;
  onUpdatePrice: (price: number) => void;
  onToggleHomeService: () => void;
  onDone: () => void;
  onCloseEdit: () => void;
  onDelete?: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  categoryIndex,
  serviceIndex,
  editingService,
  onToggleSelection,
  onToggleEdit,
  onUpdatePrice,
  onToggleHomeService,
  onDone,
  onCloseEdit,
  onDelete
}) => {
  const serviceKey = `${categoryIndex}-${serviceIndex}`;
  
  return (
    <div>
      {/* Service Item */}
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        {/* Checkbox */}
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={service.selected || false}
            onChange={onToggleSelection}
            className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        {/* Service Details */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{service.serviceName}</span>
              {service.isCustom && (
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">Custom</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {service.selected && (
                <button
                  onClick={onToggleEdit}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Edit2 size={18} />
                </button>
              )}
              {/* {service.isCustom && onDelete && (
                // <button
                //   onClick={onDelete}
                //   className="text-red-500 hover:text-red-700"
                // >
                //   <Trash2 size={18} />
                // </button>
              )} */}
            </div>
          </div>
          {!service.isCustom && (
            <p className="text-sm text-gray-500">
              Price: ₹{service.price}
            </p>
          )}
        </div>
      </div>

      {/* Edit Service Panel */}
      {service.selected && editingService === serviceKey && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              edit service
            </label>
            <button
              onClick={onCloseEdit}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Price Input */}
          <div className="mb-3">
            <input
              type="number"
              value={service.price || ''}
              onChange={(e) => onUpdatePrice(parseInt(e.target.value) || 0)}
              placeholder="Enter price"
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Home Service Checkbox */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={service.isHomeServiceAvailable}
                onChange={onToggleHomeService}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1">
                <span>🏠</span>
                Available for home service
              </span>
            </label>
          </div>

          {/* Done Button */}
          <button
            onClick={onDone}
            className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// Category Component
interface CategoryCardProps {
  category: Category;
  categoryIndex: number;
  editingService: string | null;
  onToggleCategory: () => void;
  onToggleServiceSelection: (serviceIndex: number) => void;
  onSetEditingService: (serviceKey: string | null) => void;
  onUpdateServicePrice: (serviceIndex: number, price: number) => void;
  onToggleHomeService: (serviceIndex: number) => void;
  onDone: (serviceIndex: number) => void;
  onAddCustomService: () => void;
  onDeleteCustomService?: (serviceIndex: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  categoryIndex,
  editingService,
  onToggleCategory,
  onToggleServiceSelection,
  onSetEditingService,
  onUpdateServicePrice,
  onToggleHomeService,
  onDone,
  onAddCustomService,
  onDeleteCustomService,

}) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    {/* Category Header */}
    <button
      onClick={onToggleCategory}
      className="w-full px-5 py-4 bg-purple-100 hover:bg-purple-150 transition-colors flex items-center justify-between text-left"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-800">{category.name}</span>
        {category.isCustomCategory && (
          <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">Custom Category</span>
        )}
      </div>
      <ChevronDown 
        size={20} 
        className={`text-gray-600 transition-transform ${category.expanded ? 'rotate-180' : ''}`}
      />
    </button>

    {/* Services List */}
    {category.expanded && (
      <div className="p-4 space-y-3">
        {category.services.map((service, serviceIndex) => {
          const serviceKey = `${categoryIndex}-${serviceIndex}`;
          return (
            <ServiceItem
              key={serviceKey}
              service={service}
              categoryIndex={categoryIndex}
              serviceIndex={serviceIndex}
              editingService={editingService}
              onToggleSelection={() => onToggleServiceSelection(serviceIndex)}
              onToggleEdit={() => onSetEditingService(editingService === serviceKey ? null : serviceKey)}
              onUpdatePrice={(price) => onUpdateServicePrice(serviceIndex, price)}
              onToggleHomeService={() => onToggleHomeService(serviceIndex)}
              onDone={() => onDone(serviceIndex)}
              onCloseEdit={() => onSetEditingService(null)}
              onDelete={service.isCustom && onDeleteCustomService ? () => onDeleteCustomService(serviceIndex) : undefined}
            />
          );
        })}

        {/* Add Custom Service to Category */}
        <button
          onClick={onAddCustomService}
          className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-gray-800 rounded-lg font-medium transition-colors"
        >
          + Add your own service to this category
        </button>
      </div>
    )}
  </div>
);

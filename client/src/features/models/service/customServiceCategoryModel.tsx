import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
  mode: 'add-to-category' | 'create-new-category';
  categoryName?: string;
  categoryId?: string | null;
}

export interface ServiceFormData {
  category: {
    name?: string;
    categoryId?: string;
  };
  service: {
    name: string;
    price: number;
    isHomeServiceAvailable: boolean;
  };
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  categoryName = '',
  categoryId = null
}) => {
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isHomeServiceAvailable, setIsHomeServiceAvailable] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategoryNameInput('');
      setServiceName('');
      setPrice(0);
      setIsHomeServiceAvailable(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!serviceName || price <= 0) {
      return;
    }
    
    const isCreateMode = mode === 'create-new-category';
    
    if (isCreateMode && !categoryNameInput) {
      return;
    }

    const formData: ServiceFormData = {
      category: isCreateMode 
        ? { name: categoryNameInput }
        : { categoryId: categoryId! },
      service: {
        name: serviceName,
        price: price,
        isHomeServiceAvailable: isHomeServiceAvailable
      }
    };

    onSave(formData);
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const isCreateMode = mode === 'create-new-category';
  const title = isCreateMode 
    ? 'Create New Category & Service' 
    : `Add service under ${categoryName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-purple-200 px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Category Name - Only for create mode */}
          {isCreateMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={categoryNameInput}
                onChange={(e) => setCategoryNameInput(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          )}

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter Service name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Price/Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isCreateMode ? 'Price' : 'Amount'}
            </label>
            <input
              type="number"
              value={price || ''}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              placeholder={isCreateMode ? 'Enter price' : 'Enter amount'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Home Service Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isHomeServiceAvailable}
                onChange={(e) => setIsHomeServiceAvailable(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <span>🏠</span>
                Available for home service
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            {isCreateMode ? 'Create category and service' : 'Save service'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
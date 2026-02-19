import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'service' | 'category';
  data: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  } | null;
  onUpdate: (id: string, data: any) => Promise<void>;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
}

export function EditModal({ isOpen, onClose, title, type, data, onUpdate, onToggleStatus }: EditModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setDescription(data.description || '');
      setIsActive(data.isActive);
    }
  }, [data]);

  const handleUpdate = async () => {
    if (!data || !name.trim()) return;

    setIsUpdating(true);
    try {
      const updateData = type === 'category' 
        ? { name: name.trim(), description: description.trim() }
        : { name: name.trim() };
        
      await onUpdate(data.id, updateData);
      onClose();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!data || type !== 'service') return;

    const newStatus = !isActive;
    setIsTogglingStatus(true);
    try {
      await onToggleStatus(data.id, newStatus);
      setIsActive(newStatus);
    } catch (error) {
      console.error(`Error toggling ${type} status:`, error);
    
      setIsActive(!newStatus);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (!isOpen || !data) return null;

  // Color scheme based on type
  const headerColor = type === 'service' ? 'bg-indigo-200' : 'bg-amber-100';
  const buttonColor = type === 'service' 
    ? 'bg-indigo-200 hover:bg-indigo-300' 
    : 'bg-amber-100 hover:bg-amber-200';
  const ringColor = type === 'service' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className={`${headerColor} px-6 py-4 rounded-t-lg flex items-center justify-between`}>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'service' ? 'Service name' : 'category name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 ${ringColor}`}
              disabled={isUpdating}
            />
          </div>

          {/* Description Field (only for category) */}
          {type === 'category' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 ${ringColor}`}
                disabled={isUpdating}
              />
            </div>
          )}

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Active status
            </label>
            <button
              onClick={handleToggleStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
              disabled={isUpdating || isTogglingStatus}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !name.trim()}
            className={`flex-1 px-4 py-2 ${buttonColor} text-gray-900 rounded-md text-sm font-medium transition-colors disabled:opacity-50`}
          >
            {isUpdating ? 'Updating...' : `Update ${type === 'service' ? 'Service' : 'Category'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
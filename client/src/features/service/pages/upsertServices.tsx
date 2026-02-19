import { useState, useEffect } from 'react';
import type { IServiceSelectionDto } from '../../../types/dtos/service';
import type {  IBeauticianServiceSelectionResponseData } from '../../../types/api/services';
import { BeauticianApi } from '../../../services/api/beautician';
import { toast } from 'react-toastify';
import type { ServiceFormData } from '../../models/service/customServiceCategoryModel';
import { handleApiError } from '../../../lib/utils/handleApiError';

export interface Category {
  id: string | null;
  name: string;
  services: IServiceSelectionDto[];
  expanded: boolean; // UI-only
  isCustomCategory: boolean; // UI-only
}
export function useServiceSetup(beauticianId: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
const [modalMode, setModalMode] = useState<'add-to-category' | 'create-new-category'>('add-to-category');
const [selectedCategoryName, setSelectedCategoryName] = useState('');
const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchServiceSelection();
  }, [beauticianId]);

  const fetchServiceSelection = async () => {
    try {
      setLoading(true);
      const response = await BeauticianApi.getServiceSeletion();
      const backendResponse: IBeauticianServiceSelectionResponseData=response.data.data??{
        categories:[],
          customServices:[]
      };
      
      
      const data = backendResponse || { categories: [], customServices: [] };
      
      // Convert system categories
      const systemCategories: Category[] = data.categories.map(cat => ({
        id: cat.categoryId,
        name: cat.categoryName,
        services: cat.services,
        expanded: false,
        isCustomCategory: false
      }));

      // Convert custom categories
      const customCategories: Category[] = data.customServices.map(cat => ({
        id: null,
        name: cat.categoryName,
        services: cat.services,
        expanded: false,
        isCustomCategory: true
      }));

      setCategories([...systemCategories, ...customCategories]);
    } catch (error) {
      console.error('Error fetching service selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryIndex: number) => {
    setCategories(categories.map((cat, idx) => 
      idx === categoryIndex ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const toggleServiceSelection = (categoryIndex: number, serviceIndex: number) => {
    setCategories(categories.map((cat, catIdx) => {
      if (catIdx === categoryIndex) {
        return {
          ...cat,
          services: cat.services.map((service, svcIdx) =>
            svcIdx === serviceIndex 
              ? { 
                  ...service, 
                  selected: !service.selected,
                  price: service.selected ? 0 : service.price
                }
              : service
          )
        };
      }
      return cat;
    }));
  };

  const updateServicePrice = (categoryIndex: number, serviceIndex: number, price: number) => {
    setCategories(categories.map((cat, catIdx) => {
      if (catIdx === categoryIndex) {
        return {
          ...cat,
          services: cat.services.map((service, svcIdx) =>
            svcIdx === serviceIndex ? { ...service, price } : service
          )
        };
      }
      return cat;
    }));
  };

  const toggleHomeService = (categoryIndex: number, serviceIndex: number) => {
    setCategories(categories.map((cat, catIdx) => {
      if (catIdx === categoryIndex) {
        return {
          ...cat,
          services: cat.services.map((service, svcIdx) =>
            svcIdx === serviceIndex 
              ? { ...service, isHomeServiceAvailable: !service.isHomeServiceAvailable }
              : service
          )
        };
      }
      return cat;
    }));
  };

  const handleDone = async (categoryIndex: number, serviceIndex: number) => {
    const category = categories[categoryIndex];
    const service = category.services[serviceIndex];
    
    setEditingService(null);

    try {
      // 
      const upsertPayload = {
        serviceId: service.serviceId!, 
        categoryId: category.id!, 
        price: service.price,
        isHomeServiceAvailable: service.isHomeServiceAvailable,
      };

    
      const response = await BeauticianApi.upsertSelectedService(upsertPayload)

      if (response.data.success) {
        toast.success(response.data.message)
      
        //await fetchServiceSelection();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

const handleAddCustomService = (categoryIndex: number) => {
  const category = categories[categoryIndex];
    setSelectedCategoryName(category.name);
    setSelectedCategoryId(category.id!); // ADD THIS
    setModalMode('add-to-category');
    setModalOpen(true);
};

const handleAddTopLevelCustom = () => {
   setSelectedCategoryId('');
  setModalMode('create-new-category');
  setModalOpen(true);
};
 const handleModalSave = async(data: ServiceFormData) => {
  try{
   const response=await BeauticianApi.addCustomService(data)
   if(response.data.success)
   {
    toast.success(response.data.message)
    setModalOpen(false)
      await fetchServiceSelection();
   }
  }catch(err)
  {
    handleApiError(err)
  }
  console.log('Save:', data);
};

  const handleDeleteCustomService = async (categoryIndex: number, serviceIndex: number) => {
    const service = categories[categoryIndex].services[serviceIndex];
    
    if (!service.submissionId) return;

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/beautician/service/${service.submissionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from UI
        setCategories(categories.map((cat, catIdx) => {
          if (catIdx === categoryIndex) {
            return {
              ...cat,
              services: cat.services.filter((_, svcIdx) => svcIdx !== serviceIndex)
            };
          }
          return cat;
        }));
      }
    } catch (error) {
      console.error('Error deleting custom service:', error);
    }
  };

  return {
    categories,
    editingService,
    setEditingService,
    loading,
    toggleCategory,
    toggleServiceSelection,
    updateServicePrice,
    toggleHomeService,
    handleDone,
    handleAddCustomService,
    handleAddTopLevelCustom,
    handleDeleteCustomService,
      modalOpen,
  setModalOpen,
  handleModalSave,
  modalMode,
  selectedCategoryName,
   selectedCategoryId 
  };
}
import { useState, useEffect } from 'react';
import type { IGetBeauticianServicesListDto } from '../types/dtos/service';
import { BeauticianApi } from '../services/api/beautician';
import { publicAPi } from '../services/api/public';
import type { PriceFilter } from '../types/api/services';

interface GroupedServices {
  [categoryName: string]: IGetBeauticianServicesListDto[];
}

interface UseServiceListOptions {
  beauticianId?: string;
  mode: 'own' | 'public';
}

// Group services by category
const groupServicesByCategory = (services: IGetBeauticianServicesListDto[]): GroupedServices => {
  const grouped: GroupedServices = {};
  
  services.forEach(service => {
    const categoryName = service.categoryName;
    if (categoryName) {
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(service);
    }
  });
  
  return grouped;
};

// Extract unique categories from services
const extractCategories = (services: IGetBeauticianServicesListDto[]): string[] => {
  const categorySet = new Set<string>();
  services.forEach(service => {
    if (service.categoryName) {
      categorySet.add(service.categoryName);
    }
  });
  return Array.from(categorySet);
};

export const useServiceListPage = ({ beauticianId, mode }: UseServiceListOptions) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<PriceFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allServices, setAllServices] = useState<IGetBeauticianServicesListDto[]>([]);
  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services when component mounts or filters change
useEffect(() => {
  loadServices();
}, [beauticianId, mode]);

const loadServices = async (
  filter = selectedFilter, 
  priceFilter = selectedPriceFilter
) => {
  console.log('🔍 loadServices called with:', { filter, priceFilter, mode, beauticianId });
  setLoading(true);
  setError(null);
  
  try {
    const response =
      mode === 'own'
        ? await BeauticianApi.getServiceList(filter, priceFilter) // ✅ use params
        : await publicAPi.getServiceList(
            filter,        // ✅ use params
            priceFilter,   // ✅ use params
            beauticianId!,
          );
    
    const services = response.data.data?.services;
    setAllServices(services ?? []);
    
    const grouped = groupServicesByCategory(services ?? []);
    setGroupedServices(grouped);
    
    const cats = extractCategories(services ?? []);
    setCategories(cats);
    
    if (cats.length > 0 && !selectedCategory) {
      setSelectedCategory(cats[0]);
    }
  } catch (err) {
    setError('Failed to load services. Please try again.');
    setAllServices([]);
    setGroupedServices({});
    setCategories([]);
  } finally {
    setLoading(false);
  }
};
const handleFilterChange = (newFilter: string) => {
    console.log('🎛️ filter changed to:', newFilter);
  setSelectedFilter(newFilter);
  loadServices(newFilter, selectedPriceFilter); 
}
const handlePriceFilterChange = (newFilter: PriceFilter) => {
    console.log('🎛️ filter changed to price:', newFilter);
  setSelectedPriceFilter(newFilter);
  loadServices(selectedFilter, newFilter); 
};
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCheck = async () => {
    await loadServices();
  };

  return {
    selectedFilter,
    selectedPriceFilter,
    selectedCategory,
    categories,
    currentServices: groupedServices[selectedCategory] || [],
    loading,
    error,
    handleFilterChange,
    handlePriceFilterChange,
    handleCategoryChange,
    handleCheck,
  };
};
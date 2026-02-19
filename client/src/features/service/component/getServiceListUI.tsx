import { ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import type { IGetBeauticianServicesListDto } from '../../../types/dtos/service';
import { useNavigate } from 'react-router-dom';
import type { PriceFilter } from '../../../types/api/services';
import { Trash2, ImageOff, FileImage } from 'lucide-react';

interface FilterSectionProps {
  selectedFilter: string;
  selectedPriceFilter: PriceFilter;
  loading: boolean;
  onFilterChange: (filter: string) => void;
  onPriceFilterChange: (filter: PriceFilter) => void;
  onCheck: () => void;
}

interface PamphletSectionProps {
  pamphletUrl?: string | null;
  viewMode: 'own-beautician' | 'customer';
  onDelete?: () => void;
}

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

interface ErrorMessageProps {
  error: string | null;
}

interface ServiceItemProps {
  service: IGetBeauticianServicesListDto;
}

interface ServiceListProps {
  selectedCategory: string;
  services: IGetBeauticianServicesListDto[];
  loading: boolean;
}

// Filter and Action Buttons Component
export const FilterSection = ({ 
  selectedFilter,
  selectedPriceFilter,
  loading, 
  onFilterChange,
  onPriceFilterChange,
  onCheck,  
}: FilterSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-3 mb-6">
      <div className="relative flex-1">
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          disabled={loading}
          className="w-full appearance-none bg-white border border-slate-300 text-slate-700 px-4 py-2.5 pr-10 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">All Services</option>
          <option value="home">Home Service Only</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>

      <div className="relative flex-1">
        <select
          value={selectedPriceFilter}
          onChange={(e) => onPriceFilterChange(e.target.value as PriceFilter)}
          disabled={loading}
          className="w-full appearance-none bg-white border border-slate-300 text-slate-700 px-4 py-2.5 pr-10 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">All Prices</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="under-500">Under ₹500</option>
          <option value="500-1000">₹500 - ₹1000</option>
          <option value="1000-2000">₹1000 - ₹2000</option>
          <option value="above-2000">Above ₹2000</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>
      
      <button 
        onClick={onCheck}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Check
      </button>
    </div>
  );
};

// Category Tabs Component
export const CategoryTabs = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryTabsProps) => {
  if (categories.length === 0) return null;
  
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// Error Message Component
export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-red-800 font-medium">Error</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    </div>
  );
};

export const PamphletSection = ({ pamphletUrl, viewMode, onDelete }: PamphletSectionProps) => {
  const isBeautician = viewMode === 'own-beautician';

  if (!pamphletUrl && !isBeautician) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileImage className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Service Pamphlet
          </h3>
        </div>
        {isBeautician && pamphletUrl && onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors border border-red-200 hover:border-red-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      {pamphletUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
          <img src={pamphletUrl} alt="Service Pamphlet" className="w-full object-contain max-h-[480px]" />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center gap-2 text-center">
          <ImageOff className="w-8 h-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No pamphlet uploaded yet</p>
          <p className="text-xs text-slate-400">Upload a pamphlet so customers can preview your services</p>
        </div>
      )}
    </div>
  );
};
// Service Item Component
export const ServiceItem = ({ service }: ServiceItemProps) => {
  return (
    <div className="bg-slate-50 hover:bg-slate-100 rounded-lg p-4 border border-slate-200 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-slate-700 font-medium block">{service.serviceName}</span>
          <div className="flex gap-2 mt-1">
            {service.isHomeServiceAvailable && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Home Service
              </span>
            )}
            {service.isCustom && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Custom
              </span>
            )}
          </div>
        </div>
        <span className="text-indigo-600 font-semibold text-lg">₹{service.price}</span>
      </div>
    </div>
  );
};

// Service List Component
export const ServiceList = ({ 
  selectedCategory, 
  services, 
  loading 
}: ServiceListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-200">
        {selectedCategory || 'Services'}
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-slate-600">Loading services...</span>
        </div>
      ) : services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">No services found for this category.</p>
        </div>
      )}
    </div>
  );
};
import { useSelector } from "react-redux";
import { useServiceListPage } from "../../../hooks/useServiceListPage";
import {
  CategoryTabs,
  ErrorMessage,
  FilterSection,
  PamphletSection,
  ServiceList,
} from "../component/getServiceListUI";
import type { RootState } from "../../../redux/appStore";
import { useEffect, useState } from "react";
import { BeauticianApi } from "../../../services/api/beautician";
import { toast } from "react-toastify";
import { handleApiError } from "../../../lib/utils/handleApiError";

const ServicePageList = () => {
  const beauticianId = useSelector(
    (state: RootState) => state.user.currentUser.userId,
  );
  
  const {
    selectedFilter,
    selectedPriceFilter,
    selectedCategory,
    categories,
    currentServices,
    loading,
    error,
    handleFilterChange,
    handlePriceFilterChange,
    handleCategoryChange,
    handleCheck,
  } = useServiceListPage({
    beauticianId: beauticianId!,
    mode: 'own',
  });
  const [pamphletUrl, setPamphletUrl] = useState<string | null>(null);

  useEffect(() => {
  BeauticianApi.getPamphlet()
    .then(res => setPamphletUrl(res.data?.data?.pamphletUrl ?? null))
    .catch(() => setPamphletUrl(null));

  
}, []);
  const handleDeletePamphlet = async () => {
  try {
    await BeauticianApi.deletePamphlet();
    setPamphletUrl(null);
    toast.success('Pamphlet removed successfully!');
  } catch (error) {
    toast.error('Failed to remove pamphlet');
    handleApiError(error);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <FilterSection
          selectedFilter={selectedFilter}
          selectedPriceFilter={selectedPriceFilter}
          loading={loading}
          onFilterChange={handleFilterChange}
          onPriceFilterChange={handlePriceFilterChange}
          onCheck={handleCheck}
        />

        <ErrorMessage error={error} />
 <PamphletSection
  pamphletUrl={pamphletUrl}
  viewMode="own-beautician"
  onDelete={handleDeletePamphlet}  // ✅ already wired up
/>
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <ServiceList
          selectedCategory={selectedCategory}
          services={currentServices}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ServicePageList;
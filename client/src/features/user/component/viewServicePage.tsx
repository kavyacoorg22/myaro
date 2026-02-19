import { useServiceListPage } from "../../../hooks/useServiceListPage";
import { CategoryTabs, ErrorMessage, FilterSection, PamphletSection, ServiceList } from "../../service/component/getServiceListUI";
import { useLocation } from "react-router";
import { SaidBar } from "./saidBar/saidbar";
import { useEffect, useState } from "react";
import { publicAPi } from "../../../services/api/public";

const ServicePageListForUser = () => {
  const location = useLocation();
   const beauticianId = location.state?.beauticianId;
  
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
  mode: 'public',
});

const [pamphletUrl, setPamphletUrl] = useState<string | null>(null);

useEffect(() => {
  if (beauticianId) {
    publicAPi.getPamphlet(beauticianId)
      .then(res => setPamphletUrl(res.data?.data?.pamphletUrl ?? null))
      .catch(() => setPamphletUrl(null));
  }
}, [beauticianId]);
  return (
    <>
    <SaidBar/>
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

        
       <PamphletSection pamphletUrl={pamphletUrl} viewMode="customer" />
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
    </>
  );
};


export default ServicePageListForUser
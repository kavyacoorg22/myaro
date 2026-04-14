import { useServiceListPage } from "../../../hooks/useServiceListPage";
import {
  CategoryTabs,
  ErrorMessage,
  FilterSection,
  PamphletSection,
  ServiceList,
} from "../../service/component/getServiceListUI";
import { useLocation } from "react-router";
import { SaidBar } from "./saidBar/saidbar";
import { useEffect, useState } from "react";
import { publicAPi } from "../../../services/api/public";
import { MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import { BeauticianApi } from "../../../services/api/beautician";
import { ReviewModal } from "../../models/homeServiceReviewModal";
import type { IGetServiceAreaDto } from "../../../types/dtos/beautician";

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
    mode: "public",
  });

  const [pamphletUrl, setPamphletUrl] = useState<string | null>(null);
  const [locations, setLocations] = useState<IGetServiceAreaDto>({});
  const [showReviews, setShowReviews] = useState(false);
  const [locationsExpanded, setLocationsExpanded] = useState(false);

  useEffect(() => {
    if (!beauticianId) return;

    publicAPi.getPamphlet(beauticianId)
      .then((res) => setPamphletUrl(res.data?.data?.pamphletUrl ?? null))
      .catch(() => setPamphletUrl(null));

    BeauticianApi.getLocationForUser(beauticianId)
      .then((res) => setLocations(res.data?.data?.locations ?? {}))
      .catch(() => setLocations({}));
  }, [beauticianId]);

  const allLocations = [
    ...(locations.serviceableLocation ?? []),
    ...(locations.homeServiceableLocation ?? []),
  ];

  const PREVIEW_COUNT = 2;
  const visibleLocations = locationsExpanded ? allLocations : allLocations.slice(0, PREVIEW_COUNT);
  const hasMore = allLocations.length > PREVIEW_COUNT;

  return (
    <>
      <SaidBar />
      <div className="min-h-screen bg-[#faf8f6] p-5">
        <div className="max-w-2xl mx-auto">

          {/* Top bar: filters + review */}
          <div className="flex items-start gap-3 mb-5">
            <div className="flex-1">
              <FilterSection
                selectedFilter={selectedFilter}
                selectedPriceFilter={selectedPriceFilter}
                loading={loading}
                onFilterChange={handleFilterChange}
                onPriceFilterChange={handlePriceFilterChange}
                onCheck={handleCheck}
              />
            </div>
            <button
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-1.5 text-sm font-semibold bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 px-3.5 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap mt-0"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Reviews
            </button>
          </div>

          <ErrorMessage error={error} />

          {/* Service Locations */}
          {allLocations.length > 0 && (
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm mb-5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-rose-50 bg-rose-50/50">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <span className="text-sm font-semibold text-rose-700 tracking-wide">
                  Service Locations
                </span>
                <span className="ml-auto text-xs font-medium text-rose-400 bg-rose-100 px-2 py-0.5 rounded-full">
                  {allLocations.length} areas
                </span>
              </div>

              {/* Location list */}
              <div className="divide-y divide-slate-50">
                {visibleLocations.map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                    <span className="text-sm text-slate-600">
                      {loc.formattedString ?? loc.city ?? String(loc)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Show more / less */}
              {hasMore && (
                <button
                  onClick={() => setLocationsExpanded(!locationsExpanded)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors border-t border-rose-50"
                >
                  {locationsExpanded ? (
                    <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                  ) : (
                    <><ChevronDown className="w-3.5 h-3.5" /> +{allLocations.length - PREVIEW_COUNT} more areas</>
                  )}
                </button>
              )}
            </div>
          )}

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

      {showReviews && beauticianId && (
        <ReviewModal
          beauticianId={beauticianId}
          onClose={() => setShowReviews(false)}
        />
      )}
    </>
  );
};

export default ServicePageListForUser;
import { useSelector } from "react-redux";
import { useServiceSetup } from "../../pages/upsertServices";
import { AddCustomButton, CategoryCard, LoadingSpinner, ServiceHeader } from "./upsertSelectionUI";
import type { RootState } from "../../../../redux/appStore";
import AddServiceModal from "../../../models/service/customServiceCategoryModel";

export default function ServiceSetup() {
  const beauticianId = useSelector((store: RootState) => store.user.currentUser.userId);

  const {
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
  } = useServiceSetup(beauticianId!);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <ServiceHeader />
        
        <AddCustomButton onClick={handleAddTopLevelCustom} />

        <div className="space-y-4">
          {categories.map((category, categoryIndex) => (
            <CategoryCard
              key={`${category.id || category.name}-${categoryIndex}`}
              category={category}
              categoryIndex={categoryIndex}
              editingService={editingService}
              onToggleCategory={() => toggleCategory(categoryIndex)}
              onToggleServiceSelection={(serviceIndex) => toggleServiceSelection(categoryIndex, serviceIndex)}
              onSetEditingService={setEditingService}
              onUpdateServicePrice={(serviceIndex, price) => updateServicePrice(categoryIndex, serviceIndex, price)}
              onToggleHomeService={(serviceIndex) => toggleHomeService(categoryIndex, serviceIndex)}
              onDone={(serviceIndex) => handleDone(categoryIndex, serviceIndex)}
              onAddCustomService={() => handleAddCustomService(categoryIndex)}
              onDeleteCustomService={(serviceIndex) => handleDeleteCustomService(categoryIndex, serviceIndex)}
            />
          ))}
        </div>

        {/* Add Service Modal */}
        <AddServiceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
          mode={modalMode}
          categoryName={selectedCategoryName}
          categoryId={selectedCategoryId}
        />
      </div>
    </div>
  );
}
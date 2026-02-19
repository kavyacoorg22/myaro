// import { useState } from 'react';

// function useServiceSetup() {
//   const [categories, setCategories] = useState<Category[]>(initialCategories);
//   const [editingService, setEditingService] = useState<string | null>(null);

//   const toggleCategory = (categoryId: string) => {
//     setCategories(categories.map(cat => 
//       cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
//     ));
//   };

//   const toggleServiceSelection = (categoryId: string, serviceId: string) => {
//     setCategories(categories.map(cat => {
//       if (cat.id === categoryId) {
//         return {
//           ...cat,
//           services: cat.services.map(service =>
//             service.id === serviceId 
//               ? { 
//                   ...service, 
//                   selected: !service.selected, 
//                   price: service.selected ? undefined : service.suggestedPrice 
//                 }
//               : service
//           )
//         };
//       }
//       return cat;
//     }));
//   };

//   const updateServicePrice = (categoryId: string, serviceId: string, price: number) => {
//     setCategories(categories.map(cat => {
//       if (cat.id === categoryId) {
//         return {
//           ...cat,
//           services: cat.services.map(service =>
//             service.id === serviceId ? { ...service, price } : service
//           )
//         };
//       }
//       return cat;
//     }));
//   };

//   const toggleHomeService = (categoryId: string, serviceId: string) => {
//     setCategories(categories.map(cat => {
//       if (cat.id === categoryId) {
//         return {
//           ...cat,
//           services: cat.services.map(service =>
//             service.id === serviceId 
//               ? { ...service, homeServiceAvailable: !service.homeServiceAvailable }
//               : service
//           )
//         };
//       }
//       return cat;
//     }));
//   };

//   const handleDone = (categoryId: string, serviceId: string) => {
//     setEditingService(null);
//     // API call would go here
//     console.log('Saving service:', { categoryId, serviceId });
//     // Example API call:
//     // await fetch('/api/services', { method: 'POST', body: JSON.stringify({...}) });
//   };

//   const handleAddCustomService = (categoryId: string) => {
//     console.log('Add custom service to category:', categoryId);
//     // This will open a modal later
//   };

//   const handleAddTopLevelCustom = () => {
//     console.log('Add top-level custom service');
//     // This will open a modal later
//   };

//   return {
//     categories,
//     editingService,
//     setEditingService,
//     toggleCategory,
//     toggleServiceSelection,
//     updateServicePrice,
//     toggleHomeService,
//     handleDone,
//     handleAddCustomService,
//     handleAddTopLevelCustom
//   };
// }
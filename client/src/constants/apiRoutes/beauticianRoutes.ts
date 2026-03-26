export const beauticianApi = {
  register: "/beautician/register",
  getStatus: "/beautician/status",
  profile: "/beautician/profile",
  getServiceSelection: "/beautician/services/selection",
  upsertSelectedService: "/beautician/services",
  addCustomService: "/beautician/services/custom",
  getServiceLists: "/beautician/services",
  addPamphlet: "/beautician/pamphlet",
  deletePamphlet: "/beautician/pamphlet",
  getPamphlet: "/beautician/pamphlet",
  addSchedule: "/beautician/schedules",
  deleteSchedule: "/beautician/schedules/:id",
  getSchedule: "/beautician/schedules",
  getLocation: "/beautician/location",
  addLocation: "/beautician/location",
  addRecurringSlot:'/beautician/schedules/recurring',
  getMonthlyAvailability:'/beautician/schedules/month',
  deleteRecurringSlot:'/beautician/schedules/recurring/:id',
 
  getBeauticianPost:'/beautician/posts/me',
  getBeauticianBookings:'/beautician/bookings'
};

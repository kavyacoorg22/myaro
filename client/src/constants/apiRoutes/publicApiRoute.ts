export const publicApiRoutes={
  ownProfile:'/profile/me',
  profileByUserId:'/profile/:id',
  profileImage:'/profile/profile-image',
  search:'/search',
  addSearchHistory:'/search/history/:id',
  removeSearchHistory:'/search/history/:id',
  clearSearchHistory:'/search/history',
  searchHistory:'/search/history',
    getService: "/category/:categoryId/services",
    getCategory:'/category',
    getAvailabilityOfBeautician:'/beautician/schedules/:id',
    getBeauticianServiceList:'/beautician/services/:id',
   getPamplet:'/beautician/pamhlet/:beauticianId',
   changePassword:'/change-password'
}
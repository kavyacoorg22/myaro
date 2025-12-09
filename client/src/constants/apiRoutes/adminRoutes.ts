export const adminApiRoute={
  adminLogin:'/admin/login',
  getAllUser:'/admin/users',
  toggleUser:'/admin/users/:id/status',
  getBeautician:"/admin/beautician",
  viewBeautician:"/admin/beautician/:id",
  approveBeautician:"/admin/beautician/:id/approve",
  rejectBeautician:"/admin/beautician/:id/reject"
}
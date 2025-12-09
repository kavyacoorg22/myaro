export enum UserRole{
  CUSTOMER="customer",
  BEAUTICIAN="beautician",
  ADMIN='admin'
} 

export enum UserFilterRole{
   CUSTOMER="customer",
  BEAUTICIAN="beautician",
}

export  type UserRoleFilter=UserFilterRole|"all"
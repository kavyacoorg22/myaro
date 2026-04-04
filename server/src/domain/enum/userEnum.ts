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

export enum PostType{
  POST='post',
  TIPS='tips',
  RENT='rent'
}

export enum CommentType{
  POST='post',
  HOME='home'
}
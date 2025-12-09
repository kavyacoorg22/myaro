export const UserRole={
  CUSTOMER:"customer",
  BEAUTICIAN:"beautician",
  ADMIN:"admin"
} as const

export type UserRoleType=(typeof UserRole)[keyof typeof UserRole]

export const UserRoleFilter = {
  ALL: 'all',
  ...UserRole,
} as const;

export type UserRoleFilterType = (typeof UserRoleFilter)[keyof typeof UserRoleFilter];
export const BeauticianStatus={
  PENDING:"pending",
  VERIFIED:"verified",
  REJECTED:"rejected"
} as const

export type BeauticianStatusType=(typeof BeauticianStatus)[keyof typeof BeauticianStatus]

export const BeauticianStatusFilter = {
  ALL: 'all',
  ...BeauticianStatus,
} as const;

export type BeauticianStatusFilterType = (typeof BeauticianStatusFilter)[keyof typeof BeauticianStatusFilter];
export  const CustomServiceStatus={
   PENDING:"pending",
   APPROVED:"approved",
   REJECTED:"rejected"
}

export type CustomServiceStatusType=(typeof CustomServiceStatus)[keyof typeof CustomServiceStatus]

export const CustomServiceFilter={
   TODAY:"today",
   YESTERDAY:'yesterday',
   EARLIER:'earlier'
}

export type CustomServiceFilterType=(typeof CustomServiceFilter)[keyof typeof CustomServiceFilter]

export  const CategoryServiceType={
   SYSTEM:"system",
   CUSTOM:"custom"
}

export type CategoryServiceTypes=(typeof CategoryServiceType)[keyof typeof CategoryServiceType]

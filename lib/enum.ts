export enum UserRolesEnum {
  Customer = 'Customer',
}

export enum StaffUserRolesEnum {
  Admin = 'Admin',
  StoreStaff = 'StoreStaff',
  KitchenStaff = 'KitchenStaff',
  DeliveryStaff = 'DeliveryStaff',
}

export enum ProductSizeEnum {
  Small = 'Small',
  Regular = 'Regular',
  Large = 'Large',
}

export enum OrderStatusEnum {
  Pending = 'Pending',
  Cancelled = 'Cancelled',
  Preparing = 'Preparing',
  ReadyToPickUpFromStore = 'ReadyToPickUpFromStore',
  ReadyToDeliverToHome = 'ReadyToDeliverToHome',
  Delivered = 'Delivered',
}

export enum OrderTypeEnum {
  PickUpFromStore = 'PickUpFromStore',
  DeliverToHome = 'DeliverToHome',
}
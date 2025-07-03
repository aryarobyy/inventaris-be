export enum Role {
  PENDING = 'pending',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum ItemCategory {
  COMPUTER = 'computer',
  WEB_CAM = 'web_cam',
  PRINTER = 'printer',
  PROJECTOR = 'projector',
  CABLE = 'cable',
  MOUSE = 'mouse',
  KEYBOARD = 'keyboard',
  HEADSET = 'headset',
  MONITOR = 'monitor',
  LAPTOP = 'laptop'
}

export enum ItemCondition {
  GOOD = 'good',
  DAMAGED = 'damaged',
  REPAIR = 'repair',
  LOST = 'lost'
}

export enum ItemAvailability {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired'
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
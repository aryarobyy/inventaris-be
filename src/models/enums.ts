export type Role = 'pending' | 'admin' | 'super_admin';

export type ItemCategory = 'computer' | 'web_cam' | 'printer' | 'projector' | 'cable' | 'mouse' | 'keyboard' | 'headset' | 'monitor' | 'laptop';

export type ItemCondition = 'good' | 'damaged' | 'repair' | 'lost';

export type ItemAvailability = 'available' | 'borrowed' | 'maintenance' | 'retired';

export type LoanStatus = 'pending' | 'approved' | 'active' | 'returned' | 'overdue' | 'cancelled';

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'out_of_service';

export type BookingStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
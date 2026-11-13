export type ShipmentStatus = 
  | 'pending'          // Chờ điều phối
  | 'picked_up'        // Đã lấy hàng
  | 'in_transit'       // Đang luân chuyển
  | 'out_for_delivery' // Đang phát hàng
  | 'delivered'        // Giao thành công
  | 'failed'           // Giao thất bại
  | 'cancelled';       // Hủy đơn

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  location: string;
  note: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;       // Ví dụ: LOG-88231
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  weightKg: number;
  codAmount: number;          // Tiền thu hộ (VNĐ)
  shippingFee: number;        // Cước phí (VNĐ)
  status: ShipmentStatus;
  driverName?: string;
  driverPhone?: string;
  currentHub: string;
  createdAt: string;
  events: TrackingEvent[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  vehicleType: 'Xe máy' | 'Xe tải 1.5T' | 'Xe tải 3.5T';
  status: 'active' | 'busy' | 'offline';
}
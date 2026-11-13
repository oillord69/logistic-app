import type { Shipment, Driver } from '../types';

export const INITIAL_DRIVERS: Driver[] = [
  { id: 'drv-1', name: 'Nguyễn Văn Hùng', phone: '0912 345 678', licensePlate: '29C-883.21', vehicleType: 'Xe tải 1.5T', status: 'active' },
  { id: 'drv-2', name: 'Trần Đình Trọng', phone: '0988 765 432', licensePlate: '29D-112.45', vehicleType: 'Xe máy', status: 'active' },
  { id: 'drv-3', name: 'Lê Hoàng Nam', phone: '0903 112 233', licensePlate: '29C-990.12', vehicleType: 'Xe tải 3.5T', status: 'busy' },
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'shp-1',
    trackingCode: 'LOG-88201',
    senderName: 'Công ty May Mặc An Phát',
    senderPhone: '024 3829 1100',
    senderAddress: 'Kho Long Biên, Hà Nội',
    receiverName: 'Chị Nguyễn Thu Hà',
    receiverPhone: '0978 123 456',
    receiverAddress: 'Số 45 Cầu Giấy, Quan Hoa, Hà Nội',
    weightKg: 2.5,
    codAmount: 450000,
    shippingFee: 35000,
    status: 'out_for_delivery',
    driverName: 'Trần Đình Trọng',
    driverPhone: '0988 765 432',
    currentHub: 'Bưu cục Cầu Giấy',
    createdAt: '2026-11-12 08:30',
    events: [
      { id: 'e1', status: 'pending', location: 'Kho Long Biên, Hà Nội', note: 'Đơn hàng đã được tạo trên hệ thống', timestamp: '2026-11-12 08:30' },
      { id: 'e2', status: 'picked_up', location: 'Kho Long Biên, Hà Nội', note: 'Tài xế đã lấy hàng thành công', timestamp: '2026-11-12 10:15' },
      { id: 'e3', status: 'out_for_delivery', location: 'Bưu cục Cầu Giấy', note: 'Shipper đang trên đường giao đến bạn', timestamp: '2026-11-12 14:00' }
    ]
  },
  {
    id: 'shp-2',
    trackingCode: 'LOG-88202',
    senderName: 'Shop Công Nghệ SmartHome',
    senderPhone: '0912 999 888',
    senderAddress: '120 Thái Hà, Đống Đa, Hà Nội',
    receiverName: 'Anh Phạm Quốc Huy',
    receiverPhone: '0934 567 890',
    receiverAddress: 'Toà Landmark 72, Nam Từ Liêm, Hà Nội',
    weightKg: 0.8,
    codAmount: 1200000,
    shippingFee: 40000,
    status: 'pending',
    currentHub: 'Kho Đống Đa',
    createdAt: '2026-11-13 09:15',
    events: [
      { id: 'e4', status: 'pending', location: 'Kho Đống Đa', note: 'Đơn hàng mới tạo, đang chờ gán tài xế', timestamp: '2026-11-13 09:15' }
    ]
  },
  {
    id: 'shp-3',
    trackingCode: 'LOG-88203',
    senderName: 'Gốm Sứ Bát Tràng',
    senderPhone: '0904 555 666',
    senderAddress: 'Làng gốm Bát Tràng, Gia Lâm, Hà Nội',
    receiverName: 'Khách sạn Metropole',
    receiverPhone: '024 3826 6919',
    receiverAddress: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
    weightKg: 12.0,
    codAmount: 0,
    shippingFee: 150000,
    status: 'delivered',
    driverName: 'Nguyễn Văn Hùng',
    driverPhone: '0912 345 678',
    currentHub: 'Kho Hoàn Kiếm',
    createdAt: '2026-11-11 14:00',
    events: [
      { id: 'e5', status: 'delivered', location: '15 Ngô Quyền, Hoàn Kiếm', note: 'Giao hàng thành công - Khách đã ký nhận', timestamp: '2026-11-12 11:30' }
    ]
  }
];
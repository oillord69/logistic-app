import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { INITIAL_SHIPMENTS, INITIAL_DRIVERS } from './lib/mockData';
import type { Shipment, ShipmentStatus } from './types';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Search, 
  PlusCircle, 
  ArrowRight,
  MapPin, 
  User, 
  Phone,
  X
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dispatch' | 'driver' | 'tracking'>('dispatch');
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [searchCode, setSearchCode] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // State modal tạo đơn mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    weightKg: 1.0,
    codAmount: 0,
    shippingFee: 30000,
    currentHub: 'Kho Trung Chuyển Hà Nội'
  });

  // Thống kê nhanh
  const totalOrders = shipments.length;
  const inTransitOrders = shipments.filter(s => s.status === 'out_for_delivery' || s.status === 'in_transit').length;
  const deliveredOrders = shipments.filter(s => s.status === 'delivered').length;
  const pendingOrders = shipments.filter(s => s.status === 'pending').length;

  // Lọc danh sách vận đơn
  const filteredShipments = shipments.filter(s => {
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchSearch = s.trackingCode.toLowerCase().includes(searchCode.toLowerCase()) ||
                        s.receiverName.toLowerCase().includes(searchCode.toLowerCase()) ||
                        s.receiverPhone.includes(searchCode);
    return matchStatus && matchSearch;
  });

  // Cập nhật trạng thái vận đơn
  const handleUpdateStatus = (id: string, newStatus: ShipmentStatus, customNote?: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        const noteMap: Record<ShipmentStatus, string> = {
          pending: 'Đơn hàng mới tạo, đang chờ xử lý',
          picked_up: 'Tài xế đã nhận hàng tại bưu cục/kho gửi',
          in_transit: 'Kiện hàng đang luân chuyển qua trạm trung chuyển',
          out_for_delivery: 'Shipper đang trên đường đi phát hàng đến người nhận',
          delivered: 'Giao hàng thành công - Khách đã nhận và thanh toán',
          failed: 'Giao không thành công (không liên lạc được / hẹn lại)',
          cancelled: 'Đơn hàng đã bị hủy'
        };

        return {
          ...s,
          status: newStatus,
          events: [
            ...s.events,
            {
              id: Date.now().toString(),
              status: newStatus,
              location: s.currentHub,
              note: customNote || noteMap[newStatus],
              timestamp: new Date().toLocaleString('vi-VN')
            }
          ]
        };
      }
      return s;
    }));
  };

  // Gán tài xế cho đơn
  const handleAssignDriver = (shipmentId: string, driverId: string) => {
    const driver = INITIAL_DRIVERS.find(d => d.id === driverId);
    if (!driver) return;

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          driverName: driver.name,
          driverPhone: driver.phone,
          status: 'out_for_delivery',
          events: [
            ...s.events,
            {
              id: Date.now().toString(),
              status: 'out_for_delivery',
              location: s.currentHub,
              note: `Đã phân công tài xế ${driver.name} (${driver.phone}) đi giao`,
              timestamp: new Date().toLocaleString('vi-VN')
            }
          ]
        };
      }
      return s;
    }));
  };

  // Tạo đơn hàng mới
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.senderName || !newOrder.receiverName || !newOrder.receiverPhone) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    const randomCode = 'LOG-' + Math.floor(10000 + Math.random() * 90000);
    const created: Shipment = {
      id: 'shp-' + Date.now(),
      trackingCode: randomCode,
      senderName: newOrder.senderName,
      senderPhone: newOrder.senderPhone,
      senderAddress: newOrder.senderAddress,
      receiverName: newOrder.receiverName,
      receiverPhone: newOrder.receiverPhone,
      receiverAddress: newOrder.receiverAddress,
      weightKg: Number(newOrder.weightKg),
      codAmount: Number(newOrder.codAmount),
      shippingFee: Number(newOrder.shippingFee),
      status: 'pending',
      currentHub: newOrder.currentHub,
      createdAt: new Date().toLocaleString('vi-VN'),
      events: [
        {
          id: 'ev-' + Date.now(),
          status: 'pending',
          location: newOrder.currentHub,
          note: 'Đơn hàng mới tạo thành công, chờ điều phối xe',
          timestamp: new Date().toLocaleString('vi-VN')
        }
      ]
    };

    setShipments([created, ...shipments]);
    setIsModalOpen(false);
    setNewOrder({
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      weightKg: 1.0,
      codAmount: 0,
      shippingFee: 30000,
      currentHub: 'Kho Trung Chuyển Hà Nội'
    });
    alert(`Đã tạo thành công vận đơn: ${randomCode}!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* =========================================
            PHÂN HỆ 1: BÀN ĐIỀU PHỐI (ADMIN / DISPATCHER)
            ========================================= */}
        {currentTab === 'dispatch' && (
          <div className="space-y-6">
            {/* 4 Thẻ KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tổng vận đơn</p>
                  <p className="text-2xl font-bold text-slate-800">{totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Chờ lấy / điều phối</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Đang vận chuyển</p>
                  <p className="text-2xl font-bold text-indigo-600">{inTransitOrders}</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Truck className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Giao thành công</p>
                  <p className="text-2xl font-bold text-emerald-600">{deliveredOrders}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-6 h-6" /></div>
              </div>
            </div>

            {/* Bảng Quản Lý Vận Đơn */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-white">
                <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                  <div className="relative w-full max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Tìm mã vận đơn, người nhận, SĐT..."
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="py-2 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ điều phối</option>
                    <option value="out_for_delivery">Đang giao hàng</option>
                    <option value="delivered">Đã giao thành công</option>
                  </select>
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Tạo Vận Đơn Mới</span>
                </button>
              </div>

              {/* Bảng danh sách */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Mã Vận Đơn</th>
                      <th className="p-4">Người Nhận & Địa Chỉ</th>
                      <th className="p-4">Tiền Thu Hộ (COD)</th>
                      <th className="p-4">Phân Công Tài Xế</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-blue-600">{shipment.trackingCode}</td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-800">{shipment.receiverName} - <span className="text-slate-500 font-normal">{shipment.receiverPhone}</span></p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{shipment.receiverAddress}</p>
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          {shipment.codAmount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="p-4">
                          {shipment.driverName ? (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                              <Truck className="w-3.5 h-3.5 text-blue-600" />
                              {shipment.driverName}
                            </span>
                          ) : (
                            <select
                              onChange={(e) => handleAssignDriver(shipment.id, e.target.value)}
                              defaultValue=""
                              className="text-xs border border-amber-300 bg-amber-50 text-amber-800 font-medium rounded-lg px-2 py-1 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                            >
                              <option value="" disabled>⚡ Chọn tài xế...</option>
                              {INITIAL_DRIVERS.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.vehicleType})</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-medium ${
                            shipment.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            shipment.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {shipment.status === 'delivered' ? '✓ Đã giao hàng' :
                             shipment.status === 'out_for_delivery' ? '🚚 Đang giao' : '⏳ Chờ lấy'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSearchCode(shipment.trackingCode);
                              setCurrentTab('tracking');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            Tra cứu <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            PHÂN HỆ 2: APP TÀI XẾ (DRIVER PORTAL)
            ========================================= */}
        {currentTab === 'driver' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 p-5 text-white flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">App Tài Xế Giao Hàng</h2>
                <p className="text-xs text-emerald-100 flex items-center gap-1 mt-1">
                  <User className="w-3.5 h-3.5" /> {INITIAL_DRIVERS[0].name} • {INITIAL_DRIVERS[0].licensePlate}
                </p>
              </div>
              <div className="bg-emerald-700/80 p-2 rounded-xl text-center">
                <p className="text-[10px] uppercase font-bold text-emerald-200">Đơn hôm nay</p>
                <p className="text-lg font-black">{shipments.length}</p>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" /> Danh sách kiện hàng cần giao:
              </p>

              {shipments.map(s => (
                <div key={s.id} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2.5 hover:border-slate-300 transition">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600 text-sm">{s.trackingCode}</span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      COD: {s.codAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <p className="text-slate-800 font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {s.receiverName}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.receiverPhone}
                    </p>
                    <p className="text-slate-500 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> {s.receiverAddress}
                    </p>
                  </div>
                  
                  {/* Nút hành động của Shipper */}
                  <div className="pt-2 border-t border-slate-200/60 flex gap-2">
                    {s.status !== 'delivered' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'out_for_delivery', 'Shipper đang trên đường tới giao')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition cursor-pointer"
                        >
                          🚚 Đang đi giao
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'delivered')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition cursor-pointer shadow-sm"
                        >
                          ✓ Đã giao & Thu tiền
                        </button>
                      </>
                    ) : (
                      <div className="w-full bg-emerald-100 text-emerald-800 text-xs font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã giao thành công
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            PHÂN HỆ 3: TRA CỨU VẬN ĐƠN CÔNG KHAI
            ========================================= */}
        {currentTab === 'tracking' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Tra Cứu Tiến Trình Vận Đơn</h2>
              <p className="text-sm text-slate-500">Nhập mã vận đơn (VD: LOG-88201) để xem chi tiết lộ trình theo thời gian thực</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã vận đơn..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button 
                onClick={() => {}}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
              >
                Tra Cứu
              </button>
            </div>

            {/* Chi tiết lộ trình */}
            {shipments.filter(s => s.trackingCode.toLowerCase() === (searchCode || 'LOG-88201').toLowerCase()).map(s => (
              <div key={s.id} className="mt-6 border-t border-slate-200 pt-6 space-y-6">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-amber-700 uppercase font-bold">Mã Vận Đơn</p>
                    <p className="text-xl font-black text-amber-900">{s.trackingCode}</p>
                    <p className="text-xs text-slate-600 mt-1">Đến: <span className="font-bold">{s.receiverName}</span> ({s.receiverAddress})</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {s.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">COD: <b className="text-slate-800">{s.codAmount.toLocaleString('vi-VN')} đ</b></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> Hành trình đơn hàng:
                  </h4>
                  <div className="relative pl-6 border-l-2 border-blue-500 space-y-6">
                    {s.events.map((ev) => (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white" />
                        <p className="text-xs text-slate-400 font-medium">{ev.timestamp}</p>
                        <p className="text-sm font-bold text-slate-800">{ev.location}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{ev.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL TẠO VẬN ĐƠN MỚI */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" /> Tạo Vận Đơn Mới
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Người gửi</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên người gửi..."
                    value={newOrder.senderName}
                    onChange={(e) => setNewOrder({ ...newOrder, senderName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Người nhận (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="Họ tên người nhận..."
                      value={newOrder.receiverName}
                      onChange={(e) => setNewOrder({ ...newOrder, receiverName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SĐT người nhận (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="09xx..."
                      value={newOrder.receiverPhone}
                      onChange={(e) => setNewOrder({ ...newOrder, receiverPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, đường, quận/huyện, tỉnh..."
                    value={newOrder.receiverAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, receiverAddress: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Khối lượng (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newOrder.weightKg}
                      onChange={(e) => setNewOrder({ ...newOrder, weightKg: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiền COD (VNĐ)</label>
                    <input
                      type="number"
                      value={newOrder.codAmount}
                      onChange={(e) => setNewOrder({ ...newOrder, codAmount: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cước phí (VNĐ)</label>
                    <input
                      type="number"
                      value={newOrder.shippingFee}
                      onChange={(e) => setNewOrder({ ...newOrder, shippingFee: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition shadow"
                  >
                    Tạo Đơn Ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

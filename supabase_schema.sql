-- ========================================================
-- LOGIX EXPRESS - SUPABASE DATABASE SCHEMA (PostgreSQL)
-- Chạy script này trong mục SQL Editor trên Supabase Dashboard
-- ========================================================

-- 1. Bảng profiles (Liên kết với Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  role text check (role in ('admin', 'dispatcher', 'driver', 'customer')) default 'customer',
  created_at timestamp with time zone default now()
);

-- 2. Bảng trạm trung chuyển / Kho bãi (Hubs)
create table if not exists hubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  capacity int default 1000
);

-- 3. Bảng tài xế & phương tiện giao hàng
create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  vehicle_type text check (vehicle_type in ('motorbike', 'van', 'truck')) default 'motorbike',
  license_plate text not null,
  status text check (status in ('active', 'busy', 'offline')) default 'active'
);

-- 4. Bảng vận đơn (Shipments)
create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_code text unique not null,
  sender_name text not null,
  sender_phone text not null,
  sender_address text not null,
  receiver_name text not null,
  receiver_phone text not null,
  receiver_address text not null,
  weight_kg numeric default 1.0,
  cod_amount numeric default 0,
  shipping_fee numeric default 30000,
  status text check (status in (
    'pending',
    'picked_up',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'failed',
    'cancelled'
  )) default 'pending',
  driver_id uuid references drivers(id) on delete set null,
  current_hub text default 'Kho Trung Chuyển Hà Nội',
  created_at timestamp with time zone default now()
);

-- 5. Bảng nhật ký lộ trình (Tracking Events)
create table if not exists tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references shipments(id) on delete cascade,
  status text not null,
  location text not null,
  note text,
  created_at timestamp with time zone default now()
);

-- Dữ liệu mẫu ban đầu (Initial Seed Data)
insert into hubs (name, address, city) values
  ('Kho Tổng Long Biên', 'Số 1 Huỳnh Tấn Phát, Long Biên', 'Hà Nội'),
  ('Bưu cục Cầu Giấy', '45 Cầu Giấy, Quan Hoa', 'Hà Nội'),
  ('Kho Đống Đa', '120 Thái Hà, Trung Liệt', 'Hà Nội')
on conflict do nothing;

insert into drivers (name, phone, vehicle_type, license_plate, status) values
  ('Nguyễn Văn Hùng', '0912 345 678', 'truck', '29C-883.21', 'active'),
  ('Trần Đình Trọng', '0988 765 432', 'motorbike', '29D-112.45', 'active'),
  ('Lê Hoàng Nam', '0903 112 233', 'truck', '29C-990.12', 'busy')
on conflict do nothing;

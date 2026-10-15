-- ========================================================================
-- SABZI MANDI BATCHED DELIVERY SYSTEM - COMPLETE DBMS SCRIPT
-- Integrated with React Quick-Commerce Platform
-- Authors: Rehaan Shaikh, Anmol Shenoy, Aditya Sharma, Arnav Shinde
-- ========================================================================

-- 1. REGIONS & MANDIS
CREATE TABLE IF NOT EXISTS Regions (
    region_id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_name TEXT NOT NULL,
    pincode TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Mandis (
    mandi_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    operating_hours TEXT NOT NULL,
    phone_no TEXT NOT NULL
);

-- 2. FARMERS & VENDORS
CREATE TABLE IF NOT EXISTS Farmers (
    farmer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    farmer_type TEXT NOT NULL,
    rating REAL DEFAULT 4.8
);

CREATE TABLE IF NOT EXISTS Vendors (
    vendor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_name TEXT NOT NULL,
    region_id INTEGER,
    phone_number TEXT NOT NULL UNIQUE,
    shop_number TEXT,
    mandi_id INTEGER,
    rating REAL DEFAULT 4.7,
    FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE CASCADE,
    FOREIGN KEY (mandi_id) REFERENCES Mandis(mandi_id)
);

-- 3. PRODUCTS & INVENTORY
CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    category TEXT CHECK(category IN ('Vegetable', 'Fruit')) NOT NULL,
    hindi_name TEXT,
    unit TEXT DEFAULT '1 kg',
    description TEXT,
    image_url TEXT,
    shelf_life TEXT DEFAULT '3-4 days'
);

CREATE TABLE IF NOT EXISTS Vendor_Inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    price_per_kg REAL NOT NULL,
    stock_available_kg REAL NOT NULL CHECK (stock_available_kg >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE(vendor_id, product_id)
);

-- 4. CUSTOMERS
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    email TEXT,
    password_hash TEXT NOT NULL DEFAULT 'hashed_pwd_123',
    address_line TEXT NOT NULL,
    society_name TEXT DEFAULT 'Shivam Society',
    region_id INTEGER,
    FOREIGN KEY (region_id) REFERENCES Regions(region_id)
);

-- 5. DELIVERY BATCHES (COLONY MINI TRUCKS / TEMPOS)
CREATE TABLE IF NOT EXISTS Delivery_Batches (
    batch_id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id INTEGER,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    truck_number TEXT NOT NULL,
    delivery_date TEXT NOT NULL,
    shift TEXT CHECK(shift IN ('Morning', 'Evening')) NOT NULL,
    max_capacity_kg REAL DEFAULT 500.00,
    current_load_kg REAL DEFAULT 0.00,
    tracking_link TEXT NOT NULL,
    status TEXT DEFAULT 'Scheduled',
    FOREIGN KEY (region_id) REFERENCES Regions(region_id)
);

-- 6. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS Orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    vendor_id INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    total_amount REAL DEFAULT 0.00,
    payment_status TEXT CHECK(payment_status IN ('Pending', 'Paid', 'Failed')) DEFAULT 'Pending',
    payment_mode TEXT DEFAULT 'UPI',
    order_status TEXT CHECK(order_status IN ('Placed', 'Packed', 'Out for Delivery', 'Delivered')) DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address TEXT,
    society_name TEXT,
    delivery_slot TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id),
    FOREIGN KEY (batch_id) REFERENCES Delivery_Batches(batch_id)
);

CREATE TABLE IF NOT EXISTS Order_Items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity_kg REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- 7. TRIGGERS
-- Trigger: Deduct stock and increment tempo batch load upon item insert
CREATE TRIGGER IF NOT EXISTS After_Order_Item_Insert
AFTER INSERT ON Order_Items
BEGIN
    UPDATE Vendor_Inventory
    SET stock_available_kg = MAX(0, stock_available_kg - NEW.quantity_kg),
        last_updated = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id
      AND vendor_id = (SELECT vendor_id FROM Orders WHERE order_id = NEW.order_id);

    UPDATE Delivery_Batches
    SET current_load_kg = current_load_kg + NEW.quantity_kg
    WHERE batch_id = (SELECT batch_id FROM Orders WHERE order_id = NEW.order_id);
END;

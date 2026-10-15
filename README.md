# 🥦 SabziMandi Pro - Batched Quick Commerce Platform

> **DBMS Mini-Project & Production Quick-Commerce Application**  
> **Group Members:** Rehaan Shaikh (2025300229), Anmol Shenoy (2025300234), Aditya Sharma (2025300230), Arnav Shinde (2025300236)

A next-generation **Blinkit-style Quick Commerce platform exclusively for Fruits & Vegetables**, designed around the **Day-Prior Batched Colony Delivery Model**. Instead of 50 separate delivery bikes polluting society gates, orders placed before the 10:00 PM cutoff are aggregated into a single dedicated **Colony Mini-Truck (Tempo Tata Ace / Bolero)**, delivering fresh produce straight from APMC Mandis and local farmers the next morning at **zero delivery fee**.

---

## 🌟 Key Highlights & Features

1. **4 Unified Role Portals:**
   - 🛒 **Customer Portal**: Browse 40+ Indian fruits and veggies, select society/colony, choose tomorrow morning/evening delivery slot, interactive cart with weight calculations, instant UPI checkout, and live mini-truck GPS tracking.
   - 🚜 **Farmers & Mandi Vendors Portal**: Manage stall inventory (stock in kg & rate in ₹/kg), check tomorrow's packing checklist, view farmer-to-mandi crate drop-offs, and mark orders as *Packed*.
   - 🚚 **Transporter / Mini-Truck Partner Portal**: Dedicated driver console (Driver: Ramesh Kumar, Truck: MH-02-AB-1234), real-time tempo capacity fill meter (`current_load_kg / 500 kg`), DBMS View 2 Manifest, and colony trip controls (*Out for Delivery* / *Delivered*).
   - ⚙️ **Master Admin Console (Owner Access)**: Full system control—add/edit/delete produce, manage delivery tempos, view all orders, and run raw SQL queries directly in the **Interactive SQL Query Studio**.

2. **Dedicated Login & Authentication Interface:**
   - Click the **Profile / Login** button in the top-right navbar to open the interactive authentication modal.
   - **Pre-configured Demo Accounts (with 1-Click Login buttons):**
     - 🛒 **Customer**: Phone `9998887776`, Password `hashed_pwd_123` (Rahul Sharma)
     - 🚜 **Farmer/Vendor**: Phone `9876543211`, Stall `Shop No. 12` (Raju Fresh Veggies)
     - 🚚 **Transporter**: Phone `9876543210`, Truck `MH-02-AB-1234` (Ramesh Kumar)
     - ⚙️ **Master Admin**: Username `admin`, Passcode `admin123` (Aditya Sharma)
     - ✨ **New User Register**: Instant registration for any colony resident.

3. **Exhaustive Indian Fruits & Vegetables Catalog:**
   - **Vegetables:** Onion (*Pyaz/Kanda*), Potato (*Aloo*), Hybrid & Desi Tomato (*Tamatar*), Garlic (*Lahsun*), Ginger (*Adrak*), Green Chilli (*Hari Mirch*), Spinach (*Palak*), Coriander (*Hara Dhaniya*), Mint (*Pudina*), Bottle Gourd (*Lauki*), Cauliflower (*Phool Gobi*), Cabbage (*Patta Gobi*), Carrot (*Gajar*), Okra (*Bhindi*), Bitter Gourd (*Karela*), Capsicum (*Shimla Mirch*), Brinjal (*Baingan*), Fenugreek (*Methi*), Green Peas (*Matar*), Cucumber (*Kheera*), Lemon (*Nimbu*), Beetroot (*Chukandar*), etc.
   - **Fruits:** Robusta Banana, Elaichi Banana, Kashmiri Apple, Papaya, Kandhari Anar, Ratnagiri Alphonso Mango, Dasheri Mango, Nagpur Orange, Mosambi, Guava, Chikoo, Watermelon, Green & Black Grapes, Pineapple, Tender Coconut, Dragon Fruit, Kiwi.

3. **Database Architecture & SQL Triggers:**
   - Matches the attached **`SabziMandi_Pro`** relational DBMS schema and ER diagrams.
   - **Trigger `After_Order_Item_Insert`**: Automatically deducts vendor inventory stock and increments the mini-truck tempo batch `current_load_kg`.
   - **Stored Procedure `PlaceOrder`**: Executes transactional order creation with error handling.
   - **View 1**: Customer's Itemized Bill Receipt.
   - **View 2**: Logistics / Tempo Driver Manifest.

4. **🤖 Dost Customer Assistant:**
   - Floating widget answering customer queries on delivery cutoffs, the colony batched truck mechanism, produce freshness, order tracking, and recipe recommendations.

---

## 🚀 How to Run the Application

The Python server is already running and serving the full application locally:

### 1. Web Application URL
Open your browser and navigate to:
```
http://localhost:8000
```

### 2. Restarting the Server (if needed)
From PowerShell:
```powershell
cd C:\Users\Aditya\.gemini\antigravity\scratch\sabzimandi-quickcommerce
C:\msys64\ucrt64\bin\python.exe server.py
```

### 3. File Directory Structure
```
sabzimandi-quickcommerce/
├── server.py              # Python HTTP server with SQLite REST API & triggers
├── schema.sql             # Complete DBMS DDL, DML, Triggers, Views script
├── sabzimandi.db          # Embedded SQLite database with active data
├── README.md              # Full documentation
└── public/
    ├── index.html         # Web entry point with Tailwind, Leaflet, React 18
    ├── app.jsx            # Core React component with 4 role views, cart & chatbot
    └── styles.css         # Custom animations & thermal receipt styling
```

---

## 🛠 Admin & SQL Studio Guide

To access the Admin panel:
1. Click the **⚙️ Admin** button in the top navigation bar.
2. In the **Interactive SQL Query Studio**, you can:
   - Click **📄 Run View 1: Customer Bill Receipt** to execute the multi-table JOIN query from page 9 of the DBMS script.
   - Click **🚚 Run View 2: Tempo Driver Manifest** to inspect mini-truck batch weight and stops.
   - Click **📦 Check Trigger Stock Deductions** to verify that orders automatically decrease `Vendor_Inventory.stock_available_kg`.
   - Run any custom SQL statement (`SELECT`, `INSERT`, `UPDATE`, `CREATE TABLE`).
   - Click **+ Add New Produce** to add new fruits or vegetables to the live store.

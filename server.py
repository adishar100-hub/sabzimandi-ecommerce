import os
import sys
import json
import sqlite3
import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sabzimandi.db")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
PUBLIC_ERROR = "Something went wrong. Please try again."
ALLOWED_LOGIN_ROLES = {"customer", "vendor", "transporter"}

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_and_seed_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    schema_file = os.path.join(BASE_DIR, "schema.sql")
    if os.path.exists(schema_file):
        with open(schema_file, "r", encoding="utf-8") as f:
            cursor.executescript(f.read())
    conn.commit()

    # Check if products already seeded
    cursor.execute("SELECT COUNT(*) FROM Products")
    count = cursor.fetchone()[0]

    if count == 0:
        print("[Database] Seeding initial DBMS master data...")

        # 1. Regions
        regions_data = [
            ("Andheri East Sabzi Mandi & Societies", "400069"),
            ("Dadar Wholesale APMC & Shivaji Park", "400028"),
            ("Vashi APMC Hub & Palm Beach Societies", "400703"),
            ("Bandra West Pali Hill & Hill Road", "400050"),
            ("Powai Hiranandani & Raheja Vihar", "400076")
        ]
        cursor.executemany("INSERT INTO Regions (region_name, pincode) VALUES (?, ?)", regions_data)

        # 2. Mandis
        mandis_data = [
            ("Vashi APMC Mega Mandi", "Sector 19, Vashi", "Turbhe-APMC Road", "Navi Mumbai", "3:00 AM - 12:00 PM", "+91 22 2788 1100"),
            ("Dadar Wholesale Flower & Sabzi Market", "Dadar West", "Senapati Bapat Marg", "Mumbai", "4:00 AM - 2:00 PM", "+91 22 2430 4522"),
            ("Andheri Station Road Sabzi Mandi", "Andheri East", "Station Road Market", "Mumbai", "5:00 AM - 9:00 PM", "+91 22 2683 9988")
        ]
        cursor.executemany("INSERT INTO Mandis (name, location, address, city, operating_hours, phone_no) VALUES (?, ?, ?, ?, ?, ?)", mandis_data)

        # 3. Farmers
        farmers_data = [
            ("Kisan Balwant Patil", "+91 94220 18234", "Nashik, Maharashtra", "Sahyadri Agro Farms", "Organic Vegetables", 4.9),
            ("Ganesh Deshmukh", "+91 98230 45671", "Ratnagiri, Konkan", "Konkan King Orchards", "Alphonso & Mangoes", 5.0),
            ("Sukhwinder Singh", "+91 98140 99823", "Himachal Pradesh", "Himalayan Apple Valley", "Apples & Pears", 4.8),
            ("Tukaram Jadhav", "+91 97654 31209", "Pune Rural, Junnar", "Indrayani Greens", "Leafy Vegetables & Herbs", 4.7)
        ]
        cursor.executemany("INSERT INTO Farmers (name, phone, location, farm_name, farmer_type, rating) VALUES (?, ?, ?, ?, ?, ?)", farmers_data)

        # 4. Vendors
        vendors_data = [
            ("Raju Fresh Veggies", 1, "9876543211", "Shop No. 12, Andheri Mandi", 3, 4.8),
            ("Gupta Fruit Mart", 1, "9876543212", "Shop No. 15, Andheri Mandi", 3, 4.9),
            ("Vashi Fresh Wholesalers", 3, "9876543213", "Shed 4, Vashi APMC", 1, 4.7),
            ("Dadar Kisan Direct Stall", 2, "9876543214", "Gala 88, Dadar Market", 2, 4.9)
        ]
        cursor.executemany("INSERT INTO Vendors (vendor_name, region_id, phone_number, shop_number, mandi_id, rating) VALUES (?, ?, ?, ?, ?, ?)", vendors_data)

        # 5. Delivery Batches (Mini Trucks / Tempos for Societies)
        tomorrow_str = (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        batches_data = [
            (1, "Ramesh Kumar", "9876543210", "MH-02-AB-1234", tomorrow_str, "Morning", 500.0, 8.75, "https://track.mandi.in/tempo/101", "Scheduled"),
            (1, "Suresh Patil", "8765432109", "MH-04-CD-5678", tomorrow_str, "Evening", 500.0, 14.50, "https://track.mandi.in/tempo/102", "Scheduled"),
            (2, "Vijay Shinde", "9898981122", "MH-01-EE-9900", tomorrow_str, "Morning", 600.0, 22.00, "https://track.mandi.in/tempo/103", "Scheduled"),
            (3, "Manoj Yadav", "9766554433", "MH-43-XY-4421", tomorrow_str, "Morning", 500.0, 5.20, "https://track.mandi.in/tempo/104", "Scheduled")
        ]
        cursor.executemany("""
            INSERT INTO Delivery_Batches 
            (region_id, driver_name, driver_phone, truck_number, delivery_date, shift, max_capacity_kg, current_load_kg, tracking_link, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, batches_data)

        # 6. Comprehensive Products Catalog (Indian Fruits & Vegetables)
        products_data = [
            # VEGETABLES
            ("Onion (Pyaz / Kanda)", "Vegetable", "प्याज़ (लाल नासिक)", "1 kg", "Fresh pungent Nashik red onions, kitchen staple", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80", "15-20 days"),
            ("Potato (Aloo)", "Vegetable", "आलू (पहाड़ी)", "1 kg", "Firm soil-dusted fresh Jyoti potatoes for curries and fries", "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80", "15-25 days"),
            ("Tomato (Tamatar Hybrid)", "Vegetable", "टमाटर (ताज़ा हाइब्रिड)", "1 kg", "Juicy firm red ripe tomatoes, high lycopene", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80", "5-7 days"),
            ("Desi Tomato (Country Tamatar)", "Vegetable", "टमाटर (देशी खट्टा)", "1 kg", "Tangy flavorful desi country tomatoes for gravies and rasam", "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "4-6 days"),
            ("Garlic (Lahsun)", "Vegetable", "लहसुन (देसी लहसुन)", "250g", "Pungent cured garlic cloves from MP farms", "https://images.unsplash.com/photo-1636210589096-a53d5dacd702?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "30 days"),
            ("Ginger (Adrak)", "Vegetable", "अदरक (ताज़ा अदरक)", "250g", "Zesty aromatic fresh ginger root, rich in gingerol", "https://images.unsplash.com/photo-1635008388183-04ea0313c5d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "14 days"),
            ("Green Chilli (Hari Mirch)", "Vegetable", "हरी मिर्च (तीखी)", "200g", "Crisp spicy green chillies, handpicked fresh", "https://images.unsplash.com/photo-1524593410820-38510f580a77?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "7-10 days"),
            ("Spinach (Palak)", "Vegetable", "पालक (ताज़ा पत्ती)", "1 bunch (~300g)", "Crisp tender farm-harvested green palak leaves", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80", "2-3 days"),
            ("Coriander Leaves (Hara Dhaniya)", "Vegetable", "हरा धनिया (ताज़ा)", "1 bunch (~150g)", "Aromatic fresh green coriander with roots, dew fresh", "https://images.unsplash.com/photo-1535189487909-a262ad10c165?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "3-4 days"),
            ("Mint Leaves (Pudina)", "Vegetable", "पुदीना पत्ती", "1 bunch (~100g)", "Refreshing fragrant garden mint for chutneys and drinks", "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&auto=format&fit=crop&q=80", "3-5 days"),
            ("Bottle Gourd (Lauki / Doodhi)", "Vegetable", "लौकी / दूधी", "1 pc (~800g)", "Tender light-green gourd, low calorie & hydrating", "https://images.pexels.com/photos/39130946/pexels-photo-39130946.jpeg", "6-8 days"),
            ("Cauliflower (Phool Gobi)", "Vegetable", "फूल गोभी (ताज़ा)", "1 pc (~700g)", "Snow white crisp curd cauliflower surrounded by fresh leaves", "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80", "5-7 days"),
            ("Cabbage (Patta Gobi)", "Vegetable", "पत्ता गोभी (बंधा)", "1 pc (~600g)", "Tight compact green round cabbage head", "https://images.unsplash.com/photo-1761236725227-c51e8e93a6c0?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "8-12 days"),
            ("Carrot (Gajar)", "Vegetable", "गाजर (रसदार लाल)", "500g", "Sweet crunchy carrots, ideal for salads and halwa", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80", "7-10 days"),
            ("Ladyfinger / Okra (Bhindi)", "Vegetable", "भिंडी (मुलायम हरी)", "500g", "Young tender snappy okra, zero fibres", "https://images.unsplash.com/photo-1664289242854-e99d345cfa92?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "3-5 days"),
            ("Bitter Gourd (Karela)", "Vegetable", "करेला (हरा देशी)", "500g", "Deep green spiky bitter gourd, excellent for sugar balance", "https://images.unsplash.com/photo-1739903760973-4731a8e79a03?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "5-7 days"),
            ("Capsicum (Shimla Mirch)", "Vegetable", "शिमला मिर्च (हरी)", "500g", "Glossy crunchy bell peppers for stir fries", "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80", "5-7 days"),
            ("Brinjal / Eggplant (Bharta Baingan)", "Vegetable", "बैंगन (भरता)", "500g", "Large glossy round purple brinjal, tender pulp", "https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "4-6 days"),
            ("Small Purple Brinjal (Chota Baingan)", "Vegetable", "छोटा बैंगन (मसाला)", "500g", "Cute baby eggplants for stuffed masala baingan", "https://images.unsplash.com/photo-1605197378540-10ebaf6999e5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "4-6 days"),
            ("Fenugreek Leaves (Methi)", "Vegetable", "मेथी भाजी (हरी)", "1 bunch (~250g)", "Fragrant dark green methi bunches from Junnar", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80", "2-3 days"),
            ("Green Peas (Taza Matar)", "Vegetable", "ताज़ा मटर के दाने", "500g", "Sweet green seasonal peas in pods", "https://images.unsplash.com/photo-1780667162206-937b3d356fe2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "5-7 days"),
            ("Cucumber (Kheera)", "Vegetable", "खीरा / ककड़ी", "500g", "Crisp cooling salad cucumbers with thin peel", "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "5-7 days"),
            ("Ridge Gourd (Turai / Dodka)", "Vegetable", "तोरई / दोड़का", "500g", "Ridged fibrous cooling green vegetable", "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&auto=format&fit=crop&q=80", "4-6 days"),
            ("Lemon (Kagzi Nimbu)", "Vegetable", "कागज़ी नींबू (रसदार)", "4 pcs (~200g)", "Thin skinned juicy yellow lemons with intense citrus tang", "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop&q=80", "14 days"),
            ("Beetroot (Chukandar)", "Vegetable", "चुकंदर (लाल)", "500g", "Earthy sweet ruby-red beetroots rich in iron", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80", "12 days"),
            ("White Radish (Mooli)", "Vegetable", "मूली (ताज़ा सफेद)", "500g", "Crunchy peppery white radishes with fresh greens", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80", "6-8 days"),
            ("French Beans", "Vegetable", "बीन्स (हरी ताज़ा)", "250g", "Tender snappy stringless french green beans", "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&auto=format&fit=crop&q=80", "4-6 days"),

            # FRUITS
            ("Banana (Robusta Kela)", "Fruit", "केला (रोबस्टा)", "1 dozen (12 pcs)", "Naturally ripened sweet bananas packed with potassium", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80", "3-5 days"),
            ("Elaichi Banana (Yellaki)", "Fruit", "इलायची केला (येलक्की)", "500g (approx 6-7 pcs)", "Small fragrant creamy baby bananas, high natural sweetness", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80", "3-4 days"),
            ("Apple (Kashmiri Lal)", "Fruit", "सेब (कश्मीरी मीठा)", "1 kg (~4-5 pcs)", "Crisp sweet mountain apples from Sopore valley", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80", "10-15 days"),
            ("Papaya (Ripe Papita)", "Fruit", "पपीता (मीठा लाल)", "1 pc (~1 kg)", "Semi-firm sweet golden flesh papaya, digestion booster", "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&auto=format&fit=crop&q=80", "3-5 days"),
            ("Pomegranate (Kandhari Anar)", "Fruit", "अनार (कंधारी लाल दाने)", "1 kg (~3-4 pcs)", "Ruby red sweet arils bursting with antioxidants", "https://plus.unsplash.com/premium_photo-1668076515507-c5bc223c99a4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "10-14 days"),
            ("Mango (Alphonso / Ratnagiri Hapus)", "Fruit", "आम (हापुस रत्नागिरी)", "1 dozen", "King of mangoes, GI tagged authentic Ratnagiri aroma", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80", "4-6 days"),
            ("Mango (Dasheri)", "Fruit", "आम (दशहरी लखनवी)", "1 kg", "Aromatic honey-sweet Dasheri mangoes from Malihabad", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80", "4-6 days"),
            ("Nagpur Orange (Santra)", "Fruit", "संतरा (नागपुरी रसीला)", "1 kg", "Juicy loose-skin sweet and tangy oranges", "https://imgs.search.brave.com/BzCJqsSUas_RHW1zrhVOXil_wM4k2X2u2TvUHkUBc4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMTk5/Njk0ODgvcGV4ZWxz/LXBob3RvLTE5OTY5/NDg4L2ZyZWUtcGhv/dG8tb2YtdGFuZ2Vy/aW5lcy1vbi1kaXNw/bGF5LmpwZWc_Y3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA", "7-10 days"),
            ("Sweet Lime (Mosambi)", "Fruit", "मौसंबी (ताज़ा जूस)", "1 kg", "Plump sweet mosambi, ideal for refreshing morning juice", "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80", "7-10 days"),
            ("Guava (Allahabad Safeda Amrood)", "Fruit", "अमरूद (सफेदा मीठा)", "500g", "Crisp white flesh sweet fragrant guavas", "https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "4-6 days"),
            ("Sapodilla (Chikoo)", "Fruit", "चीकू (मीठा गोल)", "500g", "Brown velvety caramel-tasting sweet Dahanu chikoos", "https://imgs.search.brave.com/3tyd_OxLnbjg_rlRIyjtvrty7les-suYWl4ufFeFE10/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDF0UTI5dlpvSkwu/anBn", "3-5 days"),
            ("Watermelon (Tarbooz)", "Fruit", "तरबूज़ (गहरा लाल)", "1 pc (~2.5 kg)", "Sun-ripened red juicy sweet watermelon", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80", "7-10 days"),
            ("Muskmelon (Kharbuja)", "Fruit", "खरबूजा (मधुर सुगंध)", "1 pc (~1 kg)", "Honey sweet orange-fleshed muskmelon", "https://images.unsplash.com/photo-1646992122151-57c9b84d17a0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "5-7 days"),
            ("Green Grapes (Sonaka Angoor)", "Fruit", "अंगूर (सोनाका हरा)", "500g", "Crisp seedless elongated sweet green grapes from Nashik", "https://images.unsplash.com/photo-1632576883732-f131be0be48a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", "4-7 days"),
            ("Black Grapes (Sharad Seedless)", "Fruit", "अंगूर (काला बीज रहित)", "500g", "Sweet juicy purple black grapes rich in resveratrol", "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&auto=format&fit=crop&q=80", "5-7 days"),
            ("Fresh Pineapple (Ananas)", "Fruit", "अनन्नास (ताज़ा मीठा)", "1 pc (~1 kg)", "Golden queen sweet pineapple with intoxicating tropical aroma", "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&auto=format&fit=crop&q=80", "5-7 days"),
            ("Tender Coconut (Nariyal Pani)", "Fruit", "नारियल पानी (मलाईदार)", "1 pc", "Electrolyte rich sweet coconut water with tender malai", "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&auto=format&fit=crop&q=80", "7 days"),
            ("Dragon Fruit (Kamalam)", "Fruit", "ड्रैगन फ्रूट (कमलम)", "1 pc (~350g)", "Vibrant exotic pink fruit with mild sweet crunch", "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&auto=format&fit=crop&q=80", "7-10 days"),
            ("Kiwi (Zespri Green)", "Fruit", "कीवी (विटामिन सी)", "Pack of 3 pcs", "Tangy sweet green kiwi rich in Vitamin C and fiber", "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&auto=format&fit=crop&q=80", "8-12 days")
        ]
        cursor.executemany("""
            INSERT INTO Products (item_name, category, hindi_name, unit, description, image_url, shelf_life)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, products_data)

        # 7. Vendor Inventory Seeding (Raju gets Veggies, Gupta gets Fruits)
        cursor.execute("SELECT product_id, item_name, category FROM Products")
        all_prods = cursor.fetchall()

        import random
        for p in all_prods:
            pid = p["product_id"]
            cat = p["category"]
            name = p["item_name"]
            
            if cat == "Vegetable":
                # Specific pricing for veggies
                if "Onion" in name: price = 35.0
                elif "Potato" in name: price = 28.0
                elif "Tomato" in name: price = 40.0
                elif "Garlic" in name: price = 180.0
                elif "Ginger" in name: price = 120.0
                elif "Chilli" in name: price = 60.0
                elif "Spinach" in name: price = 25.0
                elif "Coriander" in name: price = 15.0
                elif "Mint" in name: price = 15.0
                elif "Lauki" in name: price = 35.0
                elif "Cauliflower" in name: price = 45.0
                elif "Cabbage" in name: price = 30.0
                elif "Carrot" in name: price = 50.0
                elif "Bhindi" in name: price = 45.0
                elif "Karela" in name: price = 50.0
                elif "Capsicum" in name: price = 65.0
                elif "Brinjal" in name: price = 40.0
                elif "Methi" in name: price = 20.0
                elif "Peas" in name: price = 70.0
                elif "Cucumber" in name: price = 35.0
                elif "Lemon" in name: price = 50.0
                else: price = 42.0

                stock = round(random.uniform(40.0, 95.0), 2)
                cursor.execute("""
                    INSERT INTO Vendor_Inventory (vendor_id, product_id, price_per_kg, stock_available_kg)
                    VALUES (1, ?, ?, ?)
                """, (pid, price, stock))

                # Also give some to Dadar Kisan stall
                cursor.execute("""
                    INSERT INTO Vendor_Inventory (vendor_id, product_id, price_per_kg, stock_available_kg)
                    VALUES (4, ?, ?, ?)
                """, (pid, price - 2.0, round(stock * 0.8, 2)))

            else:
                # Fruit pricing
                if "Robusta" in name: price = 55.0
                elif "Elaichi" in name: price = 70.0
                elif "Apple" in name: price = 140.0
                elif "Papaya" in name: price = 50.0
                elif "Anar" in name or "Pomegranate" in name: price = 160.0
                elif "Alphonso" in name: price = 450.0
                elif "Dasheri" in name: price = 120.0
                elif "Orange" in name: price = 80.0
                elif "Mosambi" in name: price = 75.0
                elif "Guava" in name: price = 60.0
                elif "Chikoo" in name: price = 70.0
                elif "Watermelon" in name: price = 30.0
                elif "Muskmelon" in name: price = 45.0
                elif "Grapes" in name: price = 90.0
                elif "Pineapple" in name: price = 70.0
                elif "Coconut" in name: price = 55.0
                elif "Dragon" in name: price = 90.0
                elif "Kiwi" in name: price = 110.0
                else: price = 85.0

                stock = round(random.uniform(30.0, 75.0), 2)
                cursor.execute("""
                    INSERT INTO Vendor_Inventory (vendor_id, product_id, price_per_kg, stock_available_kg)
                    VALUES (2, ?, ?, ?)
                """, (pid, price, stock))

                cursor.execute("""
                    INSERT INTO Vendor_Inventory (vendor_id, product_id, price_per_kg, stock_available_kg)
                    VALUES (3, ?, ?, ?)
                """, (pid, price + 3.0, round(stock * 1.2, 2)))

        # 8. Seed Default Customer (from Page 6 of PDF)
        cursor.execute("""
            INSERT INTO Customers (full_name, phone_number, email, address_line, society_name, region_id)
            VALUES ('Rahul Sharma', '9998887776', 'rahul.sharma@example.com', 'B-402, Shivam Society, Andheri East', 'Shivam Society', 1)
        """)
        cust_id = cursor.lastrowid

        # 9. Seed Sample Order matching page 7 & 8 of PDF
        cursor.execute("""
            INSERT INTO Orders (customer_id, vendor_id, batch_id, total_amount, payment_status, payment_mode, order_status, delivery_address, society_name, delivery_slot)
            VALUES (?, 1, 1, 500.0, 'Paid', 'UPI (Google Pay)', 'Packed', 'B-402, Shivam Society, Andheri East', 'Shivam Society', 'Tomorrow Morning (6:30 AM - 8:30 AM)')
        """, (cust_id,))
        order_id = cursor.lastrowid

        # Order Items matching PDF simulation
        sample_items = [
            ("Onion (Pyaz / Kanda)", 3.00, 35.0),
            ("Potato (Aloo)", 2.50, 28.0),
            ("Tomato (Tamatar Hybrid)", 2.00, 40.0),
            ("Spinach (Palak)", 1.00, 25.0),
            ("Coriander Leaves (Hara Dhaniya)", 0.25, 15.0)
        ]

        total_calc = 0
        for iname, qty, rate in sample_items:
            cursor.execute("SELECT product_id FROM Products WHERE item_name LIKE ?", (f"%{iname[:6]}%",))
            row = cursor.fetchone()
            if row:
                prod_id = row["product_id"]
                sub = round(qty * rate, 2)
                total_calc += sub
                cursor.execute("""
                    INSERT INTO Order_Items (order_id, product_id, quantity_kg, subtotal)
                    VALUES (?, ?, ?, ?)
                """, (order_id, prod_id, qty, sub))

        cursor.execute("UPDATE Orders SET total_amount = ? WHERE order_id = ?", (round(total_calc, 2), order_id))
        conn.commit()
        print("[Database] Master data initialization complete!")
    
    conn.close()

class SabziMandiRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode("utf-8"))

    def read_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw_data = self.rfile.read(content_length).decode("utf-8")
                return json.loads(raw_data)
        except Exception as e:
            print("Error parsing JSON:", e)
        return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path.startswith("/api/"):
            self.handle_api_get(path, query)
        else:
            # Fallback to serving static files or index.html for SPA
            filepath = os.path.join(PUBLIC_DIR, path.lstrip("/"))
            if not os.path.exists(filepath) or os.path.isdir(filepath):
                self.path = "/index.html"
            super().do_GET()

    def handle_api_get(self, path, query):
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            if path == "/api/status":
                cursor.execute("SELECT COUNT(*) FROM Products")
                prod_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM Orders")
                ord_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM Delivery_Batches")
                batch_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM Vendors")
                vendor_count = cursor.fetchone()[0]
                cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM Orders WHERE payment_status = 'Paid'")
                total_rev = cursor.fetchone()[0]

                self.send_json({
                    "status": "online",
                    "system": "Sabzi Mandi Batched Quick-Commerce Platform",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "stats": {
                        "products": prod_count,
                        "orders": ord_count,
                        "batches": batch_count,
                        "vendors": vendor_count,
                        "revenue": round(total_rev, 2)
                    }
                })

            elif path == "/api/products":
                # Returns products with current average price and total stock from inventory
                category = query.get("category", [None])[0]
                search = query.get("q", [None])[0]

                sql = """
                    SELECT p.*, 
                           COALESCE(AVG(vi.price_per_kg), 45.0) as price_per_kg,
                           COALESCE(SUM(vi.stock_available_kg), 100.0) as total_stock_kg,
                           COUNT(vi.vendor_id) as vendor_count
                    FROM Products p
                    LEFT JOIN Vendor_Inventory vi ON p.product_id = vi.product_id
                    WHERE 1=1
                """
                params = []
                if category and category.lower() != "all":
                    sql += " AND p.category = ?"
                    params.append(category)
                if search:
                    sql += " AND (p.item_name LIKE ? OR p.hindi_name LIKE ? OR p.description LIKE ?)"
                    params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

                sql += " GROUP BY p.product_id ORDER BY p.product_id ASC"
                cursor.execute(sql, params)
                rows = [dict(r) for r in cursor.fetchall()]
                self.send_json(rows)

            elif path == "/api/vendors":
                cursor.execute("""
                    SELECT v.*, r.region_name, r.pincode, m.name as mandi_name,
                           COUNT(DISTINCT vi.product_id) as item_count
                    FROM Vendors v
                    LEFT JOIN Regions r ON v.region_id = r.region_id
                    LEFT JOIN Mandis m ON v.mandi_id = m.mandi_id
                    LEFT JOIN Vendor_Inventory vi ON v.vendor_id = vi.vendor_id
                    GROUP BY v.vendor_id
                """)
                self.send_json([dict(r) for r in cursor.fetchall()])

            elif path == "/api/inventory":
                vendor_id = query.get("vendor_id", ["1"])[0]
                cursor.execute("""
                    SELECT vi.*, p.item_name, p.hindi_name, p.category, p.unit, p.image_url, p.shelf_life
                    FROM Vendor_Inventory vi
                    JOIN Products p ON vi.product_id = p.product_id
                    WHERE vi.vendor_id = ?
                    ORDER BY p.category, p.item_name
                """, (vendor_id,))
                self.send_json([dict(r) for r in cursor.fetchall()])

            elif path == "/api/batches":
                cursor.execute("""
                    SELECT b.*, r.region_name, r.pincode,
                           COUNT(o.order_id) as total_orders
                    FROM Delivery_Batches b
                    LEFT JOIN Regions r ON b.region_id = r.region_id
                    LEFT JOIN Orders o ON b.batch_id = o.batch_id
                    GROUP BY b.batch_id
                    ORDER BY b.delivery_date DESC, b.shift ASC
                """)
                self.send_json([dict(r) for r in cursor.fetchall()])

            elif path == "/api/orders":
                customer_id = query.get("customer_id", [None])[0]
                vendor_id = query.get("vendor_id", [None])[0]
                batch_id = query.get("batch_id", [None])[0]

                sql = """
                    SELECT o.*, c.full_name as customer_name, c.phone_number as customer_phone,
                           v.vendor_name, b.truck_number, b.driver_name, b.shift, b.tracking_link,
                           (SELECT COUNT(*) FROM Order_Items oi WHERE oi.order_id = o.order_id) as item_count
                    FROM Orders o
                    JOIN Customers c ON o.customer_id = c.customer_id
                    JOIN Vendors v ON o.vendor_id = v.vendor_id
                    JOIN Delivery_Batches b ON o.batch_id = b.batch_id
                    WHERE 1=1
                """
                params = []
                if customer_id:
                    sql += " AND o.customer_id = ?"
                    params.append(customer_id)
                if vendor_id:
                    sql += " AND o.vendor_id = ?"
                    params.append(vendor_id)
                if batch_id:
                    sql += " AND o.batch_id = ?"
                    params.append(batch_id)

                sql += " ORDER BY o.order_id DESC"
                cursor.execute(sql, params)
                orders = [dict(r) for r in cursor.fetchall()]

                # Fetch items for each order
                for order in orders:
                    cursor.execute("""
                        SELECT oi.*, p.item_name, p.hindi_name, p.unit, p.image_url
                        FROM Order_Items oi
                        JOIN Products p ON oi.product_id = p.product_id
                        WHERE oi.order_id = ?
                    """, (order["order_id"],))
                    order["items"] = [dict(i) for i in cursor.fetchall()]

                self.send_json(orders)

            elif path.startswith("/api/receipt/"):
                # Customer Itemized Bill Receipt (View 1 from PDF)
                order_id = path.split("/")[-1]
                cursor.execute("""
                    SELECT
                        c.full_name AS Customer,
                        c.phone_number AS Customer_Phone,
                        c.address_line AS Delivery_Address,
                        o.society_name AS Society,
                        o.delivery_slot AS Slot,
                        v.vendor_name AS Sold_By,
                        v.shop_number AS Shop_No,
                        p.item_name AS Item,
                        p.hindi_name AS Hindi_Item,
                        oi.quantity_kg AS Qty,
                        vi.price_per_kg AS Rate_Rs,
                        oi.subtotal AS Item_Total,
                        o.total_amount AS Grand_Total,
                        o.order_status AS Status,
                        o.payment_status AS Payment,
                        o.payment_mode AS Payment_Mode,
                        o.created_at AS Order_Date,
                        b.truck_number AS Mini_Truck,
                        b.driver_name AS Driver,
                        b.driver_phone AS Driver_Phone
                    FROM Orders o
                    JOIN Customers c ON o.customer_id = c.customer_id
                    JOIN Order_Items oi ON o.order_id = oi.order_id
                    JOIN Products p ON oi.product_id = p.product_id
                    JOIN Vendor_Inventory vi ON p.product_id = vi.product_id AND o.vendor_id = vi.vendor_id
                    JOIN Vendors v ON o.vendor_id = v.vendor_id
                    JOIN Delivery_Batches b ON o.batch_id = b.batch_id
                    WHERE o.order_id = ?
                """, (order_id,))
                rows = [dict(r) for r in cursor.fetchall()]

                if not rows:
                    # Fallback join without vendor_inventory strict match
                    cursor.execute("""
                        SELECT
                            c.full_name AS Customer,
                            c.phone_number AS Customer_Phone,
                            c.address_line AS Delivery_Address,
                            o.society_name AS Society,
                            o.delivery_slot AS Slot,
                            v.vendor_name AS Sold_By,
                            v.shop_number AS Shop_No,
                            p.item_name AS Item,
                            p.hindi_name AS Hindi_Item,
                            oi.quantity_kg AS Qty,
                            ROUND(oi.subtotal / oi.quantity_kg, 2) AS Rate_Rs,
                            oi.subtotal AS Item_Total,
                            o.total_amount AS Grand_Total,
                            o.order_status AS Status,
                            o.payment_status AS Payment,
                            o.payment_mode AS Payment_Mode,
                            o.created_at AS Order_Date,
                            b.truck_number AS Mini_Truck,
                            b.driver_name AS Driver,
                            b.driver_phone AS Driver_Phone
                        FROM Orders o
                        JOIN Customers c ON o.customer_id = c.customer_id
                        JOIN Order_Items oi ON o.order_id = oi.order_id
                        JOIN Products p ON oi.product_id = p.product_id
                        JOIN Vendors v ON o.vendor_id = v.vendor_id
                        JOIN Delivery_Batches b ON o.batch_id = b.batch_id
                        WHERE o.order_id = ?
                    """, (order_id,))
                    rows = [dict(r) for r in cursor.fetchall()]

                self.send_json(rows)

            elif path.startswith("/api/manifest/"):
                # Logistics / Tempo Driver Manifest (View 2 from PDF)
                batch_id = path.split("/")[-1]
                cursor.execute("""
                    SELECT
                        b.batch_id AS Tempo_ID,
                        b.driver_name AS Driver,
                        b.driver_phone AS Driver_Phone,
                        b.truck_number AS Truck,
                        b.shift AS Delivery_Shift,
                        b.delivery_date AS Delivery_Date,
                        b.max_capacity_kg AS Max_Capacity_Kg,
                        b.current_load_kg AS Total_Weight_To_Deliver_Kg,
                        b.tracking_link AS Tracking_Link,
                        b.status AS Batch_Status,
                        r.region_name AS Colony_Region,
                        r.pincode AS Pincode
                    FROM Delivery_Batches b
                    LEFT JOIN Regions r ON b.region_id = r.region_id
                    WHERE b.batch_id = ?
                """, (batch_id,))
                manifest = dict(cursor.fetchone() or {})

                if manifest:
                    cursor.execute("""
                        SELECT o.order_id, o.order_status, o.society_name, o.delivery_address, o.total_amount,
                               c.full_name as customer_name, c.phone_number as customer_phone,
                               (SELECT SUM(quantity_kg) FROM Order_Items WHERE order_id = o.order_id) as package_weight_kg
                        FROM Orders o
                        JOIN Customers c ON o.customer_id = c.customer_id
                        WHERE o.batch_id = ?
                        ORDER BY o.society_name, o.order_id
                    """, (batch_id,))
                    manifest["stops"] = [dict(r) for r in cursor.fetchall()]

                self.send_json(manifest)

            elif path == "/api/farmers":
                cursor.execute("SELECT * FROM Farmers ORDER BY rating DESC")
                self.send_json([dict(r) for r in cursor.fetchall()])

            elif path == "/api/regions":
                cursor.execute("SELECT * FROM Regions ORDER BY region_id ASC")
                self.send_json([dict(r) for r in cursor.fetchall()])

            else:
                self.send_json({"error": "Endpoint not found"}, 404)

        except Exception as e:
            print("API GET Error:", e)
            self.send_json({"error": PUBLIC_ERROR}, 500)
        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            if path == "/api/login":
                role = body.get("role", "customer")
                phone = body.get("phone", "").strip()
                password = body.get("password", "").strip()
                username = body.get("username", "").strip()

                if role not in ALLOWED_LOGIN_ROLES:
                    self.send_json({"error": "Please choose Customer, Transporter, or Vendor / Farmer."}, 400)
                    return

                if role == "vendor":
                    cursor.execute("SELECT * FROM Vendors WHERE phone_number = ? OR vendor_name LIKE ?", (phone, f"%{phone}%"))
                    v = cursor.fetchone()
                    if v:
                        v_dict = dict(v)
                        self.send_json({
                            "success": True,
                            "user": {
                                "role": "vendor",
                                "vendor_id": v_dict["vendor_id"],
                                "name": v_dict["vendor_name"],
                                "phone": v_dict["phone_number"],
                                "shop_number": v_dict["shop_number"],
                                "rating": v_dict.get("rating", 4.8)
                            },
                            "message": f"Welcome back, {v_dict['vendor_name']}!"
                        })
                    else:
                        # Fallback for demo
                        self.send_json({
                            "success": True,
                            "user": {
                                "role": "vendor",
                                "vendor_id": 1,
                                "name": "Raju Fresh Veggies",
                                "phone": phone or "9876543211",
                                "shop_number": "Shop No. 12, Andheri Mandi",
                                "rating": 4.8
                            },
                            "message": "Authenticated as Mandi Vendor (Demo Mode)"
                        })
                    return

                elif role == "transporter":
                    cursor.execute("SELECT * FROM Delivery_Batches WHERE driver_phone = ? OR truck_number = ?", (phone, phone))
                    b = cursor.fetchone()
                    if b:
                        b_dict = dict(b)
                        self.send_json({
                            "success": True,
                            "user": {
                                "role": "transporter",
                                "batch_id": b_dict["batch_id"],
                                "name": b_dict["driver_name"],
                                "phone": b_dict["driver_phone"],
                                "truck_number": b_dict["truck_number"],
                                "shift": b_dict["shift"]
                            },
                            "message": f"Welcome back, Driver {b_dict['driver_name']}!"
                        })
                    else:
                        self.send_json({
                            "success": True,
                            "user": {
                                "role": "transporter",
                                "batch_id": 1,
                                "name": "Ramesh Kumar",
                                "phone": phone or "9876543210",
                                "truck_number": "MH-02-AB-1234",
                                "shift": "Morning"
                            },
                            "message": "Authenticated as Mini-Truck Transporter (Demo Mode)"
                        })
                    return

                else: # customer
                    cursor.execute("SELECT * FROM Customers WHERE phone_number = ?", (phone,))
                    c = cursor.fetchone()
                    if c:
                        c_dict = dict(c)
                        self.send_json({
                            "success": True,
                            "user": {
                                "role": "customer",
                                "customer_id": c_dict["customer_id"],
                                "name": c_dict["full_name"],
                                "phone": c_dict["phone_number"],
                                "society": c_dict["society_name"] or "Shivam Society",
                                "address": c_dict["address_line"]
                            },
                            "message": f"Welcome back, {c_dict['full_name']}!"
                        })
                    else:
                        # Create auto-profile for user
                        name = body.get("name", "Rahul Sharma")
                        society = body.get("society", "Shivam Society, Andheri East")
                        self.send_json({
                            "success": True,
                            "user": {
                                "role": "customer",
                                "customer_id": 1,
                                "name": name,
                                "phone": phone or "9998887776",
                                "society": society,
                                "address": f"Flat 402, {society}"
                            },
                            "message": f"Logged in as {name}!"
                        })
                    return

            elif path == "/api/register":
                name = body.get("name", "New Customer")
                phone = body.get("phone", "9898989898")
                address = body.get("address", "Shivam Society, Andheri East")
                society = body.get("society", "Shivam Society")
                role = body.get("role", "customer")

                if role == "customer":
                    cursor.execute("""
                        INSERT INTO Customers (full_name, phone_number, address_line, society_name, region_id)
                        VALUES (?, ?, ?, ?, 1)
                    """, (name, phone, address, society))
                    cid = cursor.lastrowid
                    conn.commit()
                    self.send_json({
                        "success": True,
                        "user": {
                            "role": "customer",
                            "customer_id": cid,
                            "name": name,
                            "phone": phone,
                            "society": society,
                            "address": address
                        },
                        "message": "Account created successfully!"
                    })
                    return

            elif path == "/api/orders":
                # Place Order Simulation: TCL & DML Transaction matching Stored Procedure
                customer_id = body.get("customer_id", 1)
                vendor_id = body.get("vendor_id", 1)
                batch_id = body.get("batch_id", 1)
                items = body.get("items", []) # list of {product_id, quantity_kg, price_per_kg}
                delivery_address = body.get("delivery_address", "Flat 402, Shivam Society, Andheri East")
                society_name = body.get("society_name", "Shivam Society")
                delivery_slot = body.get("delivery_slot", "Tomorrow Morning (6:30 AM - 8:30 AM)")
                payment_mode = body.get("payment_mode", "UPI")

                if not items:
                    self.send_json({"error": "Cart is empty"}, 400)
                    return

                cursor.execute("BEGIN TRANSACTION")

                # Insert Order
                cursor.execute("""
                    INSERT INTO Orders (customer_id, vendor_id, batch_id, total_amount, payment_status, payment_mode, order_status, delivery_address, society_name, delivery_slot)
                    VALUES (?, ?, ?, 0.0, 'Paid', ?, 'Placed', ?, ?, ?)
                """, (customer_id, vendor_id, batch_id, payment_mode, delivery_address, society_name, delivery_slot))
                order_id = cursor.lastrowid

                total_amount = 0.0

                # Insert Order Items & Fire Trigger Logic manually if SQLite trigger isn't activated
                for item in items:
                    pid = item["product_id"]
                    qty = float(item["quantity_kg"])
                    price = float(item["price_per_kg"])
                    subtotal = round(qty * price, 2)
                    total_amount += subtotal

                    cursor.execute("""
                        INSERT INTO Order_Items (order_id, product_id, quantity_kg, subtotal)
                        VALUES (?, ?, ?, ?)
                    """, (order_id, pid, qty, subtotal))

                    # Deduct vendor inventory
                    cursor.execute("""
                        UPDATE Vendor_Inventory
                        SET stock_available_kg = MAX(0, stock_available_kg - ?)
                        WHERE product_id = ? AND vendor_id = ?
                    """, (qty, pid, vendor_id))

                    # Increment tempo batch current_load_kg
                    cursor.execute("""
                        UPDATE Delivery_Batches
                        SET current_load_kg = current_load_kg + ?
                        WHERE batch_id = ?
                    """, (qty, batch_id))

                # Update Order total amount
                cursor.execute("""
                    UPDATE Orders
                    SET total_amount = ?
                    WHERE order_id = ?
                """, (round(total_amount, 2), order_id))

                conn.commit()

                self.send_json({
                    "success": True,
                    "order_id": order_id,
                    "message": f"Order #{order_id} placed successfully for tomorrow's colony tempo batch!",
                    "total_amount": round(total_amount, 2),
                    "batch_id": batch_id
                }, 201)

            elif path == "/api/products":
                # Admin: Add new fruit/vegetable
                item_name = body.get("item_name")
                category = body.get("category", "Vegetable")
                hindi_name = body.get("hindi_name", "")
                unit = body.get("unit", "1 kg")
                description = body.get("description", "")
                image_url = body.get("image_url", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400")
                shelf_life = body.get("shelf_life", "4-5 days")
                initial_price = float(body.get("price_per_kg", 40.0))
                initial_stock = float(body.get("stock_kg", 50.0))

                cursor.execute("""
                    INSERT INTO Products (item_name, category, hindi_name, unit, description, image_url, shelf_life)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (item_name, category, hindi_name, unit, description, image_url, shelf_life))
                new_prod_id = cursor.lastrowid

                # Add to default vendors inventory
                vendor_id = 1 if category == "Vegetable" else 2
                cursor.execute("""
                    INSERT INTO Vendor_Inventory (vendor_id, product_id, price_per_kg, stock_available_kg)
                    VALUES (?, ?, ?, ?)
                """, (vendor_id, new_prod_id, initial_price, initial_stock))

                conn.commit()
                self.send_json({"success": True, "product_id": new_prod_id, "message": "Produce added to master catalog!"})

            elif path == "/api/batches":
                # Admin: Create new delivery tempo batch
                region_id = body.get("region_id", 1)
                driver_name = body.get("driver_name", "Rajesh Varma")
                driver_phone = body.get("driver_phone", "9820012345")
                truck_number = body.get("truck_number", "MH-02-EZ-7788")
                delivery_date = body.get("delivery_date", (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"))
                shift = body.get("shift", "Morning")
                max_capacity_kg = float(body.get("max_capacity_kg", 500.0))
                tracking_link = f"https://track.mandi.in/tempo/{truck_number.replace('-', '')}"

                cursor.execute("""
                    INSERT INTO Delivery_Batches (region_id, driver_name, driver_phone, truck_number, delivery_date, shift, max_capacity_kg, current_load_kg, tracking_link, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 0.0, ?, 'Scheduled')
                """, (region_id, driver_name, driver_phone, truck_number, delivery_date, shift, max_capacity_kg, tracking_link))
                batch_id = cursor.lastrowid
                conn.commit()

                self.send_json({"success": True, "batch_id": batch_id, "message": "New society delivery tempo assigned!"})

            elif path == "/api/sql":
                self.send_json({"error": "This action is not available."}, 403)

            elif path == "/api/reset-db":
                # Reset database to seed
                conn.close()
                if os.path.exists(DB_PATH):
                    os.remove(DB_PATH)
                init_and_seed_db()
                self.send_json({"success": True, "message": "Database reset to initial demo seeds successfully!"})

            elif path == "/api/chat":
                # AI / Rule Mandi Assistant
                user_msg = body.get("message", "").lower()
                response = self.generate_mandi_bot_response(user_msg, cursor)
                self.send_json({"reply": response})

            else:
                self.send_json({"error": "Not Found"}, 404)

        except Exception as e:
            conn.rollback()
            print("API POST Error:", e)
            self.send_json({"error": PUBLIC_ERROR}, 500)
        finally:
            conn.close()

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            if path.startswith("/api/inventory/"):
                # Vendor: Update stock & price
                inventory_id = path.split("/")[-1]
                price = body.get("price_per_kg")
                stock = body.get("stock_available_kg")

                cursor.execute("""
                    UPDATE Vendor_Inventory
                    SET price_per_kg = COALESCE(?, price_per_kg),
                        stock_available_kg = COALESCE(?, stock_available_kg),
                        last_updated = CURRENT_TIMESTAMP
                    WHERE inventory_id = ?
                """, (price, stock, inventory_id))
                conn.commit()
                self.send_json({"success": True, "message": "Vendor inventory updated!"})

            elif path.startswith("/api/orders/") and path.endswith("/status"):
                # Transporter / Vendor / Admin: Update order status
                parts = path.split("/")
                order_id = parts[3]
                new_status = body.get("status") # 'Placed', 'Packed', 'Out for Delivery', 'Delivered'

                cursor.execute("""
                    UPDATE Orders
                    SET order_status = ?
                    WHERE order_id = ?
                """, (new_status, order_id))
                conn.commit()
                self.send_json({"success": True, "message": f"Order #{order_id} status updated to {new_status}!"})

            elif path.startswith("/api/batches/") and path.endswith("/status"):
                # Transporter: update batch status
                parts = path.split("/")
                batch_id = parts[3]
                new_status = body.get("status") # 'Scheduled', 'Out for Delivery', 'Delivered'

                cursor.execute("""
                    UPDATE Delivery_Batches
                    SET status = ?
                    WHERE batch_id = ?
                """, (new_status, batch_id))

                # Cascade order statuses if batch is out for delivery or delivered
                if new_status == "Out for Delivery":
                    cursor.execute("UPDATE Orders SET order_status = 'Out for Delivery' WHERE batch_id = ?", (batch_id,))
                elif new_status == "Delivered":
                    cursor.execute("UPDATE Orders SET order_status = 'Delivered' WHERE batch_id = ?", (batch_id,))

                conn.commit()
                self.send_json({"success": True, "message": f"Tempo Batch #{batch_id} marked as {new_status}!"})

            elif path.startswith("/api/products/"):
                # Admin: update product details
                prod_id = path.split("/")[-1]
                item_name = body.get("item_name")
                hindi_name = body.get("hindi_name")
                price = body.get("price_per_kg")
                stock = body.get("stock_kg")

                cursor.execute("""
                    UPDATE Products
                    SET item_name = COALESCE(?, item_name),
                        hindi_name = COALESCE(?, hindi_name)
                    WHERE product_id = ?
                """, (item_name, hindi_name, prod_id))

                if price is not None:
                    cursor.execute("""
                        UPDATE Vendor_Inventory
                        SET price_per_kg = ?
                        WHERE product_id = ?
                    """, (price, prod_id))

                if stock is not None:
                    cursor.execute("""
                        UPDATE Vendor_Inventory
                        SET stock_available_kg = ?
                        WHERE product_id = ?
                    """, (stock, prod_id))

                conn.commit()
                self.send_json({"success": True, "message": "Product information updated!"})

            else:
                self.send_json({"error": "Not Found"}, 404)

        except Exception as e:
            conn.rollback()
            print("API PUT Error:", e)
            self.send_json({"error": PUBLIC_ERROR}, 500)
        finally:
            conn.close()

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            if path.startswith("/api/products/"):
                prod_id = path.split("/")[-1]
                cursor.execute("DELETE FROM Products WHERE product_id = ?", (prod_id,))
                conn.commit()
                self.send_json({"success": True, "message": f"Product #{prod_id} deleted from catalog!"})
            else:
                self.send_json({"error": "Not Found"}, 404)
        except Exception as e:
            conn.rollback()
            print("API DELETE Error:", e)
            self.send_json({"error": PUBLIC_ERROR}, 500)
        finally:
            conn.close()

    def generate_mandi_bot_response(self, text, cursor):
        """Intelligent Sabzi Mandi customer support chatbot"""
        if any(w in text for w in ["cutoff", "timing", "slot", "when", "order time"]):
            return "🕒 **Cutoff & Delivery Slots**: Orders placed before **10:00 PM tonight** are batched and dispatched tomorrow morning (**6:30 AM - 8:30 AM**) or tomorrow evening (**5:00 PM - 7:30 PM**). Fresh harvest arrives straight from Mandi at 4:30 AM!"
        
        if any(w in text for w in ["how it works", "model", "mini truck", "tempo", "society", "colony", "batched"]):
            return "🚚 **Colony Batched Mini-Truck Model**: Rather than 50 separate delivery bikes polluting your society, our platform groups all orders from your colony/apartment into a single dedicated mini-truck (Tata Ace/Bolero). You get zero delivery fees, wholesale Mandi rates, and peak farm freshness!"
        
        if any(w in text for w in ["fresh", "farmer", "organic", "origin", "where"]):
            return "🌱 **Direct Farm Connection**: Our leafy vegetables (Palak, Methi, Coriander) come directly from farmer Balwant Patil in Nashik and Junnar. Ratnagiri Alphonso mangoes are harvested directly by Konkan orchards. Fresh stock is updated daily!"
        
        if any(w in text for w in ["track", "order", "status", "delivery", "where is"]):
            return "📦 **Track Your Order**: You can check your live order status in the **Orders** tab above or select your order to see the dedicated Tempo driver manifest (Driver name, truck number, and live load manifest)!"

        if any(w in text for w in ["rate", "price", "sasta", "discount", "wholesale", "offer"]):
            return "💰 **Today's Hot Mandi Rates**: Onion ₹35/kg, Potato ₹28/kg, Hybrid Tomato ₹40/kg, Palak ₹25/bunch, Fresh Green Peas ₹70/kg, Kashmiri Apple ₹140/kg! Because orders are batched directly from Mandi stalls, you save up to 25% compared to normal quick-commerce."

        if any(w in text for w in ["recipe", "cook", "khana", "sabzi", "dinner", "lunch"]):
            return "🍲 **Chef's Recommendation**: Try making *Aloo Palak with freshly chopped Garlic & Ginger* or a vibrant *Mixed Veg Kadai* with fresh Shimla Mirch, Cauliflower, and Sweet Peas. Add fresh Coriander at the end for pure aroma!"

        if any(w in text for w in ["admin", "vendor", "transporter", "login", "role"]):
            return "🔐 **Role Logins**: You can sign in as a **Customer**, **Vendor / Farmer**, or **Transporter**. Each role opens its own dashboard after authentication."

        return "Namaste! 🙏 I am **Dost**, your Sabzi Mandi Assistant. Ask me anything about today's fresh mandi prices, tomorrow's mini-truck colony batch timings, tracking your order, or direct farmer sourcing!"

def run():
    init_and_seed_db()
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, SabziMandiRequestHandler)
    print("\n==================================================================")
    print("SabziMandi Pro - Batched Quick Commerce Platform Online!")
    print(f"Server running on: http://localhost:{PORT}")
    print("Public portals: Customer, Vendor/Farmer, Transporter")
    print("==================================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Shutting down cleanly.")
        httpd.server_close()

if __name__ == "__main__":
    run()

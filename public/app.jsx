const { useState, useEffect, useMemo, useRef } = React;

// Fallback products catalog with authentic Indian fruits and vegetables
const DEFAULT_PRODUCTS = [
  // VEGETABLES
  { product_id: 1, item_name: "Onion (Pyaz / Kanda)", category: "Vegetable", hindi_name: "प्याज़ (लाल नासिक)", unit: "1 kg", price_per_kg: 35, total_stock_kg: 85, image_url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80", shelf_life: "15-20 days", description: "Fresh pungent Nashik red onions, kitchen staple" },
  { product_id: 2, item_name: "Potato (Aloo)", category: "Vegetable", hindi_name: "आलू (पहाड़ी)", unit: "1 kg", price_per_kg: 28, total_stock_kg: 120, image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80", shelf_life: "15-25 days", description: "Firm soil-dusted fresh Jyoti potatoes for curries and fries" },
  { product_id: 3, item_name: "Tomato (Tamatar Hybrid)", category: "Vegetable", hindi_name: "टमाटर (ताज़ा हाइब्रिड)", unit: "1 kg", price_per_kg: 40, total_stock_kg: 60, image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Juicy firm red ripe tomatoes, high lycopene" },
  { product_id: 4, item_name: "Desi Tomato (Country Tamatar)", category: "Vegetable", hindi_name: "टमाटर (देशी खट्टा)", unit: "1 kg", price_per_kg: 45, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1546470427-227c7369a9b2?w=400&auto=format&fit=crop&q=80", shelf_life: "4-6 days", description: "Tangy flavorful desi country tomatoes for gravies and rasam" },
  { product_id: 5, item_name: "Garlic (Lahsun)", category: "Vegetable", hindi_name: "लहसुन (देसी लहसुन)", unit: "250g", price_per_kg: 180, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1588720888769-d652934ec710?w=400&auto=format&fit=crop&q=80", shelf_life: "30 days", description: "Pungent cured garlic cloves from MP farms" },
  { product_id: 6, item_name: "Ginger (Adrak)", category: "Vegetable", hindi_name: "अदरक (ताज़ा अदरक)", unit: "250g", price_per_kg: 120, total_stock_kg: 25, image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80", shelf_life: "14 days", description: "Zesty aromatic fresh ginger root, rich in gingerol" },
  { product_id: 7, item_name: "Green Chilli (Hari Mirch)", category: "Vegetable", hindi_name: "हरी मिर्च (तीखी)", unit: "200g", price_per_kg: 60, total_stock_kg: 20, image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80", shelf_life: "7-10 days", description: "Crisp spicy green chillies, handpicked fresh" },
  { product_id: 8, item_name: "Spinach (Palak)", category: "Vegetable", hindi_name: "पालक (ताज़ा पत्ती)", unit: "1 bunch (~300g)", price_per_kg: 25, total_stock_kg: 35, image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80", shelf_life: "2-3 days", description: "Crisp tender farm-harvested green palak leaves" },
  { product_id: 9, item_name: "Coriander Leaves (Hara Dhaniya)", category: "Vegetable", hindi_name: "हरा धनिया (ताज़ा)", unit: "1 bunch (~150g)", price_per_kg: 15, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1589135233689-d5612803bba2?w=400&auto=format&fit=crop&q=80", shelf_life: "3-4 days", description: "Aromatic fresh green coriander with roots, dew fresh" },
  { product_id: 10, item_name: "Mint Leaves (Pudina)", category: "Vegetable", hindi_name: "पुदीना पत्ती", unit: "1 bunch (~100g)", price_per_kg: 15, total_stock_kg: 25, image_url: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&auto=format&fit=crop&q=80", shelf_life: "3-5 days", description: "Refreshing fragrant garden mint for chutneys and drinks" },
  { product_id: 11, item_name: "Bottle Gourd (Lauki / Doodhi)", category: "Vegetable", hindi_name: "लौकी / दूधी", unit: "1 pc (~800g)", price_per_kg: 35, total_stock_kg: 50, image_url: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&auto=format&fit=crop&q=80", shelf_life: "6-8 days", description: "Tender light-green gourd, low calorie & hydrating" },
  { product_id: 12, item_name: "Cauliflower (Phool Gobi)", category: "Vegetable", hindi_name: "फूल गोभी (ताज़ा)", unit: "1 pc (~700g)", price_per_kg: 45, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Snow white crisp curd cauliflower surrounded by fresh leaves" },
  { product_id: 13, item_name: "Cabbage (Patta Gobi)", category: "Vegetable", hindi_name: "पत्ता गोभी (बंधा)", unit: "1 pc (~600g)", price_per_kg: 30, total_stock_kg: 45, image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80", shelf_life: "8-12 days", description: "Tight compact green round cabbage head" },
  { product_id: 14, item_name: "Carrot (Gajar)", category: "Vegetable", hindi_name: "गाजर (रसदार लाल)", unit: "500g", price_per_kg: 50, total_stock_kg: 55, image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80", shelf_life: "7-10 days", description: "Sweet crunchy carrots, ideal for salads and halwa" },
  { product_id: 15, item_name: "Ladyfinger / Okra (Bhindi)", category: "Vegetable", hindi_name: "भिंडी (मुलायम हरी)", unit: "500g", price_per_kg: 45, total_stock_kg: 35, image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80", shelf_life: "3-5 days", description: "Young tender snappy okra, zero fibres" },
  { product_id: 16, item_name: "Bitter Gourd (Karela)", category: "Vegetable", hindi_name: "करेला (हरा देशी)", unit: "500g", price_per_kg: 50, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Deep green spiky bitter gourd, excellent for sugar balance" },
  { product_id: 17, item_name: "Capsicum (Shimla Mirch)", category: "Vegetable", hindi_name: "शिमला मिर्च (हरी)", unit: "500g", price_per_kg: 65, total_stock_kg: 35, image_url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Glossy crunchy bell peppers for stir fries" },
  { product_id: 18, item_name: "Brinjal (Bharta Baingan)", category: "Vegetable", hindi_name: "बैंगन (भरता)", unit: "500g", price_per_kg: 40, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80", shelf_life: "4-6 days", description: "Large glossy round purple brinjal, tender pulp" },
  { product_id: 19, item_name: "Fenugreek Leaves (Methi)", category: "Vegetable", hindi_name: "मेथी भाजी (हरी)", unit: "1 bunch (~250g)", price_per_kg: 20, total_stock_kg: 25, image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80", shelf_life: "2-3 days", description: "Fragrant dark green methi bunches from Junnar" },
  { product_id: 20, item_name: "Green Peas (Taza Matar)", category: "Vegetable", hindi_name: "ताज़ा मटर के दाने", unit: "500g", price_per_kg: 70, total_stock_kg: 45, image_url: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Sweet green seasonal peas in pods" },
  { product_id: 21, item_name: "Cucumber (Kheera)", category: "Vegetable", hindi_name: "खीरा / ककड़ी", unit: "500g", price_per_kg: 35, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1449339854873-750e6913301b?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Crisp cooling salad cucumbers with thin peel" },
  { product_id: 22, item_name: "Lemon (Kagzi Nimbu)", category: "Vegetable", hindi_name: "कागज़ी नींबू (रसदार)", unit: "4 pcs (~200g)", price_per_kg: 50, total_stock_kg: 25, image_url: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop&q=80", shelf_life: "14 days", description: "Thin skinned juicy yellow lemons with intense citrus tang" },
  { product_id: 23, item_name: "Beetroot (Chukandar)", category: "Vegetable", hindi_name: "चुकंदर (लाल)", unit: "500g", price_per_kg: 45, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80", shelf_life: "12 days", description: "Earthy sweet ruby-red beetroots rich in iron" },

  // FRUITS
  { product_id: 24, item_name: "Banana (Robusta Kela)", category: "Fruit", hindi_name: "केला (रोबस्टा)", unit: "1 dozen (12 pcs)", price_per_kg: 55, total_stock_kg: 50, image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80", shelf_life: "3-5 days", description: "Naturally ripened sweet bananas packed with potassium" },
  { product_id: 25, item_name: "Elaichi Banana (Yellaki)", category: "Fruit", hindi_name: "इलायची केला (येलक्की)", unit: "500g (approx 6-7 pcs)", price_per_kg: 70, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80", shelf_life: "3-4 days", description: "Small fragrant creamy baby bananas, high natural sweetness" },
  { product_id: 26, item_name: "Apple (Kashmiri Lal)", category: "Fruit", hindi_name: "सेब (कश्मीरी मीठा)", unit: "1 kg (~4-5 pcs)", price_per_kg: 140, total_stock_kg: 65, image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80", shelf_life: "10-15 days", description: "Crisp sweet mountain apples from Sopore valley" },
  { product_id: 27, item_name: "Papaya (Ripe Papita)", category: "Fruit", hindi_name: "पपीता (मीठा लाल)", unit: "1 pc (~1 kg)", price_per_kg: 50, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&auto=format&fit=crop&q=80", shelf_life: "3-5 days", description: "Semi-firm sweet golden flesh papaya, digestion booster" },
  { product_id: 28, item_name: "Pomegranate (Kandhari Anar)", category: "Fruit", hindi_name: "अनार (कंधारी लाल दाने)", unit: "1 kg (~3-4 pcs)", price_per_kg: 160, total_stock_kg: 45, image_url: "https://images.unsplash.com/photo-1541344999736-83eca872f242?w=400&auto=format&fit=crop&q=80", shelf_life: "10-14 days", description: "Ruby red sweet arils bursting with antioxidants" },
  { product_id: 29, item_name: "Mango (Alphonso / Ratnagiri Hapus)", category: "Fruit", hindi_name: "आम (हापुस रत्नागिरी)", unit: "1 dozen", price_per_kg: 450, total_stock_kg: 35, image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80", shelf_life: "4-6 days", description: "King of mangoes, GI tagged authentic Ratnagiri aroma" },
  { product_id: 30, item_name: "Mango (Dasheri)", category: "Fruit", hindi_name: "आम (दशहरी लखनवी)", unit: "1 kg", price_per_kg: 120, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80", shelf_life: "4-6 days", description: "Aromatic honey-sweet Dasheri mangoes from Malihabad" },
  { product_id: 31, item_name: "Nagpur Orange (Santra)", category: "Fruit", hindi_name: "संतरा (नागपुरी रसीला)", unit: "1 kg", price_per_kg: 80, total_stock_kg: 50, image_url: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80", shelf_life: "7-10 days", description: "Juicy loose-skin sweet and tangy oranges" },
  { product_id: 32, item_name: "Sweet Lime (Mosambi)", category: "Fruit", hindi_name: "मौसंबी (ताज़ा जूस)", unit: "1 kg", price_per_kg: 75, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80", shelf_life: "7-10 days", description: "Plump sweet mosambi, ideal for refreshing morning juice" },
  { product_id: 33, item_name: "Guava (Allahabad Safeda Amrood)", category: "Fruit", hindi_name: "अमरूद (सफेदा मीठा)", unit: "500g", price_per_kg: 60, total_stock_kg: 35, image_url: "https://images.unsplash.com/photo-1536511135899-733f11075253?w=400&auto=format&fit=crop&q=80", shelf_life: "4-6 days", description: "Crisp white flesh sweet fragrant guavas" },
  { product_id: 34, item_name: "Sapodilla (Chikoo)", category: "Fruit", hindi_name: "चीकू (मीठा गोल)", unit: "500g", price_per_kg: 70, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1536511135899-733f11075253?w=400&auto=format&fit=crop&q=80", shelf_life: "3-5 days", description: "Brown velvety caramel-tasting sweet Dahanu chikoos" },
  { product_id: 35, item_name: "Watermelon (Tarbooz)", category: "Fruit", hindi_name: "तरबूज़ (गहरा लाल)", unit: "1 pc (~2.5 kg)", price_per_kg: 30, total_stock_kg: 70, image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80", shelf_life: "7-10 days", description: "Sun-ripened red juicy sweet watermelon" },
  { product_id: 36, item_name: "Green Grapes (Sonaka Angoor)", category: "Fruit", hindi_name: "अंगूर (सोनाका हरा)", unit: "500g", price_per_kg: 90, total_stock_kg: 40, image_url: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&auto=format&fit=crop&q=80", shelf_life: "4-7 days", description: "Crisp seedless elongated sweet green grapes from Nashik" },
  { product_id: 37, item_name: "Fresh Pineapple (Ananas)", category: "Fruit", hindi_name: "अनन्नास (ताज़ा मीठा)", unit: "1 pc (~1 kg)", price_per_kg: 70, total_stock_kg: 25, image_url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&auto=format&fit=crop&q=80", shelf_life: "5-7 days", description: "Golden queen sweet pineapple with intoxicating tropical aroma" },
  { product_id: 38, item_name: "Tender Coconut (Nariyal Pani)", category: "Fruit", hindi_name: "नारियल पानी (मलाईदार)", unit: "1 pc", price_per_kg: 55, total_stock_kg: 50, image_url: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&auto=format&fit=crop&q=80", shelf_life: "7 days", description: "Electrolyte rich sweet coconut water with tender malai" },
  { product_id: 39, item_name: "Dragon Fruit (Kamalam)", category: "Fruit", hindi_name: "ड्रैगन फ्रूट (कमलम)", unit: "1 pc (~350g)", price_per_kg: 90, total_stock_kg: 20, image_url: "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&auto=format&fit=crop&q=80", shelf_life: "7-10 days", description: "Vibrant exotic pink fruit with mild sweet crunch" },
  { product_id: 40, item_name: "Kiwi (Zespri Green)", category: "Fruit", hindi_name: "कीवी (विटामिन सी)", unit: "Pack of 3 pcs", price_per_kg: 110, total_stock_kg: 30, image_url: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&auto=format&fit=crop&q=80", shelf_life: "8-12 days", description: "Tangy sweet green kiwi rich in Vitamin C and fiber" }
];

const SOCIETIES = [
  { name: "Shivam Society, Andheri East", pincode: "400069", batch_id: 1, driver: "Ramesh Kumar", truck: "MH-02-AB-1234" },
  { name: "Shivaji Park Co-op, Dadar West", pincode: "400028", batch_id: 3, driver: "Vijay Shinde", truck: "MH-01-EE-9900" },
  { name: "Palm Beach Enclave, Vashi", pincode: "400703", batch_id: 4, driver: "Manoj Yadav", truck: "MH-43-XY-4421" },
  { name: "Pali Hill Heights, Bandra West", pincode: "400050", batch_id: 2, driver: "Suresh Patil", truck: "MH-04-CD-5678" },
  { name: "Hiranandani Gardens, Powai", pincode: "400076", batch_id: 1, driver: "Ramesh Kumar", truck: "MH-02-AB-1234" }
];

function App() {
  // Current active role: 'customer' | 'vendor' | 'transporter' | 'admin'
  const [activeRole, setActiveRole] = useState('customer');
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sabzimandi_user');
      return saved ? JSON.parse(saved) : {
        role: 'customer',
        customer_id: 1,
        name: 'Rahul Sharma',
        phone: '9998887776',
        society: 'Shivam Society, Andheri East',
        address: 'B-402, Shivam Society, Andheri East'
      };
    } catch(e) {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRoleTab, setLoginRoleTab] = useState('customer'); // 'customer' | 'vendor' | 'transporter' | 'admin' | 'register'
  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: '',
    username: '',
    name: '',
    society: 'Shivam Society, Andheri East',
    shop_number: 'Shop No. 12',
    truck_number: 'MH-02-AB-1234'
  });
  const [loginError, setLoginError] = useState(null);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [batches, setBatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(SOCIETIES[0]);
  const [deliverySlot, setDeliverySlot] = useState("Tomorrow Morning (6:30 AM - 8:30 AM)");
  
  // Cart & UI State
  const [cart, setCart] = useState([]); // { product_id, qty, item }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);
  const [activeTrackingModal, setActiveTrackingModal] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste! 🙏 Welcome to SabziMandi Pro. I am **Dost**, your friendly Sabzi Mandi assistant! Ask me about tomorrow’s colony mini-truck cutoff, fresh mandi rates, recipes, or order status.' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [orderNotice, setOrderNotice] = useState(null);

  // Admin Studio State
  const [sqlQuery, setSqlQuery] = useState("SELECT c.full_name AS Customer, v.vendor_name AS Sold_By, p.item_name AS Item, oi.quantity_kg AS Qty, vi.price_per_kg AS Rate_Rs, oi.subtotal AS Item_Total, o.total_amount AS Grand_Total\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.customer_id\nJOIN Order_Items oi ON o.order_id = oi.order_id\nJOIN Products p ON oi.product_id = p.product_id\nJOIN Vendor_Inventory vi ON p.product_id = vi.product_id AND o.vendor_id = vi.vendor_id\nJOIN Vendors v ON o.vendor_id = v.vendor_id\nLIMIT 10;");
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Load Data from API if available
  useEffect(() => {
    fetchProducts();
    fetchBatches();
    fetchOrders();
    fetchInventory();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setProducts(data);
      }
    } catch (e) {
      console.log("Using local default products");
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/batches');
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    } catch (e) {
      setBatches([
        { batch_id: 1, truck_number: 'MH-02-AB-1234', driver_name: 'Ramesh Kumar', driver_phone: '9876543210', shift: 'Morning', max_capacity_kg: 500, current_load_kg: 8.75, status: 'Scheduled', region_name: 'Andheri East Sabzi Mandi & Societies' },
        { batch_id: 2, truck_number: 'MH-04-CD-5678', driver_name: 'Suresh Patil', driver_phone: '8765432109', shift: 'Evening', max_capacity_kg: 500, current_load_kg: 14.50, status: 'Scheduled', region_name: 'Bandra West Pali Hill' },
        { batch_id: 3, truck_number: 'MH-01-EE-9900', driver_name: 'Vijay Shinde', driver_phone: '9898981122', shift: 'Morning', max_capacity_kg: 600, current_load_kg: 22.00, status: 'Scheduled', region_name: 'Dadar Wholesale APMC & Shivaji Park' }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      setOrders([
        {
          order_id: 101,
          customer_name: "Rahul Sharma",
          customer_phone: "9998887776",
          vendor_name: "Raju Fresh Veggies",
          truck_number: "MH-02-AB-1234",
          driver_name: "Ramesh Kumar",
          driver_phone: "9876543210",
          total_amount: 500.0,
          payment_status: "Paid",
          payment_mode: "UPI (Google Pay)",
          order_status: "Packed",
          society_name: "Shivam Society, Andheri East",
          delivery_slot: "Tomorrow Morning (6:30 AM - 8:30 AM)",
          created_at: new Date().toISOString(),
          items: [
            { item_name: "Onion (Pyaz / Kanda)", quantity_kg: 3.0, subtotal: 105.0 },
            { item_name: "Potato (Aloo)", quantity_kg: 2.5, subtotal: 70.0 },
            { item_name: "Tomato (Tamatar Hybrid)", quantity_kg: 2.0, subtotal: 80.0 },
            { item_name: "Spinach (Palak)", quantity_kg: 1.0, subtotal: 25.0 }
          ]
        }
      ]);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory?vendor_id=1');
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (e) {
      console.log("Using default inventory");
    }
  };

  // Auth Operations
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoginError(null);

    const payload = {
      role: loginRoleTab,
      phone: loginForm.phone,
      password: loginForm.password,
      username: loginForm.username,
      name: loginForm.name,
      society: loginForm.society
    };

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setLoginError(data.error || "Authentication failed");
        return;
      }

      const user = data.user;
      if (loginForm.name && loginForm.name.trim()) {
        user.name = loginForm.name.trim();
      }
      setCurrentUser(user);
      localStorage.setItem('sabzimandi_user', JSON.stringify(user));
      setActiveRole(user.role);
      setIsLoginModalOpen(false);
      setLoginSuccessNotice(`Successfully logged in as ${user.name}!`);
      setTimeout(() => setLoginSuccessNotice(null), 4000);
    } catch (err) {
      // Local fallback for offline mode
      let fallbackUser = {
        role: loginRoleTab,
        name: loginForm.name || (loginRoleTab === 'admin' ? 'Aditya Sharma (Master Admin)' : loginRoleTab === 'vendor' ? 'Raju Fresh Veggies' : loginRoleTab === 'transporter' ? 'Ramesh Kumar (Driver)' : 'Rahul Sharma'),
        phone: loginForm.phone || '9998887776',
        society: loginForm.society
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('sabzimandi_user', JSON.stringify(fallbackUser));
      setActiveRole(loginRoleTab);
      setIsLoginModalOpen(false);
    }
  };

  const handle1ClickDemoLogin = (roleType) => {
    let demoUser = null;
    if (roleType === 'customer') {
      demoUser = {
        role: 'customer',
        customer_id: 1,
        name: 'Rahul Sharma',
        phone: '9998887776',
        society: 'Shivam Society, Andheri East',
        address: 'B-402, Shivam Society, Andheri East'
      };
    } else if (roleType === 'vendor') {
      demoUser = {
        role: 'vendor',
        vendor_id: 1,
        name: 'Raju Fresh Veggies',
        phone: '9876543211',
        shop_number: 'Shop No. 12, Andheri Mandi',
        rating: 4.8
      };
    } else if (roleType === 'transporter') {
      demoUser = {
        role: 'transporter',
        batch_id: 1,
        name: 'Ramesh Kumar',
        phone: '9876543210',
        truck_number: 'MH-02-AB-1234',
        shift: 'Morning'
      };
    } else if (roleType === 'admin') {
      demoUser = {
        role: 'admin',
        name: 'Aditya Sharma (Master Admin)',
        username: 'admin',
        permissions: 'FULL_SUPERUSER_ACCESS'
      };
    }

    if (demoUser) {
      setCurrentUser(demoUser);
      localStorage.setItem('sabzimandi_user', JSON.stringify(demoUser));
      setActiveRole(demoUser.role);
      setIsLoginModalOpen(false);
      setLoginSuccessNotice(`⚡ Logged in as ${demoUser.name} (${demoUser.role.toUpperCase()})`);
      setTimeout(() => setLoginSuccessNotice(null), 4000);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sabzimandi_user');
    setActiveRole('customer');
    setIsUserMenuOpen(false);
    setLoginSuccessNotice("Logged out. You are now browsing as Guest.");
    setTimeout(() => setLoginSuccessNotice(null), 3000);
  };

  // Guarded role switch
  const handleSwitchRoleClick = (targetRole) => {
    if (targetRole === 'customer') {
      setActiveRole('customer');
      return;
    }

    if (currentUser?.role === targetRole) {
      setActiveRole(targetRole);
    } else {
      setLoginRoleTab(targetRole);
      setIsLoginModalOpen(true);
      setLoginError(`Please authenticate as a ${targetRole === 'vendor' ? 'Farmer/Mandi Vendor' : targetRole === 'transporter' ? 'Transporter' : 'Master Admin'} to access this portal.`);
    }
  };

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.product_id);
      if (existing) {
        return prev.map(item => item.product_id === product.product_id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product_id: product.product_id, qty: 1, item: product }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter(item => item.product_id !== productId);
      }
      return prev.map(item => item.product_id === productId ? { ...item, qty: item.qty - 1 } : item);
    });
  };

  const totalCartAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.qty * (item.item.price_per_kg || 40)), 0);
  }, [cart]);

  const totalCartWeightKg = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  // Handle Checkout & Order Placement
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (!currentUser) {
      setLoginRoleTab('customer');
      setIsLoginModalOpen(true);
      setLoginError("Please sign in or create an account to place your batched colony order!");
      return;
    }

    const payload = {
      customer_id: currentUser.customer_id || 1,
      vendor_id: 1,
      batch_id: selectedSociety.batch_id || 1,
      delivery_address: currentUser.address || `Flat 402, ${selectedSociety.name}`,
      society_name: selectedSociety.name,
      delivery_slot: deliverySlot,
      payment_mode: "UPI (Direct Mandi Settlement)",
      items: cart.map(c => ({
        product_id: c.product_id,
        quantity_kg: c.qty,
        price_per_kg: c.item.price_per_kg || 40
      }))
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      const newOrderId = data.order_id || (Math.floor(Math.random() * 900) + 100);
      
      fetchOrders();
      fetchBatches();
      fetchProducts();

      setOrderNotice({
        order_id: newOrderId,
        society: selectedSociety.name,
        truck: selectedSociety.truck,
        driver: selectedSociety.driver,
        slot: deliverySlot,
        amount: totalCartAmount,
        weight: totalCartWeightKg
      });

      setCart([]);
      setIsCartOpen(false);
    } catch (e) {
      console.error(e);
      alert("Order placed offline! Total: ₹" + totalCartAmount);
      setCart([]);
      setIsCartOpen(false);
    }
  };

  // Chatbot send
  const handleSendChat = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const newMessages = [...chatMessages, { sender: 'user', text }];
    setChatMessages(newMessages);
    setChatInput("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setChatMessages([...newMessages, { sender: 'bot', text: data.reply }]);
    } catch (e) {
      setChatMessages([...newMessages, {
        sender: 'bot',
        text: "🚚 In our Batched Mini-Truck model, all orders from " + selectedSociety.name + " are aggregated into mini-truck " + selectedSociety.truck + " and delivered tomorrow morning! Fresh from Mandi at zero delivery fee."
      }]);
    }
  };

  // Run SQL query in Admin Studio
  const handleExecuteSql = async (customQuery) => {
    const queryToRun = customQuery || sqlQuery;
    setIsExecutingSql(true);
    setSqlError(null);
    setSqlResult(null);

    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSqlError(data.error || "Query execution failed");
      } else {
        setSqlResult(data);
      }
    } catch (e) {
      setSqlError(e.message);
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = categoryFilter === "All" || 
        (categoryFilter === "Vegetable" && p.category === "Vegetable") ||
        (categoryFilter === "Fruit" && p.category === "Fruit") ||
        (categoryFilter === "Leafy" && (p.item_name.includes("Palak") || p.item_name.includes("Dhaniya") || p.item_name.includes("Methi") || p.item_name.includes("Mint"))) ||
        (categoryFilter === "Staples" && (p.item_name.includes("Onion") || p.item_name.includes("Potato") || p.item_name.includes("Tomato") || p.item_name.includes("Garlic")));
      
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        p.item_name.toLowerCase().includes(q) || 
        (p.hindi_name && p.hindi_name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* SUCCESS TOAST BANNER */}
      {loginSuccessNotice && (
        <div className="fixed top-3 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <span>✓</span>
          <span>{loginSuccessNotice}</span>
        </div>
      )}

      {/* 1. TOP HEADER & ANNOUNCEMENT BAR */}
      <div className="bg-mandi-900 text-white text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-mandi-800">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-black text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full animate-pulse">
            ECO-BATCHED DELIVERY
          </span>
          <span>Order today by 10:00 PM ➔ Batched Colony Delivery in dedicated Mini-Truck tomorrow morning!</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-200">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Next Cutoff: 10:00 PM Tonight
          </span>
          <span className="hidden md:inline text-white/50">|</span>
          <span className="hidden md:flex items-center gap-1 text-emerald-300">
            🌱 Direct APMC & Farm Sourcing
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white text-2xl shadow-md shadow-emerald-500/20">
              🥦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">SABZI<span className="text-emerald-600">O</span></span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase">PRO</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 lowercase">from farms to your gate</p>
            </div>
          </div>

          {/* Colony / Society Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <div className="text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Delivering to Colony:</div>
              <select 
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                value={selectedSociety.name}
                onChange={(e) => {
                  const s = SOCIETIES.find(item => item.name === e.target.value);
                  if (s) setSelectedSociety(s);
                }}
              >
                {SOCIETIES.map(s => (
                  <option key={s.name} value={s.name}>{s.name} (PIN: {s.pincode})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <input
              type="text"
              placeholder="Search 40+ veggies & fruits (e.g. Aloo, Palak, Alphonso, Seb)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600">✕</button>
            )}
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => handleSwitchRoleClick('customer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'customer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🛒</span> <span className="hidden sm:inline">Customer</span>
            </button>
            
            <button
              onClick={() => handleSwitchRoleClick('vendor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'vendor' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🚜</span> <span className="hidden sm:inline">Farmer/Vendor</span>
            </button>

            <button
              onClick={() => handleSwitchRoleClick('transporter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'transporter' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🚚</span> <span className="hidden sm:inline">Transporter</span>
            </button>

            <button
              onClick={() => handleSwitchRoleClick('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'admin' ? 'bg-slate-900 text-amber-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚙️</span> <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Cart Button */}
          {activeRole === 'customer' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <div className="text-left hidden xs:block">
                <div className="text-[10px] leading-3 text-emerald-200">
                  {cart.length > 0 ? `${cart.length} item(s)` : 'Cart'}
                </div>
                <div className="text-xs font-extrabold leading-4">
                  ₹{totalCartAmount}
                </div>
              </div>
            </button>
          )}

          {/* RIGHT TOP CORNER: PROMINENT LOGGED-IN CUSTOMER BADGE */}
          <div className="relative">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-500/80 hover:border-emerald-600 px-3 py-1.5 rounded-2xl shadow-sm transition-all group"
                  title="Click to view logged in customer details or switch account"
                >
                  {/* Status pulsing dot & avatar */}
                  <div className="relative">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center text-sm font-black shadow-md shadow-emerald-600/30">
                      {currentUser.role === 'admin' ? '⚙️' : currentUser.role === 'vendor' ? '🚜' : currentUser.role === 'transporter' ? '🚚' : '👤'}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-ping"></span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/90 px-1.5 py-0.5 rounded-md leading-none">
                        {currentUser.role === 'customer' ? 'Customer Logged In' : `${currentUser.role} Logged In`}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight mt-0.5 flex items-center gap-1">
                      <span>{currentUser.name}</span>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-700 font-bold ml-1 group-hover:translate-y-0.5 transition-transform">
                    ▼
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95">
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Logged In Customer
                      </div>
                      <div className="font-black text-sm text-slate-900 mt-1">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium">{currentUser.phone || currentUser.username}</div>
                      {currentUser.society && (
                        <div className="text-[10px] text-emerald-800 font-bold bg-white/80 px-2 py-0.5 rounded-md mt-1.5 border border-emerald-200 inline-block">
                          📍 {currentUser.society}
                        </div>
                      )}
                    </div>

                    <div className="pt-1 space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setLoginRoleTab(currentUser.role);
                          setIsLoginModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-2 transition"
                      >
                        <span>🔄</span>
                        <span>Switch Account / Change Name</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 font-bold text-red-600 flex items-center gap-2 transition"
                      >
                        <span>🚪</span>
                        <span>Sign Out (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginRoleTab('customer');
                  setIsLoginModalOpen(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-600/30 transition hover:scale-105 active:scale-95"
              >
                <span>🔐</span>
                <span>Customer Login</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* AUTHENTICATION / LOGIN MODAL */}
      {/* ========================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">
                {loginRoleTab === 'customer' ? '🛒' : loginRoleTab === 'vendor' ? '🚜' : loginRoleTab === 'transporter' ? '🚚' : loginRoleTab === 'admin' ? '⚙️' : '✨'}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                SabziMandi Pro Authentication
              </h2>
              <p className="text-xs text-slate-500">
                Dedicated Logins for Customers, Farmers/Vendors, Transporters & Master Admin
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-[11px] font-bold">
              {[
                { id: 'customer', label: 'Customer', icon: '🛒' },
                { id: 'vendor', label: 'Farmer/Vendor', icon: '🚜' },
                { id: 'transporter', label: 'Transporter', icon: '🚚' },
                { id: 'admin', label: 'Admin', icon: '⚙️' },
                { id: 'register', label: 'New User', icon: '✨' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setLoginRoleTab(tab.id);
                    setLoginError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    loginRoleTab === tab.id
                      ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* 1. CUSTOMER LOGIN TAB */}
            {loginRoleTab === 'customer' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1">
                    <span>🛒 Customer Account Login</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Order fresh veggies & fruits a day prior for tomorrow morning's dedicated mini-truck delivery!
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Customer Name (e.g. XYZ / Rahul Sharma)</label>
                  <input
                    type="text"
                    placeholder="Enter your name (e.g. Rahul Sharma, XYZ)"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9998887776"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Password / Security PIN</label>
                  <input
                    type="password"
                    placeholder="Enter password (default: hashed_pwd_123)"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Select Delivery Colony / Society</label>
                  <select
                    value={loginForm.society}
                    onChange={(e) => setLoginForm({ ...loginForm, society: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {SOCIETIES.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Sign In as Customer
                  </button>

                  <button
                    type="button"
                    onClick={() => handle1ClickDemoLogin('customer')}
                    className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold py-2 rounded-xl text-xs transition border border-emerald-300 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ 1-Click Demo Login as Rahul Sharma (Customer)</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. FARMER & VENDOR LOGIN TAB */}
            {loginRoleTab === 'vendor' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1">
                    <span>🚜 Mandi Vendor & Farmer Stall Access</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Manage daily mandi stock (kg), live rates (₹/kg), and prepare tomorrow morning's colony crates.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Vendor Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543211 (Raju Fresh Veggies)"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Select APMC Mandi</label>
                  <select
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Vashi APMC Mega Mandi (Sector 19)</option>
                    <option>Dadar Wholesale Flower & Sabzi Market</option>
                    <option>Andheri Station Road Sabzi Mandi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Stall / Gala Number</label>
                  <input
                    type="text"
                    defaultValue="Shop No. 12"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Sign In as Mandi Vendor
                  </button>

                  <button
                    type="button"
                    onClick={() => handle1ClickDemoLogin('vendor')}
                    className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold py-2 rounded-xl text-xs transition border border-amber-300 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ 1-Click Demo Login as Raju Fresh Veggies (Vendor)</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. TRANSPORTER LOGIN TAB */}
            {loginRoleTab === 'transporter' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl text-xs text-teal-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1">
                    <span>🚚 Transporter & Mini-Truck Partner Console</span>
                  </div>
                  <p className="text-[11px] text-teal-700">
                    Access your assigned colony mini-truck manifest (DBMS View 2), payload meter, and delivery stops.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Driver Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210 (Ramesh Kumar)"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Mini-Truck Number (Tempo)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-02-AB-1234 (Tata Ace)"
                    value={loginForm.truck_number}
                    onChange={(e) => setLoginForm({ ...loginForm, truck_number: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Delivery Shift</label>
                  <select
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Morning Shift (6:30 AM - 8:30 AM)</option>
                    <option>Evening Shift (5:00 PM - 7:30 PM)</option>
                  </select>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Sign In as Transporter
                  </button>

                  <button
                    type="button"
                    onClick={() => handle1ClickDemoLogin('transporter')}
                    className="w-full bg-teal-100 hover:bg-teal-200 text-teal-900 font-extrabold py-2 rounded-xl text-xs transition border border-teal-300 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ 1-Click Demo Login as Ramesh Kumar (Mini-Truck Driver)</span>
                  </button>
                </div>
              </form>
            )}

            {/* 4. MASTER ADMIN LOGIN TAB */}
            {loginRoleTab === 'admin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs space-y-1">
                  <div className="font-extrabold text-amber-400 flex items-center gap-1">
                    <span>⚙️ Master Administrator Login</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Full DBMS SQL Query Studio, Produce Catalog CRUD, and System Superuser control.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Administrator Username</label>
                  <input
                    type="text"
                    required
                    placeholder="admin or aditya"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Admin Passcode</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter admin passcode (default: admin123)"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Authenticate as Master Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => handle1ClickDemoLogin('admin')}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold py-2 rounded-xl text-xs transition border border-slate-300 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ 1-Click Demo Login as Master Admin (Aditya Sharma)</span>
                  </button>
                </div>
              </form>
            )}

            {/* 5. NEW USER REGISTRATION TAB */}
            {loginRoleTab === 'register' && (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch('/api/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: loginForm.name,
                        phone: loginForm.phone,
                        society: loginForm.society,
                        address: `${loginForm.society}`
                      })
                    });
                    const data = await res.json();
                    if (data.user) {
                      setCurrentUser(data.user);
                      localStorage.setItem('sabzimandi_user', JSON.stringify(data.user));
                      setActiveRole('customer');
                      setIsLoginModalOpen(false);
                      setLoginSuccessNotice(`Welcome to SabziMandi Pro, ${data.user.name}!`);
                    }
                  } catch(err) {
                    handle1ClickDemoLogin('customer');
                  }
                }} 
                className="space-y-3.5"
              >
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <div className="font-extrabold">✨ Create New Customer Account</div>
                  <p className="text-[11px] text-emerald-700">
                    Register with your society address to enjoy free colony mini-truck delivery!
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Colony / Society Name</label>
                  <select
                    value={loginForm.society}
                    onChange={(e) => setLoginForm({ ...loginForm, society: e.target.value })}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {SOCIETIES.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Create Account & Start Ordering
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER BASED ON ACTIVE ROLE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">

        {/* ========================================================= */}
        {/* VIEW 1: CUSTOMER PORTAL */}
        {/* ========================================================= */}
        {activeRole === 'customer' && (
          <div className="space-y-6">
            
            {/* Hero Banner: Explaining the Colony Batch Delivery Model */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="max-w-2xl relative z-10 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                    <span>🚛</span>
                    <span>1 Colony = 1 Dedicated Mini-Truck. Zero Multiple Delivery Hustle!</span>
                  </div>
                  {currentUser && currentUser.role === 'customer' && (
                    <div className="inline-flex items-center gap-2 bg-emerald-400/20 backdrop-blur border border-emerald-300/40 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span>Customer: <b>{currentUser.name}</b></span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  Mandi-Fresh Sabzi & Fruits <br className="hidden sm:inline"/>
                  <span className="text-emerald-300">Batched Straight to Your Society Gate.</span>
                </h1>
                <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                  Order a day prior by 10:00 PM. Our Vashi & Dadar Mandi vendors harvest & sort at night, and mini-trucks deliver directly to <b>{selectedSociety.name}</b> at wholesale rates.
                </p>

                {/* Batch Status Bar */}
                <div className="bg-black/30 backdrop-blur rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
                      🚚
                    </div>
                    <div>
                      <div className="text-xs text-emerald-300 font-medium">Tomorrow's Colony Mini-Truck:</div>
                      <div className="text-sm font-bold text-white">{selectedSociety.truck} (Driver: {selectedSociety.driver})</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-emerald-200">Current Tempo Load:</span>
                      <div className="font-bold text-white text-sm">8.75 kg / 500 kg</div>
                    </div>
                    <div className="w-24 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    <button 
                      onClick={() => setActiveTrackingModal(batches[0] || { truck_number: selectedSociety.truck, driver_name: selectedSociety.driver, driver_phone: '9876543210', max_capacity_kg: 500, current_load_kg: 8.75, shift: 'Morning', delivery_date: 'Tomorrow' })}
                      className="bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      Track Tempo ➔
                    </button>
                  </div>
                </div>

              </div>

              {/* Decorative Background Art */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center text-9xl">
                🥬🍉
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "All", label: "All Items", icon: "🧺" },
                { id: "Vegetable", label: "Fresh Vegetables", icon: "🥦" },
                { id: "Fruit", label: "Fresh Fruits", icon: "🍎" },
                { id: "Staples", label: "Daily Staples (Aloo, Pyaz)", icon: "🥔" },
                { id: "Leafy", label: "Green Leafy & Herbs", icon: "🥬" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    categoryFilter === cat.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {categoryFilter === "All" ? "All Indian Market Fruits & Vegetables" : `${categoryFilter} Produce`}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {filteredProducts.length} farm & mandi items available for tomorrow's batch
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ⚡ 0₹ Society Delivery Charge
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <span className="text-4xl">🔍</span>
                  <h3 className="text-base font-bold text-slate-800 mt-2">No matching produce found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try searching for Pyaz, Tamatar, Bhindi, or Alphonso</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredProducts.map(product => {
                    const inCart = cart.find(c => c.product_id === product.product_id);
                    const mrp = Math.round((product.price_per_kg || 40) * 1.25);
                    const discount = Math.round(((mrp - (product.price_per_kg || 40)) / mrp) * 100);

                    return (
                      <div 
                        key={product.product_id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden flex flex-col group"
                      >
                        {/* Image Container with Badges */}
                        <div className="relative h-40 bg-slate-100 overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.item_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400";
                            }}
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                              {discount}% OFF
                            </span>
                            <span className="bg-black/60 backdrop-blur text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                              {product.category}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            ⏳ {product.shelf_life || "4-5 days"}
                          </div>
                        </div>

                        {/* Produce Details */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="text-[11px] font-semibold text-emerald-700">
                              {product.hindi_name || ""}
                            </div>
                            <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {product.item_name}
                            </h3>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Unit: <span className="font-semibold text-slate-700">{product.unit || "1 kg"}</span>
                            </div>
                          </div>

                          {/* Pricing & Cart Action */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-extrabold text-slate-900">
                                  ₹{product.price_per_kg || 40}
                                </span>
                                <span className="text-[10px] text-slate-400 line-through">
                                  ₹{mrp}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-400 font-medium">Direct Mandi Rate</div>
                            </div>

                            {/* Add / Stepper Button */}
                            {inCart ? (
                              <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden font-bold text-xs shadow-sm">
                                <button 
                                  onClick={() => removeFromCart(product.product_id)}
                                  className="px-2 py-1 hover:bg-emerald-700 transition"
                                >
                                  -
                                </button>
                                <span className="px-2 py-1 text-center min-w-[20px]">{inCart.qty}</span>
                                <button 
                                  onClick={() => addToCart(product)}
                                  className="px-2 py-1 hover:bg-emerald-700 transition"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(product)}
                                className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-600 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <span>+</span>
                                <span>ADD</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customer Orders & Receipt History Section */}
            <div className="mt-12 bg-white rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Your Batched Colony Orders</h3>
                  <p className="text-xs text-slate-500">Live order status and printable DBMS itemized bill receipts</p>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Live DBMS Sync
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Order ID</th>
                      <th className="py-2.5 px-3 font-semibold">Society & Slot</th>
                      <th className="py-2.5 px-3 font-semibold">Assigned Mini-Truck</th>
                      <th className="py-2.5 px-3 font-semibold">Total Amount</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(o => (
                      <tr key={o.order_id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">#{o.order_id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{o.society_name || selectedSociety.name}</div>
                          <div className="text-[10px] text-slate-400">{o.delivery_slot || "Tomorrow Morning"}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-emerald-700">{o.truck_number || selectedSociety.truck}</div>
                          <div className="text-[10px] text-slate-400">Driver: {o.driver_name || selectedSociety.driver}</div>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">₹{o.total_amount}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            o.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            o.order_status === 'Out for Delivery' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            o.order_status === 'Packed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {o.order_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => setActiveReceiptModal(o)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-lg text-[11px] transition"
                          >
                            🧾 View Bill
                          </button>
                          <button
                            onClick={() => setActiveTrackingModal(o)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-lg text-[11px] transition"
                          >
                            🚚 Track
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

        {/* ========================================================= */}
        {/* VIEW 2: FARMER & MANDI VENDOR PORTAL */}
        {/* ========================================================= */}
        {activeRole === 'vendor' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-amber-200">
                  MANDI STALL & FARMER INTAKE DASHBOARD
                </span>
                <h1 className="text-2xl font-extrabold mt-2">Raju Fresh Veggies (Shop No. 12, Andheri Mandi)</h1>
                <p className="text-xs text-amber-200 mt-1">Direct Farmer Link: Sahyadri Agro Farms, Nashik & Konkan Orchards</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-black/30 rounded-2xl p-3 text-center border border-white/10">
                  <div className="text-[10px] text-amber-200 uppercase">Batched Orders Tomorrow</div>
                  <div className="text-xl font-extrabold text-white">4 Orders</div>
                </div>
                <div className="bg-black/30 rounded-2xl p-3 text-center border border-white/10">
                  <div className="text-[10px] text-amber-200 uppercase">Total Weight to Pack</div>
                  <div className="text-xl font-extrabold text-white">36.5 kg</div>
                </div>
              </div>
            </div>

            {/* Inventory Stock & Price Management Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Live Mandi Stall Inventory (DBMS Table: Vendor_Inventory)</h2>
                  <p className="text-xs text-slate-500">Update stock (kg) and today's mandi price per kg. Changes trigger instant database updates.</p>
                </div>
                <button 
                  onClick={() => alert("All updated stock values have been saved to SQLite Vendor_Inventory!")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition"
                >
                  💾 Save All Changes
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Current Mandi Rate (₹/kg)</th>
                      <th className="py-2.5 px-3">Available Stock (kg)</th>
                      <th className="py-2.5 px-3">Stock Status</th>
                      <th className="py-2.5 px-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.slice(0, 15).map(p => (
                      <tr key={p.product_id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{p.item_name}</div>
                          <div className="text-[10px] text-slate-400">{p.hindi_name}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.category === 'Vegetable' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-700">₹</span>
                            <input
                              type="number"
                              defaultValue={p.price_per_kg || 40}
                              className="w-16 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                              onBlur={(e) => {
                                fetch(`/api/products/${p.product_id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ price_per_kg: parseFloat(e.target.value) })
                                });
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            defaultValue={p.total_stock_kg || 50}
                            className="w-20 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                            onBlur={(e) => {
                              fetch(`/api/products/${p.product_id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ stock_kg: parseFloat(e.target.value) })
                              });
                            }}
                          />
                          <span className="ml-1 text-[11px] text-slate-400">kg</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ In Stock
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button 
                            onClick={() => alert(`Replenished +50kg for ${p.item_name}`)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded"
                          >
                            +50kg Crate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tomorrow Colony Batch Packing Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <h2 className="text-base font-extrabold text-slate-900 mb-2">Tomorrow Colony Packing Checklist</h2>
              <p className="text-xs text-slate-500 mb-4">Pack produce before morning tempo pickup at 5:00 AM.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map(o => (
                  <div key={o.order_id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Order #{o.order_id} - {o.customer_name}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                        {o.order_status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <div><b>Colony:</b> {o.society_name}</div>
                      <div><b>Slot:</b> {o.delivery_slot}</div>
                    </div>
                    <div className="border-t border-slate-200 pt-2 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700">Items to Pack:</div>
                      {(o.items || []).map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-600">
                          <span>• {it.item_name}</span>
                          <span className="font-bold text-slate-900">{it.quantity_kg} kg</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={async () => {
                        await fetch(`/api/orders/${o.order_id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'Packed' })
                        });
                        fetchOrders();
                        alert(`Order #${o.order_id} marked as PACKED for Mini-Truck pickup!`);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-xl text-xs transition"
                    >
                      ✓ Mark Order as Packed
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: TRANSPORTER / MINI-TRUCK PARTNER PORTAL */}
        {/* ========================================================= */}
        {activeRole === 'transporter' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-emerald-200">
                  MINI-TRUCK / TEMPO DRIVER CONSOLE (DBMS: Delivery_Batches)
                </span>
                <h1 className="text-2xl font-extrabold mt-2">Driver: Ramesh Kumar | Truck: MH-02-AB-1234</h1>
                <p className="text-xs text-emerald-200 mt-1">Dedicated Colony Mini-Truck for Andheri East & Shivam Society Batches</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-500 text-black font-extrabold text-xs px-3 py-1.5 rounded-xl animate-pulse">
                  Morning Shift: 6:30 AM - 8:30 AM
                </span>
              </div>
            </div>

            {/* Tempo Load Meter & Progress Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Current Tempo Load Capacity (Trigger: After_Order_Item_Insert)</h3>
                  <p className="text-xs text-slate-500">Live aggregated weight of all colony crates currently scheduled for this mini-truck</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-600">8.75 kg</span>
                  <span className="text-xs text-slate-400"> / 500.0 kg max</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(8.75 / 500) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>0 kg (Empty)</span>
                <span>250 kg (Half Load)</span>
                <span>500 kg (Full Capacity)</span>
              </div>

              {/* Action Buttons for Driver */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    await fetch('/api/batches/1/status', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Out for Delivery' })
                    });
                    fetchOrders();
                    alert("Mini-Truck MH-02-AB-1234 is now OUT FOR DELIVERY! Customers notified.");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2"
                >
                  <span>🚀</span>
                  <span>Start Colony Delivery Trip (Out for Delivery)</span>
                </button>

                <button
                  onClick={async () => {
                    await fetch('/api/batches/1/status', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Delivered' })
                    });
                    fetchOrders();
                    alert("All society drop-offs completed! Orders marked DELIVERED.");
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2"
                >
                  <span>✅</span>
                  <span>Mark All Colony Drops Completed</span>
                </button>
              </div>
            </div>

            {/* View 2: Logistics / Tempo Driver Manifest */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Logistics / Tempo Driver Manifest (DBMS Project View 2)
                  </h3>
                  <p className="text-xs text-slate-500">Manifest generated for truck driver Ramesh Kumar for tomorrow morning</p>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200">
                  SQL View: View 2 Manifest
                </span>
              </div>

              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-2xl mb-4 overflow-x-auto">
                <div className="text-slate-400 mb-2">// SQL Query Implementation:</div>
                <div>SELECT batch_id AS Tempo_ID, driver_name AS Driver, truck_number AS Truck, shift AS Delivery_Shift, current_load_kg AS Total_Weight_To_Deliver_Kg FROM Delivery_Batches WHERE batch_id = 1;</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Tempo_ID</th>
                      <th className="py-2.5 px-3">Driver</th>
                      <th className="py-2.5 px-3">Truck</th>
                      <th className="py-2.5 px-3">Delivery_Shift</th>
                      <th className="py-2.5 px-3">Total_Weight_To_Deliver_Kg</th>
                      <th className="py-2.5 px-3">Society Stops</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 font-semibold text-slate-800">
                      <td className="py-3 px-3">1</td>
                      <td className="py-3 px-3">Ramesh Kumar</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">MH-02-AB-1234</td>
                      <td className="py-3 px-3">Morning</td>
                      <td className="py-3 px-3 font-bold text-slate-900">8.75 kg</td>
                      <td className="py-3 px-3">Shivam Society (4 Crates)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Society Drops Detail */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Customer Crates to Drop:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-xs">Crate #101 - Rahul Sharma</div>
                      <div className="text-[11px] text-slate-500">B-402, Shivam Society | Phone: 9998887776</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-1">Contents: Onion (3kg), Potato (2.5kg), Tomato (2kg), Palak (1kg), Coriander (0.25kg)</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">8.75 kg</span>
                      <div className="text-[10px] text-green-700 font-bold">Paid (UPI)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: ADMIN CONSOLE (FULL SYSTEM OWNER ACCESS) */}
        {/* ========================================================= */}
        {activeRole === 'admin' && (
          <div className="space-y-6">
            
            {/* Admin Header */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black px-2.5 py-1 rounded-full">
                  MASTER ADMIN CONTROL PANEL
                </span>
                <h1 className="text-2xl font-extrabold mt-2 text-white">
                  Database & Quick Commerce Operations Controller
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Full control over Produce Catalog, Vendors, Mini-Truck Batches, and direct SQLite Query Execution.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (confirm("Reset database to initial project seeds?")) {
                      await fetch('/api/reset-db', { method: 'POST' });
                      fetchProducts();
                      fetchBatches();
                      fetchOrders();
                      alert("Database reset to seeds successfully!");
                    }
                  }}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                >
                  🔄 Reset DB Seeds
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Products</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{products.length}</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">All Indian Market Items</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Active Orders</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</div>
                <div className="text-[10px] text-blue-600 font-bold mt-1">Batched for Tomorrow</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Mini-Truck Tempos</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{batches.length || 3}</div>
                <div className="text-[10px] text-amber-600 font-bold mt-1">Society Routes</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200">
                <div className="text-xs text-slate-400 font-semibold uppercase">Active Mandis & Vendors</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">4</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">Vashi, Dadar & Andheri</div>
              </div>
            </div>

            {/* Interactive SQL Query Studio (From Mini Project PDF!) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Interactive SQL Query Studio & DBMS Project Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Run raw SQL against SQLite (Database: SabziMandi_Pro). Try the preloaded queries from your DBMS script!
                  </p>
                </div>
              </div>

              {/* Preloaded Query Buttons matching the PDF */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => {
                    const q = "SELECT c.full_name AS Customer, v.vendor_name AS Sold_By, p.item_name AS Item, oi.quantity_kg AS Qty, vi.price_per_kg AS Rate_Rs, oi.subtotal AS Item_Total, o.total_amount AS Grand_Total FROM Orders o JOIN Customers c ON o.customer_id = c.customer_id JOIN Order_Items oi ON o.order_id = oi.order_id JOIN Products p ON oi.product_id = p.product_id JOIN Vendor_Inventory vi ON p.product_id = vi.product_id AND o.vendor_id = vi.vendor_id JOIN Vendors v ON o.vendor_id = v.vendor_id;";
                    setSqlQuery(q);
                    handleExecuteSql(q);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  📄 Run View 1: Customer Bill Receipt
                </button>

                <button
                  onClick={() => {
                    const q = "SELECT batch_id AS Tempo_ID, driver_name AS Driver, truck_number AS Truck, shift AS Delivery_Shift, current_load_kg AS Total_Weight_To_Deliver_Kg FROM Delivery_Batches;";
                    setSqlQuery(q);
                    handleExecuteSql(q);
                  }}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  🚚 Run View 2: Tempo Driver Manifest
                </button>

                <button
                  onClick={() => {
                    const q = "SELECT inventory_id, vendor_id, product_id, price_per_kg, stock_available_kg, last_updated FROM Vendor_Inventory WHERE vendor_id = 1 LIMIT 10;";
                    setSqlQuery(q);
                    handleExecuteSql(q);
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  📦 Check Trigger Stock Deductions
                </button>

                <button
                  onClick={() => {
                    const q = "SELECT product_id, item_name, category, hindi_name, unit FROM Products ORDER BY product_id ASC LIMIT 15;";
                    setSqlQuery(q);
                    handleExecuteSql(q);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  🥦 Select Products Master Catalog
                </button>
              </div>

              {/* SQL Input Area */}
              <div className="relative">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={4}
                  className="w-full font-mono text-xs bg-slate-900 text-emerald-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-800"
                  placeholder="Enter custom SQL query (e.g. SELECT * FROM Products WHERE category = 'Fruit';)"
                ></textarea>
                <button
                  onClick={() => handleExecuteSql()}
                  disabled={isExecutingSql}
                  className="absolute right-3 bottom-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-2"
                >
                  {isExecutingSql ? "Executing..." : "▶ Execute Query"}
                </button>
              </div>

              {/* SQL Result Table */}
              {sqlError && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-xs font-mono">
                  ❌ SQL Error: {sqlError}
                </div>
              )}

              {sqlResult && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden mt-2">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Query Result ({sqlResult.count || 0} rows)</span>
                    <span className="text-slate-400 font-mono">Execution OK</span>
                  </div>
                  {sqlResult.columns ? (
                    <div className="overflow-x-auto max-h-80">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            {sqlResult.columns.map((col, idx) => (
                              <th key={idx} className="py-2 px-3 font-semibold">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sqlResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              {row.map((val, cIdx) => (
                                <td key={cIdx} className="py-2 px-3 text-slate-800">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-xs font-semibold text-slate-700">
                      {sqlResult.message || "Query executed."}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Produce Catalog Management (CRUD) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Manage Fruit & Vegetable Catalog</h3>
                  <p className="text-xs text-slate-500">Add new items or modify names and mandi rates</p>
                </div>
                <button
                  onClick={async () => {
                    const name = prompt("Enter English produce name (e.g. Avocado, Guava, Sweet Corn):");
                    if (!name) return;
                    const hindi = prompt("Enter Hindi name (e.g. एवोकैडो, अमरूद, भुट्टा):") || "";
                    const category = prompt("Category (Vegetable or Fruit):", "Vegetable") || "Vegetable";
                    const price = prompt("Price per kg (₹):", "60") || "60";
                    
                    await fetch('/api/products', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        item_name: name,
                        hindi_name: hindi,
                        category: category,
                        price_per_kg: parseFloat(price),
                        stock_kg: 50.0
                      })
                    });
                    fetchProducts();
                    alert(`Added ${name} to Master Catalog!`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
                >
                  + Add New Produce
                </button>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3">Hindi Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price (₹/kg)</th>
                      <th className="py-2.5 px-3">Stock (kg)</th>
                      <th className="py-2.5 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.product_id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">#{p.product_id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{p.item_name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.hindi_name}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.category === 'Vegetable' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">₹{p.price_per_kg || 40}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.total_stock_kg || 50} kg</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Delete ${p.item_name}?`)) {
                                await fetch(`/api/products/${p.product_id}`, { method: 'DELETE' });
                                fetchProducts();
                              }
                            }}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded"
                          >
                            🗑
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

      </main>

      {/* 4. CART DRAWER (SLIDE-OVER) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              
              {/* Cart Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧺</span>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">Tomorrow's Colony Batch Cart</h2>
                    <p className="text-[11px] text-slate-500">{selectedSociety.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <span className="text-5xl">🛒</span>
                    <h3 className="text-sm font-bold text-slate-700">Your basket is empty</h3>
                    <p className="text-xs text-slate-400">Add fresh vegetables & fruits for tomorrow's colony tempo</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product_id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <img src={item.item.image_url} alt={item.item.item_name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-900">{item.item.item_name}</h4>
                        <div className="text-[11px] text-emerald-700 font-semibold">{item.item.hindi_name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">₹{item.item.price_per_kg || 40} / kg</div>
                      </div>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden text-xs font-bold shadow-sm">
                        <button onClick={() => removeFromCart(item.product_id)} className="px-2 py-1 text-slate-600 hover:bg-slate-100">-</button>
                        <span className="px-2 py-1 text-slate-900">{item.qty} kg</span>
                        <button onClick={() => addToCart(item.item)} className="px-2 py-1 text-slate-600 hover:bg-slate-100">+</button>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 min-w-[50px] text-right">
                        ₹{item.qty * (item.item.price_per_kg || 40)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer & Checkout */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                  
                  {/* Delivery Slot Selection */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Select Tomorrow Delivery Slot:</label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Tomorrow Morning (6:30 AM - 8:30 AM)">Tomorrow Morning (6:30 AM - 8:30 AM) [Recommended]</option>
                      <option value="Tomorrow Evening (5:00 PM - 7:30 PM)">Tomorrow Evening (5:00 PM - 7:30 PM)</option>
                    </select>
                  </div>

                  {/* Weight Summary for Batched Truck */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>🚚</span>
                      <span>Adding to Colony Mini-Truck Load:</span>
                    </span>
                    <span className="font-extrabold">{totalCartWeightKg} kg</span>
                  </div>

                  {/* Bill Breakdown */}
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Item Total:</span>
                      <span>₹{totalCartAmount}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Colony Batched Delivery Fee:</span>
                      <span>FREE (₹0)</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span>₹{totalCartAmount}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Place Batched Colony Order</span>
                    <span>➔</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Settled via Direct Mandi UPI. Free door delivery by Colony Tempo.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 5. SUCCESS NOTICE MODAL */}
      {orderNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✓
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Colony Order Placed Successfully!
            </h2>
            <p className="text-xs text-slate-600">
              Order <b>#{orderNotice.order_id}</b> has been assigned to mini-truck <b>{orderNotice.truck}</b> for <b>{orderNotice.society}</b>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Slot:</span>
                <span className="font-bold text-slate-800">{orderNotice.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mini-Truck Driver:</span>
                <span className="font-bold text-slate-800">{orderNotice.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Weight Added:</span>
                <span className="font-bold text-slate-800">{orderNotice.weight} kg</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Total Paid:</span>
                <span className="text-emerald-700">₹{orderNotice.amount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const o = orders.find(x => x.order_id === orderNotice.order_id) || {
                    order_id: orderNotice.order_id,
                    customer_name: "Rahul Sharma",
                    total_amount: orderNotice.amount,
                    society_name: orderNotice.society,
                    truck_number: orderNotice.truck,
                    driver_name: orderNotice.driver,
                    delivery_slot: orderNotice.slot,
                    order_status: "Placed",
                    items: []
                  };
                  setActiveReceiptModal(o);
                  setOrderNotice(null);
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                🧾 View Itemized Bill
              </button>
              <button
                onClick={() => setOrderNotice(null)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ITEMIZED BILL RECEIPT MODAL (DBMS VIEW 1) */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveReceiptModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {/* Thermal Receipt Header */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
              <span className="text-3xl">🥦</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Sabzi Mandi Pro Receipt</h2>
              <p className="text-[11px] text-slate-500 font-mono">DBMS PROJECT VIEW 1: CUSTOMER ITEMIZED BILL</p>
              <div className="text-xs text-slate-600 font-medium">Order #{activeReceiptModal.order_id} | {activeReceiptModal.society_name || "Shivam Society"}</div>
            </div>

            {/* Order Meta */}
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-slate-900">{activeReceiptModal.customer_name || "Rahul Sharma"}</span>
              </div>
              <div className="flex justify-between">
                <span>Sold By:</span>
                <span className="font-bold text-slate-900">{activeReceiptModal.vendor_name || "Raju Fresh Veggies"}</span>
              </div>
              <div className="flex justify-between">
                <span>Colony Mini-Truck:</span>
                <span className="font-bold text-emerald-700">{activeReceiptModal.truck_number || "MH-02-AB-1234"}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Shift:</span>
                <span className="font-bold text-slate-800">{activeReceiptModal.delivery_slot || "Morning (6:30 AM - 8:30 AM)"}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border-t border-b border-dashed border-slate-300 py-3">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-1">Item</th>
                    <th className="pb-1 text-center">Qty</th>
                    <th className="pb-1 text-right">Rate</th>
                    <th className="pb-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeReceiptModal.items || [
                    { item_name: "Onion (Pyaz / Kanda)", quantity_kg: 3.0, subtotal: 105.0 },
                    { item_name: "Potato (Aloo)", quantity_kg: 2.5, subtotal: 70.0 },
                    { item_name: "Tomato (Tamatar Hybrid)", quantity_kg: 2.0, subtotal: 80.0 },
                    { item_name: "Spinach (Palak)", quantity_kg: 1.0, subtotal: 25.0 }
                  ]).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 text-slate-800">{item.item_name}</td>
                      <td className="py-1.5 text-center text-slate-600">{item.quantity_kg}kg</td>
                      <td className="py-1.5 text-right text-slate-600">₹{(item.subtotal / item.quantity_kg).toFixed(1)}</td>
                      <td className="py-1.5 text-right font-bold text-slate-900">₹{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-extrabold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span>₹{activeReceiptModal.total_amount}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Payment Status:</span>
                <span>✓ {activeReceiptModal.payment_status || "Paid"} via UPI</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                🖨 Print Receipt
              </button>
              <button 
                onClick={() => setActiveReceiptModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. LIVE MINI-TRUCK TRACKING MODAL */}
      {activeTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-slate-200">
            <button 
              onClick={() => setActiveTrackingModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                🚚
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Mini-Truck Live Route Tracking
                </h3>
                <p className="text-xs text-slate-500">
                  Colony Batch Tempo: {activeTrackingModal.truck_number || "MH-02-AB-1234"}
                </p>
              </div>
            </div>

            {/* Driver Contact & Info */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-800">Driver: {activeTrackingModal.driver_name || "Ramesh Kumar"}</div>
                <div className="text-slate-500">Phone: {activeTrackingModal.driver_phone || "9876543210"}</div>
                <div className="text-emerald-700 font-semibold mt-0.5">Route: Andheri Mandi ➔ Shivam Society Gate</div>
              </div>
              <a 
                href={`tel:${activeTrackingModal.driver_phone || '9876543210'}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
              >
                📞 Call Driver
              </a>
            </div>

            {/* Map Simulation Graphic */}
            <div className="h-48 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center p-4 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
              
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                  <span>🚚</span>
                  <span>Mini-Truck En Route (2.4 km away)</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  Destination: {selectedSociety.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  Estimated Drop Time: Tomorrow 7:15 AM
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTrackingModal(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 8. DOST CUSTOMER ASSISTANCE CHATBOT */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-3 rounded-2xl shadow-xl shadow-emerald-600/30 font-bold text-xs transition-transform hover:scale-105 active:scale-95 group"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🤖</span>
            <span>Ask Dost</span>
            <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
          </button>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col h-[480px] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-extrabold leading-tight">Dost Assistant</h4>
                  <p className="text-[10px] text-emerald-200">Your Sabzi Mandi Mitra (24/7)</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-emerald-200 hover:text-white font-bold text-sm">✕</button>
            </div>

            {/* Quick Questions Chips */}
            <div className="p-2 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
              <button 
                onClick={() => handleSendChat("What is the cutoff time for tomorrow morning?")}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700 font-semibold"
              >
                ⏰ Cutoff Time
              </button>
              <button 
                onClick={() => handleSendChat("How does colony batch mini truck delivery work?")}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700 font-semibold"
              >
                🚚 Mini-Truck Model
              </button>
              <button 
                onClick={() => handleSendChat("Suggest a quick sabzi recipe for dinner")}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700 font-semibold"
              >
                🍲 Sabzi Recipes
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Dost about rates, tempo timings, recipes..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendChat()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <span>🥦</span>
              <span>SabziMandi Pro Quick Commerce</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              DBMS Mini Project: Batched Colony Logistics System | Group Members: Rehaan Shaikh, Anmol Shenoy, Aditya Sharma, Arnav Shinde
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>🌱 100% Mandi & Farm Fresh</span>
            <span>🚚 Zero Colony Traffic</span>
            <span>⚡ React 18 & SQLite DDL/DML</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Render the Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// TechNova — Mock Product Data
const PRODUCTS = [
  {
    id: "p001",
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Audio",
    price: 24999,
    originalPrice: 32000,
    discount: 22,
    rating: 4.8,
    reviewCount: 2341,
    stock: 14,
    isNew: false,
    isFeatured: true,
    tags: ["wireless", "noise-cancelling", "bluetooth"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.2",
      "Driver Size": "30mm",
      "Weight": "250g",
      "Microphones": "8 mics",
      "Noise Cancellation": "Industry-leading ANC"
    },
    description: "The WH-1000XM5 takes noise cancelling to the next level. With eight microphones and two processors, it delivers exceptionally clear hands-free calling and unrivaled noise cancellation in any environment.",
    reviews: [
      { user: "Rahul M.", rating: 5, comment: "Best headphones I've ever used! The ANC is incredible.", date: "2026-04-10" },
      { user: "Priya S.", rating: 5, comment: "Sound quality is phenomenal. Battery lasts forever.", date: "2026-03-22" },
      { user: "Arjun K.", rating: 4, comment: "Great headphones, build quality could be slightly better.", date: "2026-02-14" }
    ]
  },
  {
    id: "p002",
    name: "Apple MacBook Air M3",
    brand: "Apple",
    category: "Laptops",
    price: 114900,
    originalPrice: 119900,
    discount: 4,
    rating: 4.9,
    reviewCount: 4512,
    stock: 8,
    isNew: false,
    isFeatured: true,
    tags: ["laptop", "apple", "m3", "ultrabook"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871525-12c600f0a8de?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Chip": "Apple M3",
      "RAM": "8GB / 16GB / 24GB",
      "Storage": "256GB / 512GB / 1TB SSD",
      "Display": "13.6\" Liquid Retina",
      "Battery": "Up to 18 hours",
      "Weight": "1.24 kg"
    },
    description: "MacBook Air with M3 chip is thin, light, and incredibly capable. Featuring a fanless design, up to 18 hours of battery life, and a stunning Liquid Retina display.",
    reviews: [
      { user: "Sneha T.", rating: 5, comment: "Absolutely love this machine. Silent and blazing fast.", date: "2026-05-01" },
      { user: "Vikram R.", rating: 5, comment: "M3 performance is mind-blowing for everyday tasks.", date: "2026-04-18" }
    ]
  },
  {
    id: "p003",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 129999,
    originalPrice: 134999,
    discount: 4,
    rating: 4.7,
    reviewCount: 3280,
    stock: 20,
    isNew: false,
    isFeatured: true,
    tags: ["smartphone", "android", "5g", "s-pen"],
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Storage": "256GB / 512GB / 1TB",
      "Display": "6.8\" QHD+ Dynamic AMOLED",
      "Battery": "5000 mAh",
      "Camera": "200MP + 50MP + 12MP + 10MP"
    },
    description: "The Galaxy S24 Ultra is Samsung's most advanced smartphone ever, featuring a built-in S Pen, a 200MP camera system, and Galaxy AI features for unparalleled productivity.",
    reviews: [
      { user: "Aditya L.", rating: 5, comment: "S-Pen integration is amazing. Camera is unreal.", date: "2026-04-25" },
      { user: "Meera V.", rating: 4, comment: "Great phone but quite expensive.", date: "2026-03-30" }
    ]
  },
  {
    id: "p005",
    name: "Nothing Ear (2) TWS Earbuds",
    brand: "Nothing",
    category: "Audio",
    price: 8999,
    originalPrice: 9999,
    discount: 10,
    rating: 4.5,
    reviewCount: 1654,
    stock: 30,
    isNew: false,
    isFeatured: false,
    tags: ["earbuds", "wireless", "tws", "anc"],
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Driver": "11.6mm dynamic + 6mm planar",
      "ANC": "Up to 40dB",
      "Battery": "6.3hrs / 36hrs with case",
      "Connectivity": "Bluetooth 5.3",
      "Weight": "4.5g (each bud)",
      "Water Resistance": "IP54"
    },
    description: "Nothing Ear (2) delivers a Hi-Fi sound experience with its unique dual-driver setup and powerful ANC. The iconic transparent design makes them as stylish as they are capable.",
    reviews: [
      { user: "Zara N.", rating: 5, comment: "Unique design and great sound. Love them!", date: "2026-05-02" },
      { user: "Dev B.", rating: 4, comment: "ANC is solid for the price. Very stylish.", date: "2026-04-11" }
    ]
  },
  {
    id: "p006",
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    category: "Laptops",
    price: 124990,
    originalPrice: 139990,
    discount: 11,
    rating: 4.7,
    reviewCount: 876,
    stock: 3,
    isNew: true,
    isFeatured: true,
    tags: ["gaming", "laptop", "amd", "rtx4060"],
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Processor": "AMD Ryzen 9 8945HS",
      "GPU": "NVIDIA RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "Storage": "1TB NVMe SSD",
      "Display": "14\" OLED 2.8K 120Hz",
      "Battery": "Up to 10 hours"
    },
    description: "The ROG Zephyrus G14 is the ultimate compact gaming laptop. With AMD Ryzen 9 and RTX 4060, it delivers desktop-grade performance in a slim 1.65kg package.",
    reviews: [
      { user: "Rohan G.", rating: 5, comment: "Best gaming laptop under its weight class!", date: "2026-05-15" }
    ]
  },
  {
    id: "p007",
    name: "OnePlus 12 Flagship Phone",
    brand: "OnePlus",
    category: "Smartphones",
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    rating: 4.6,
    reviewCount: 2109,
    stock: 18,
    isNew: false,
    isFeatured: false,
    tags: ["smartphone", "android", "5g", "hasselblad"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB / 16GB LPDDR5X",
      "Storage": "256GB / 512GB UFS 4.0",
      "Display": "6.82\" LTPO AMOLED 4500 nits",
      "Battery": "5400 mAh + 100W SuperVOOC",
      "Camera": "50MP Hasselblad Primary"
    },
    description: "The OnePlus 12 features Hasselblad-tuned cameras, 100W SuperVOOC charging, and Snapdragon 8 Gen 3 power in a stunning marble-inspired design.",
    reviews: [
      { user: "Ankit S.", rating: 5, comment: "Fastest charging phone I've ever used.", date: "2026-03-18" }
    ]
  },
  {
    id: "p008",
    name: "Anker 65W GaN Charger Nano",
    brand: "Anker",
    category: "Accessories",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    rating: 4.7,
    reviewCount: 5421,
    stock: 100,
    isNew: false,
    isFeatured: false,
    tags: ["charger", "gan", "usb-c", "fast-charging"],
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Power Output": "65W",
      "Technology": "GaN (Gallium Nitride)",
      "Ports": "1× USB-C + 1× USB-A",
      "Compatibility": "MacBook, iPhone, Android",
      "Weight": "100g",
      "Voltage": "100-240V"
    },
    description: "The Anker Nano 65W GaN charger is 40% smaller than standard chargers but delivers the same 65W power. Charge your MacBook, iPhone, and more from a single adapter.",
    reviews: [
      { user: "Tanya R.", rating: 5, comment: "Tiny but powerful! Charges my MacBook perfectly.", date: "2026-04-30" }
    ]
  },
  {
    id: "p009",
    name: "Logitech MX Master 3S Mouse",
    brand: "Logitech",
    category: "Accessories",
    price: 9995,
    originalPrice: 11999,
    discount: 17,
    rating: 4.8,
    reviewCount: 3876,
    stock: 25,
    isNew: false,
    isFeatured: false,
    tags: ["mouse", "wireless", "ergonomic", "productivity"],
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Sensor": "Darkfield 8000 DPI",
      "Connectivity": "Bluetooth + USB receiver",
      "Battery": "70 days on full charge",
      "Buttons": "7 customizable",
      "Scroll Wheel": "MagSpeed electromagnetic",
      "Compatibility": "Windows, Mac, Linux"
    },
    description: "The MX Master 3S is the ultimate productivity mouse. With its super-fast MagSpeed scroll wheel, precise 8000 DPI sensor, and customizable buttons, it redefines what a mouse can do.",
    reviews: [
      { user: "Nisha P.", rating: 5, comment: "The scroll wheel alone is worth the price.", date: "2026-05-08" }
    ]
  },
  {
    id: "p010",
    name: "iPad Pro M4 11-inch",
    brand: "Apple",
    category: "Smartphones",
    price: 99900,
    originalPrice: 99900,
    discount: 0,
    rating: 4.9,
    reviewCount: 1234,
    stock: 12,
    isNew: true,
    isFeatured: true,
    tags: ["tablet", "apple", "m4", "oled"],
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Chip": "Apple M4",
      "Display": "11\" Ultra Retina XDR OLED",
      "RAM": "8GB / 16GB",
      "Storage": "256GB – 2TB",
      "Camera": "12MP Wide + 10MP Ultra-Wide",
      "Weight": "444g (Wi-Fi)"
    },
    description: "The iPad Pro with M4 chip features the world's most advanced mobile display — an Ultra Retina XDR OLED — making it the thinnest Apple product ever.",
    reviews: [
      { user: "Ishaan M.", rating: 5, comment: "The OLED display is breathtaking.", date: "2026-05-20" }
    ]
  },
  {
    id: "p011",
    name: "Razer BlackWidow V4 Keyboard",
    brand: "Razer",
    category: "Accessories",
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    rating: 4.5,
    reviewCount: 765,
    stock: 20,
    isNew: false,
    isFeatured: false,
    tags: ["keyboard", "mechanical", "rgb", "gaming"],
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Switch": "Razer Green Mechanical",
      "Lighting": "Razer Chroma RGB (16.8M colors)",
      "Connectivity": "USB-A",
      "Keys": "104 keys + 6 macro keys",
      "Stabilizers": "Larger key stabilizers",
      "Wrist Rest": "Detachable leatherette"
    },
    description: "The Razer BlackWidow V4 is a full-size gaming keyboard with Razer's iconic clicky Green switches, Chroma RGB lighting, and six dedicated macro keys.",
    reviews: [
      { user: "Harsh T.", rating: 4, comment: "Excellent tactile feedback. RGB is stunning.", date: "2026-04-02" }
    ]
  },
  {
    id: "p012",
    name: "JBL Flip 6 Portable Speaker",
    brand: "JBL",
    category: "Audio",
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    rating: 4.6,
    reviewCount: 4320,
    stock: 45,
    isNew: false,
    isFeatured: false,
    tags: ["speaker", "bluetooth", "portable", "waterproof"],
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Battery": "12 hours",
      "Water Resistance": "IP67 (dustproof + waterproof)",
      "Connectivity": "Bluetooth 5.1",
      "Power Output": "30W",
      "Weight": "550g",
      "Charging": "USB-C"
    },
    description: "The JBL Flip 6 delivers surprisingly powerful sound in a compact, IP67-rated design. With 12 hours of battery life and a bold design, it's the perfect outdoor companion.",
    reviews: [
      { user: "Riya S.", rating: 5, comment: "Incredible bass for such a small speaker!", date: "2026-04-12" }
    ]
  },
  {
    id: "p013",
    name: "Dell XPS 15 OLED Laptop",
    brand: "Dell",
    category: "Laptops",
    price: 159990,
    originalPrice: 169990,
    discount: 6,
    rating: 4.6,
    reviewCount: 432,
    stock: 6,
    isNew: false,
    isFeatured: false,
    tags: ["laptop", "oled", "creator", "intel"],
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Processor": "Intel Core Ultra 9 185H",
      "GPU": "NVIDIA RTX 4070 8GB",
      "RAM": "32GB LPDDR5",
      "Storage": "1TB NVMe SSD",
      "Display": "15.6\" 3.5K OLED 120Hz",
      "Battery": "86Whr"
    },
    description: "The Dell XPS 15 OLED is a creative powerhouse featuring a stunning 3.5K OLED display, Intel Core Ultra 9, and RTX 4070, all in Dell's signature precision aluminum chassis.",
    reviews: [
      { user: "Saumya C.", rating: 5, comment: "OLED display is jaw-dropping for video editing.", date: "2026-03-05" }
    ]
  },
  {
    id: "p014",
    name: "Samsung 49\" Odyssey OLED G9",
    brand: "Samsung",
    category: "Monitors",
    price: 139990,
    originalPrice: 159990,
    discount: 13,
    rating: 4.8,
    reviewCount: 312,
    stock: 2,
    isNew: true,
    isFeatured: false,
    tags: ["monitor", "ultrawide", "oled", "curved", "gaming"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Panel": "49\" Dual QHD OLED",
      "Resolution": "5120×1440",
      "Refresh Rate": "240Hz",
      "Response Time": "0.03ms",
      "Curvature": "1800R",
      "HDR": "DisplayHDR True Black 400"
    },
    description: "The Odyssey OLED G9 redefines immersion with its massive 49\" OLED panel, 240Hz refresh rate, and 1800R curvature. Experience gaming and productivity like never before.",
    reviews: [
      { user: "Jayesh K.", rating: 5, comment: "This monitor is absolutely mind-blowing.", date: "2026-05-10" }
    ]
  },
  {
    id: "p015",
    name: "Realme Buds Air 5 Pro TWS",
    brand: "Realme",
    category: "Audio",
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.3,
    reviewCount: 1876,
    stock: 60,
    isNew: false,
    isFeatured: false,
    tags: ["earbuds", "tws", "anc", "budget"],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop"
    ],
    specs: {
      "Driver": "12.4mm dynamic",
      "ANC": "Up to 50dB",
      "Battery": "9hrs / 36hrs with case",
      "Connectivity": "Bluetooth 5.3",
      "Charging": "USB-C",
      "Water Resistance": "IP55"
    },
    description: "The Realme Buds Air 5 Pro delivers audiophile-grade sound at an accessible price. With industry-leading 50dB ANC and Hi-Res Audio certification, it punches well above its weight.",
    reviews: [
      { user: "Prisha D.", rating: 4, comment: "Great value for money. ANC is surprisingly good.", date: "2026-04-22" }
    ]
  }
];

// Categories derived from products
const CATEGORIES = [
  { id: "all", name: "All Products", icon: "🛍️", count: PRODUCTS.length },
  { id: "Laptops", name: "Laptops", icon: "💻", count: PRODUCTS.filter(p => p.category === "Laptops").length },
  { id: "Smartphones", name: "Phones & Tablets", icon: "📱", count: PRODUCTS.filter(p => p.category === "Smartphones").length },
  { id: "Audio", name: "Audio", icon: "🎧", count: PRODUCTS.filter(p => p.category === "Audio").length },
  { id: "Monitors", name: "Monitors", icon: "🖥️", count: PRODUCTS.filter(p => p.category === "Monitors").length },
  { id: "Accessories", name: "Accessories", icon: "⌨️", count: PRODUCTS.filter(p => p.category === "Accessories").length }
];

const BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort();

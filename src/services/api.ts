
import { Product, Category, Banner } from '@/types';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Experience crystal-clear audio with our wireless Bluetooth headphones. Featuring 20 hours of battery life, comfortable ear cushions, and advanced noise cancellation technology. Perfect for travel, work, or relaxing at home.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    inStock: 50,
    features: [
      'Active noise cancellation',
      '20-hour battery life',
      'Comfortable over-ear design',
      'Bluetooth 5.0 connectivity',
      'Built-in microphone for calls'
    ]
  },
  {
    id: '2',
    title: 'Smart Fitness Tracker Watch',
    description: 'Monitor your health and fitness goals with our advanced smart watch. Track steps, heart rate, sleep quality, and receive notifications. Water-resistant and featuring a week-long battery life.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.2,
    reviews: 95,
    inStock: 42,
    features: [
      'Heart rate monitoring',
      'Step counter',
      'Sleep quality analysis',
      'Notification alerts',
      'Water-resistant design'
    ]
  },
  {
    id: '3',
    title: 'Ultra HD 4K Smart TV - 55"',
    description: 'Transform your home entertainment with stunning 4K resolution. This smart TV connects seamlessly with your favorite streaming services and features immersive sound technology for a theater-like experience.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.8,
    reviews: 210,
    inStock: 15,
    features: [
      '4K Ultra HD resolution',
      'Smart TV functionality',
      'Multiple streaming app support',
      'Voice control capability',
      'Slim bezel design'
    ]
  },
  {
    id: '4',
    title: 'Professional DSLR Camera',
    description: 'Capture stunning photos and videos with this professional-grade DSLR camera. Features include high resolution sensor, interchangeable lenses, 4K video recording, and intuitive controls for both beginners and professionals.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.7,
    reviews: 185,
    inStock: 8,
    features: [
      '24.1MP sensor',
      '4K video recording',
      'Interchangeable lens system',
      'Advanced autofocus',
      'Weather-sealed body'
    ]
  },
  {
    id: '5',
    title: 'Premium Coffee Maker',
    description: 'Start your day right with this programmable coffee maker. Set your brewing time, adjust strength, and enjoy fresh coffee exactly how you like it. The thermal carafe keeps your coffee hot for hours.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1570701123784-0d4d82226c3e?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Home & Kitchen',
    rating: 4.4,
    reviews: 112,
    inStock: 27,
    features: [
      'Programmable brewing',
      '12-cup capacity',
      'Thermal carafe',
      'Strength adjustment',
      'Auto-shutoff feature'
    ]
  },
  {
    id: '6',
    title: 'Ergonomic Office Chair',
    description: 'Work in comfort with this ergonomic office chair designed to support your back and promote good posture. Adjustable height, armrests, and reclining features let you customize your seating position.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Furniture',
    rating: 4.3,
    reviews: 89,
    inStock: 20,
    features: [
      'Adjustable height',
      'Lumbar support',
      'Breathable mesh back',
      'Swivel wheels',
      'Weight capacity: 275 lbs'
    ]
  },
  {
    id: '7',
    title: 'Portable Bluetooth Speaker',
    description: 'Take your music anywhere with this waterproof, portable Bluetooth speaker. Featuring 360° sound, 12 hours of playtime, and a rugged design that's perfect for outdoor adventures or pool parties.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.1,
    reviews: 76,
    inStock: 35,
    features: [
      'Waterproof design',
      '12-hour battery life',
      '360° sound projection',
      'Built-in microphone',
      'Compact and portable'
    ]
  },
  {
    id: '8',
    title: 'Non-Stick Cookware Set - 10 Piece',
    description: 'Elevate your cooking with this comprehensive non-stick cookware set. Includes pots, pans, and utensils for all your culinary needs. Durable construction ensures even heating and long-lasting performance.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Home & Kitchen',
    rating: 4.6,
    reviews: 155,
    inStock: 18,
    features: [
      '10-piece comprehensive set',
      'Non-stick coating',
      'Even heat distribution',
      'Dishwasher safe',
      'Heat-resistant handles'
    ]
  },
  {
    id: '9',
    title: 'Yoga Mat with Carrying Strap',
    description: 'Enhance your yoga practice with our eco-friendly, non-slip yoga mat. The perfect thickness for joint protection and stability, it comes with a carrying strap for easy transport to and from the studio.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1637666264336-a3a5e1bd4804?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Sports & Outdoors',
    rating: 4.4,
    reviews: 68,
    inStock: 45,
    features: [
      'Eco-friendly materials',
      'Non-slip surface',
      'Optimal 6mm thickness',
      'Includes carrying strap',
      'Easy to clean'
    ]
  },
  {
    id: '10',
    title: 'Modern Floor Lamp',
    description: 'Add stylish lighting to any room with this contemporary floor lamp. Features adjustable brightness levels, a sleek design that complements any decor, and energy-efficient LED technology.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Home & Kitchen',
    rating: 4.2,
    reviews: 42,
    inStock: 14,
    features: [
      'Adjustable brightness levels',
      'Energy-efficient LED bulbs',
      'Contemporary design',
      'Stable weighted base',
      'Easy assembly'
    ]
  },
  {
    id: '11',
    title: 'Stainless Steel Water Bottle',
    description: 'Stay hydrated in style with this vacuum-insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. Durable, leak-proof design makes it perfect for hiking, gym, or daily use.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Sports & Outdoors',
    rating: 4.5,
    reviews: 118,
    inStock: 60,
    features: [
      'Vacuum insulation technology',
      'Keeps drinks cold for 24 hours',
      'Keeps drinks hot for 12 hours',
      'BPA-free construction',
      'Leak-proof design'
    ]
  },
  {
    id: '12',
    title: 'Wireless Charging Pad',
    description: 'Eliminate cable clutter with this sleek wireless charging pad. Compatible with all Qi-enabled devices, it features fast charging technology and a non-slip surface to keep your device secure.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1583863788534-43a3bc1a41b1?q=80&w=500&h=500&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.3,
    reviews: 92,
    inStock: 33,
    features: [
      'Qi wireless charging',
      'Fast charging technology',
      'Non-slip surface',
      'LED charging indicator',
      'Compact design'
    ]
  }
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400&h=300&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=400&h=300&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&h=300&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&h=300&auto=format&fit=crop'
  }
];

const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1200&h=400&auto=format&fit=crop',
    link: '/products?sale=true'
  },
  {
    id: '2',
    title: 'New Electronics',
    subtitle: 'Check out our latest tech products',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&h=400&auto=format&fit=crop',
    link: '/products?category=electronics'
  },
  {
    id: '3',
    title: 'Home Essentials',
    subtitle: 'Transform your living space',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&h=400&auto=format&fit=crop',
    link: '/products?category=home'
  }
];

// Simulated API calls
export const fetchProducts = (filters?: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      let filtered = [...mockProducts];
      
      // Apply filters
      if (filters) {
        if (filters.category) {
          filtered = filtered.filter(
            (p) => p.category.toLowerCase() === filters.category?.toLowerCase()
          );
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (p) => 
              p.title.toLowerCase().includes(searchLower) || 
              p.description.toLowerCase().includes(searchLower) ||
              p.category.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.minPrice !== undefined) {
          filtered = filtered.filter((p) => p.price >= filters.minPrice!);
        }
        
        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
        }
        
        // Apply sorting
        if (filters.sort) {
          switch (filters.sort) {
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'rating-desc':
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            case 'name-asc':
              filtered.sort((a, b) => a.title.localeCompare(b.title));
              break;
            default:
              break;
          }
        }
      }
      
      resolve(filtered);
    }, 600);
  });
};

export const fetchProductById = (id: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === id);
      resolve(product || null);
    }, 300);
  });
};

export const fetchCategories = (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
};

export const fetchBanners = (): Promise<Banner[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBanners);
    }, 300);
  });
};

export const fetchFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a subset of products as "featured"
      const featuredIds = ['1', '3', '5', '8', '11'];
      const featured = mockProducts.filter(p => featuredIds.includes(p.id));
      resolve(featured);
    }, 300);
  });
};

export const fetchNewArrivals = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a subset of products as "new arrivals"
      const newArrivalIds = ['2', '7', '9', '12', '4'];
      const newArrivals = mockProducts.filter(p => newArrivalIds.includes(p.id));
      resolve(newArrivals);
    }, 300);
  });
};

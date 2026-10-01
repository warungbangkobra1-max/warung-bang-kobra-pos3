import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Category, Product, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-minuman', name: 'Minuman', slug: 'minuman', order: 1, isActive: true },
  { id: 'cat-makanan', name: 'Makanan', slug: 'makanan', order: 2, isActive: true },
  { id: 'cat-snack', name: 'Snack', slug: 'snack', order: 3, isActive: true },
  { id: 'cat-popice', name: 'Pop Ice', slug: 'pop-ice', order: 4, isActive: true },
  { id: 'cat-lainnya', name: 'Lainnya', slug: 'lainnya', order: 5, isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Minuman
  {
    id: 'prod-jus-mangga',
    name: 'Jus Mangga',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Kesegaran jus mangga asli pilihan, kental, manis alami tanpa pemanis buatan.',
    price: 10000,
    costPrice: 6000,
    stock: 24,
    minimumStock: 5,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 45,
    rating: 4.8,
    reviewCount: 120
  },
  {
    id: 'prod-es-alpukat',
    name: 'Es Alpukat',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Es alpukat kocok dengan susu kental manis cokelat premium & es batu serut.',
    price: 10000,
    costPrice: 6500,
    stock: 18,
    minimumStock: 5,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 38,
    rating: 4.9,
    reviewCount: 94
  },
  {
    id: 'prod-es-jambu',
    name: 'Es Jambu',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Jus jambu biji merah segar kaya vitamin C, segar dan nikmat diminum dingin.',
    price: 10000,
    costPrice: 5500,
    stock: 20,
    minimumStock: 5,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 22,
    rating: 4.7,
    reviewCount: 56
  },
  {
    id: 'prod-es-stoberi',
    name: 'Es Stoberi',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Strawberry segar asam manis dengan es kristal menyegarkan dahaga.',
    price: 10000,
    costPrice: 6000,
    stock: 15,
    minimumStock: 5,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 30,
    rating: 4.8,
    reviewCount: 78
  },
  {
    id: 'prod-es-sirsak',
    name: 'Es Sirsak',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Sari sirsak asli berpadu lembut dengan racikan gula asli khas Bang Kobra.',
    price: 10000,
    costPrice: 5500,
    stock: 12,
    minimumStock: 4,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 19,
    rating: 4.6,
    reviewCount: 42
  },
  {
    id: 'prod-lemon-peras',
    name: 'Lemon Peras',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Air perasan lemon murni segar ditambah es batu, menyegarkan hari Anda.',
    price: 10000,
    costPrice: 5000,
    stock: 25,
    minimumStock: 5,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 41,
    rating: 4.7,
    reviewCount: 88
  },
  {
    id: 'prod-es-teh-manis',
    name: 'Es Teh Manis',
    categoryId: 'cat-minuman',
    categoryName: 'Minuman',
    description: 'Teh melati wangi khas seduh kental disajikan dingin manis mantap.',
    price: 5000,
    costPrice: 2000,
    stock: 45,
    minimumStock: 10,
    unit: 'Gelas',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 140,
    rating: 4.9,
    reviewCount: 210
  },

  // Makanan
  {
    id: 'prod-mi-ayam-bawang',
    name: 'Mi Ayam Bawang',
    categoryId: 'cat-makanan',
    categoryName: 'Makanan',
    description: 'Mi kenyal gurih dengan kuah kaldu rempah, suwiran ayam gurih, dan daun bawang segar.',
    price: 7000,
    costPrice: 4000,
    stock: 35,
    minimumStock: 8,
    unit: 'Porsi',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 95,
    rating: 4.9,
    reviewCount: 165
  },
  {
    id: 'prod-ayam-katsu',
    name: 'Ayam Katsu',
    categoryId: 'cat-makanan',
    categoryName: 'Makanan',
    description: 'Fillet dada ayam renyah keemasan dibalut tepung roti renyah disajikan dengan saus katsu gurih.',
    price: 12000,
    costPrice: 7500,
    stock: 8,
    minimumStock: 10,
    unit: 'Porsi',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 62,
    rating: 4.8,
    reviewCount: 89
  },

  // Pop Ice
  {
    id: 'prod-pop-ice-cokelat',
    name: 'Pop Ice Cokelat Blender',
    categoryId: 'cat-popice',
    categoryName: 'Pop Ice',
    description: 'Pop Ice cokelat nikmat diblender halus dengan topping meses cokelat dan keju parut.',
    price: 6000,
    costPrice: 3000,
    stock: 30,
    minimumStock: 5,
    unit: 'Cup',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 52,
    rating: 4.7,
    reviewCount: 65
  },
  {
    id: 'prod-pop-ice-taro',
    name: 'Pop Ice Taro Keju',
    categoryId: 'cat-popice',
    categoryName: 'Pop Ice',
    description: 'Rasa taro manis gurih wangi dengan taburan keju gurih yang melimpah.',
    price: 7000,
    costPrice: 3500,
    stock: 22,
    minimumStock: 5,
    unit: 'Cup',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 44,
    rating: 4.8,
    reviewCount: 51
  },

  // Snack
  {
    id: 'prod-kentang-goreng',
    name: 'Kentang Goreng Krispi',
    categoryId: 'cat-snack',
    categoryName: 'Snack',
    description: 'French fries krispi gurih dengan bumbu tabur barbeque atau balado gurih.',
    price: 8000,
    costPrice: 4000,
    stock: 20,
    minimumStock: 5,
    unit: 'Porsi',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    soldCount: 39,
    rating: 4.6,
    reviewCount: 40
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'WARUNG BANG KOBRA',
  tagline: 'Enak • Cepat • Praktis',
  phoneWhatsApp: '081234567890',
  logoUrl: '',
  deliveryEnabled: true,
  deliveryArea: 'Pesantren DQM',
  deliveryFee: 2000,
  freeDeliveryThreshold: 50000,
  printerPaperWidth: '58mm'
};

export async function seedInitialFirestoreData() {
  try {
    // Check if categories already exist
    const catSnapshot = await getDocs(collection(db, 'categories'));
    if (catSnapshot.empty) {
      console.log('Seeding categories...');
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    // Check if products already exist
    const prodSnapshot = await getDocs(collection(db, 'products'));
    if (prodSnapshot.empty) {
      console.log('Seeding products...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    // Seed store settings
    const settingsDoc = doc(db, 'settings', 'store');
    await setDoc(settingsDoc, INITIAL_STORE_SETTINGS, { merge: true });
    console.log('Firestore seed verification finished.');
  } catch (error: any) {
    console.warn('Firestore seed note:', error?.message || error);
  }
}

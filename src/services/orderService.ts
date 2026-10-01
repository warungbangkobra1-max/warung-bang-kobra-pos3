import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderStatus, StockMovement } from '../types';
import { generateTransactionNumber } from '../utils/formatters';

export async function createNewOrder(orderData: Omit<Order, 'id' | 'transactionNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const transactionNumber = generateTransactionNumber();
  
  // We use atomic transaction to ensure stock consistency
  const orderRef = doc(collection(db, 'orders'));
  
  await runTransaction(db, async (transaction) => {
    // 1. Verify and decrement product stocks
    for (const item of orderData.items) {
      const prodRef = doc(db, 'products', item.productId);
      const prodSnap = await transaction.get(prodRef);
      if (prodSnap.exists()) {
        const currentStock = prodSnap.data().stock || 0;
        const newStock = Math.max(0, currentStock - item.qty);
        const soldCount = (prodSnap.data().soldCount || 0) + item.qty;
        
        transaction.update(prodRef, {
          stock: newStock,
          soldCount: soldCount,
          status: newStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE',
          updatedAt: serverTimestamp()
        });

        // Add stock movement record
        const movementRef = doc(collection(db, 'stock_movements'));
        const movementData: Omit<StockMovement, 'id'> = {
          productId: item.productId,
          productName: item.name,
          type: 'SALE',
          quantity: item.qty,
          currentStock: newStock,
          notes: `Penjualan ${transactionNumber}`,
          createdAt: serverTimestamp()
        };
        transaction.set(movementRef, movementData);
      }
    }

    // 2. Create the order record
    const finalOrder = {
      ...orderData,
      transactionNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    transaction.set(orderRef, finalOrder);
  });

  return {
    ...orderData,
    id: orderRef.id,
    transactionNumber,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, courierInfo?: { courierId: string; courierName: string }) {
  const orderRef = doc(db, 'orders', orderId);
  const updateData: any = {
    status,
    updatedAt: serverTimestamp()
  };

  if (courierInfo) {
    updateData.courierId = courierInfo.courierId;
    updateData.courierName = courierInfo.courierName;
  }

  if (status === 'SELESAI') {
    updateData.paymentStatus = 'PAID';
  }

  await updateDoc(orderRef, updateData);
}

export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  }, (error) => {
    console.error("Error subscribing to orders:", error);
  });
}

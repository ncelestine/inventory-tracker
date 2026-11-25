// src/app.ts — demo script that exercises the repositories and services

import { ProductRepository } from './services/product.repository';
import { OrderRepository } from './services/order.repository';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { ProductApiService } from './services/product-api.service';
import { OrderStatus } from './models/order-status.enum';

const productRepo = new ProductRepository();
const orderRepo = new OrderRepository();
const productSvc = new ProductService(productRepo);
const orderSvc = new OrderService(productRepo, orderRepo);
const apiSvc = new ProductApiService(productRepo);

// 1. Seed products
productRepo.add({ name: 'Laptop', price: 4500, quantity: 10, category: 'Electronics' });
productRepo.add({ name: 'Monitor', price: 1800, quantity: 3, category: 'Electronics' });
productRepo.add({ name: 'Desk', price: 2200, quantity: 5, category: 'Furniture' });
productRepo.add({ name: 'USB Cable', price: 45, quantity: 2, category: 'Accessories' });

// 2. Create and complete an order
// Prints: 'Order total: TTD 10800.00'
const order = orderSvc.createOrder([
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
]);
console.log('Order total: TTD', order.total.toFixed(2));
orderSvc.completeOrder(order.id);

// 3. Low stock check — anything with 5 or fewer units left
// Prints: 'Low stock: Monitor, Desk, USB Cable'
const lowStock = productRepo.lowStockItems;

if (lowStock.length) console.warn('Low stock:', lowStock.map((p) => p.name).join(', '));

// 4. Utility types
productRepo.updateProduct(1, { price: 4200 });
//Partial<Product>
const catalogue = productRepo.getCatalogue();
// Readonly<Product>[]
const stockMap = productRepo.getStockMap();
//Record<number, number>
const summaries = productRepo.getSummaries();
// ProductSummary[]
console.log('Laptop new price:', productRepo.findById(1)?.price);
// 4200
console.log('Stock map:', stockMap);
// { '1': 6, '2': 2, ... }

// 5. Search
// Prints: 'Electronics: Laptop, Monitor'
const found = productSvc.searchProducts('electronics');
console.log('Electronics:', found.map((p) => p.name).join(', '));

// 6. Validation — completing an order twice throws an error
try {
  orderSvc.completeOrder(order.id); // already complete
} catch (err: unknown) {
  if (err instanceof Error) console.log('Expected error:', err.message);
}

// 7. Async
// Prints: 'Async fetch: Laptop' then 'Parallel: Laptop, Monitor, Desk'
(async () => {
  try {
    const product = await apiSvc.fetchById(1);
    console.log('Async fetch:', product.name);

    const many = await apiSvc.fetchMany([1, 2, 3]);
    console.log('Parallel:', many.map((p) => p.name).join(', '));
  } catch (err: unknown) {
    if (err instanceof Error) console.error(err.message);
  }
})();

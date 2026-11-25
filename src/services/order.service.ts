// services/order.service.ts
import { ProductRepository } from './product.repository';
import { OrderRepository } from './order.repository';
import { Order, OrderItem } from '../models/order.model';
import { OrderStatus } from '../models/order-status.enum';

export class OrderService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly orderRepo: OrderRepository,
  ) {}
  /**
   * Validates all items, calculates the total, and creates a new order
   * with status PENDING and createdAt set to now.
   *
   * Throws if any item references a product that does not exist.
   * Throws if any item's quantity exceeds the product's available stock.
   */
  createOrder(items: OrderItem[]): Order {
    // validate items exist in product repo
    for (const item of items) {
      const product = this.productRepo.findById(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      // NOTE: only works if product has quantity field
      if (item.quantity > product.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    const total = this.calculateTotal(items);

    const order = this.orderRepo.add({
      items,
      total,
      status: OrderStatus.Pending,
      createdAt: new Date(),
    });

    return order;
  }
  /**
   * Returns the sum of (product.price
   * item.quantity) for all items.
   * Assumes all productIds are valid (createOrder validates them first).
   */
  calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => {
      const product = this.productRepo.findById(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      return sum + product.price * item.quantity;
    }, 0);
  }

  /**
   * Marks the order as Complete and deducts stock for every item.
   *
   * Throws if the order is not found.
   * Throws if the order status is already Complete.
   * Throws if the order status is Cancelled.
   */
  completeOrder(orderId: number): void {
    const order = this.orderRepo.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      throw new Error('Order already complete');
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new Error('Order is cancelled');
    }

    order.status = OrderStatus.Complete;

    for (const item of order.items) {
      const product = this.productRepo.findById(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      product.quantity -= item.quantity;
    }
  }
  /**
   * Marks the order as Cancelled. Stock is NOT deducted.
   *
   * Throws if the order is not found.
   * Throws if the order is already Complete.
   */
  cancelOrder(orderId: number): void {
    const order = this.orderRepo.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      throw new Error('Order already complete');
    }

    order.status = OrderStatus.Cancelled;
  }
}

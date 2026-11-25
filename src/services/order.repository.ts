// services/order.repository.ts
import { Repository } from './repository';
import { Order } from '../models/order.model';
import { OrderStatus } from '../models/order-status.enum';

export class OrderRepository extends Repository<Order> {
  private readonly MAX_ORDERS: number = 100;

  /**
   * Returns all orders that match the given OrderStatus.
   */
  getByStatus(status: OrderStatus): Order[] {
    return this.items.filter((order) => order.status === status);
  }
  /**
   * Validates an order before it is saved.
   * Throw an Error if the total order count has reached MAX_ORDERS.
   * Throw an Error if the order has no items.
   */
  protected override validateItem(order: Order): void {
    if (this.count >= this.MAX_ORDERS) {
      throw new Error(`Cannot create more than ${this.MAX_ORDERS} orders`);
    }
    if (order.items.length === 0) {
      throw new Error('An order must contain at least one item');
    }
  }
}

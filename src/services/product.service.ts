//services/product.service.ts
import { ProductRepository } from './product.repository';
import { Product } from '../models/product.model';
export class ProductService {
  constructor(private readonly repo: ProductRepository) {}
  /**
   * Adds delta to the product's quantity (delta can be negative for deductions).
   * Throws if the product is not found.
   * Throws if the resulting quantity would be below zero.
   */
  updateStock(productId: number, delta: number): void {
    const product = this.repo.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const newQty = product.quantity + delta;

    if (newQty < 0) {
      throw new Error('Insufficient stock');
    }

    product.quantity = newQty;
  }
  /**
   * Searches products by name or category (case-insensitive).
   * Delegates to the repository's searchProducts method.
   */
  searchProducts(query: string): Product[] {
    return this.repo.searchProducts(query);
  }
}

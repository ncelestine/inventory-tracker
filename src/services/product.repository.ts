// services/product.repository.ts
import { Repository } from './repository';
import { Product, ProductSummary } from '../models/product.model';
export class ProductRepository extends Repository<Product> {
  private readonly LOW_STOCK_THRESHOLD: number = 5;

  /**
   * Returns all products whose quantity is at or below LOW_STOCK_THRESHOLD.
   * Uses the Readonly<Product>[] return type from getAll().
   */
  get lowStockItems(): Product[] {
    return this.items.filter((item) => item.quantity <= this.LOW_STOCK_THRESHOLD);
  }

  /**
   * Applies a partial update to the product with the given id.
   * Throws if the product is not found.
   * Returns the updated product.
   */
  updateProduct(id: number, changes: Partial<Omit<Product, 'id'>>): Product {
    const product = this.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, changes);

    return product;
  }
  /**
           * Returns a lightweight array of { id, name, price } objects.
          * Return type is ProductSummary[] which is
           Pick<Product,'id'|'name'|'price'>. 
           */

  getSummaries(): ProductSummary[] {
    return this.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
    }));
  }

  /**
   * Returns a lookup map of { [productId]: quantity } for all products.
   * Return type is Record<number, number>.
   */

  getStockMap(): Record<number, number> {
    return Object.fromEntries(this.items.map((item) => [item.id, item.quantity]));
  }
  /**
   * Returns all products as Readonly<Product>[] so callers cannot mutate them.
   */
  getCatalogue(): Readonly<Product>[] {
    return this.getAll();
  }
  /**
   * Returns all products whose name or category contains the query string
   * (case-insensitive). Products without a category still match on name.
   */
  searchProducts(query: string): Product[] {
    const q = query.toLowerCase();

    return this.items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q),
    );
  }
  /**
   * Validates a product before it is saved.
   * Throw an Error if name is empty/whitespace.
   * Throw an Error if price is <= 0.
   */
  protected override validateItem(product: Product): void {
    if (!product.name || product.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (product.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
  }
}

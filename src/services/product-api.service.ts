// services/product-api.service.ts
import { ProductRepository } from './product.repository';
import { Product } from '../models/product.model';

export class ProductApiService {
  constructor(private readonly repo: ProductRepository) {}
  /**
   * Simulates an async HTTP GET for a single product.
   * Resolves with the product after a random 100–400ms delay.
   * Rejects with Error('Product {id} not found') if the id does not exist.
   */ fetchById(id: number): Promise<Product> {
    return new Promise((resolve, reject) => {
      const delay = Math.floor(Math.random() * 300) + 100;

      setTimeout(() => {
        const product = this.repo.findById(id);

        if (product) {
          resolve(product);
        } else {
          reject(new Error(`Product ${id} not found`));
        }
      }, delay);
    });
  }
  /**
   * Fetches multiple products in parallel.
   * Uses Promise.all so the requests run at the same time instead of one after another.
   */ async fetchMany(ids: number[]): Promise<Product[]> {
    return Promise.all(ids.map((id) => this.fetchById(id)));
  }
  /**
   * Fetches all products currently in the repository.
   * Logs the count on success.
   * On failure, logs the error message if it is an Error instance,
   * or logs 'Unknown error' otherwise.
   */
  async loadCatalogue(): Promise<void> {
    const ids = this.repo.getAll().map((p) => p.id);

    try {
      const products = await this.fetchMany(ids);
      console.log(`Loaded ${products.length} products`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Failed:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
    }
  }
}

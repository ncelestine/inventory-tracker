export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>;

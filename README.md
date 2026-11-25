# Inventory Tracker — TypeScript

A small, strongly typed inventory and order system written in **TypeScript** with strict compiler settings. It models products and orders, keeps stock levels up to date as orders are completed, flags low-stock items, and simulates calls to an async product API.

The project focuses on TypeScript's type system and object-oriented design rather than a user interface, so it runs in the terminal.

## What it does

- Add, update, search and remove products
- Create orders, calculate totals and deduct stock when an order is completed
- Block invalid actions, such as completing an order twice or creating an empty order
- List products that are running low on stock
- Fetch products through a simulated async API, either one at a time or several at once in parallel

## TypeScript concepts used

- **Generics:** a reusable `Repository<T extends { id: number }>` base class handles add, find, update, remove and count for any entity type
- **Inheritance and method overriding:** `ProductRepository` and `OrderRepository` extend the base repository and override `validateItem()` with their own business rules
- **Utility types:** `Partial`, `Omit`, `Pick`, `Readonly` and `Record` (for example, `updateProduct(id, changes: Partial<Omit<Product, 'id'>>)`)
- **Enums and interfaces** for order status, products and orders
- **Async/await and Promises:** `Promise.all` for parallel requests, with typed error handling (`catch (err: unknown)`)
- **Strict mode:** `strict`, `noImplicitAny`, `strictNullChecks` and `strictPropertyInitialization` are all enabled

## Project structure

```
src/
├── app.ts                       demo script that exercises everything
├── models/
│   ├── product.model.ts         Product interface, ProductSummary type
│   ├── order.model.ts           Order and OrderItem interfaces
│   └── order-status.enum.ts     OrderStatus enum
└── services/
    ├── repository.ts            generic base repository
    ├── product.repository.ts    low-stock check, catalogue, stock map
    ├── order.repository.ts      order validation, filter by status
    ├── product.service.ts       product search
    ├── order.service.ts         create and complete orders
    └── product-api.service.ts   simulated async API
```

## Running it

You need [Node.js](https://nodejs.org/) 20 or later.

```bash
npm install
npm start
```

Example output:

```
Order total: TTD 10800.00
Low stock: Monitor, Desk, USB Cable
Laptop new price: 4200
Stock map: { '1': 8, '2': 2, '3': 5, '4': 2 }
Electronics: Laptop, Monitor
Expected error: Order already complete
Async fetch: Laptop
Parallel: Laptop, Monitor, Desk
```

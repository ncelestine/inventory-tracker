// services/repository.ts
export class Repository<T extends { id: number }> {
  protected items: T[] = [];
  private _nextId: number = 1;

  /**
     * Assigns the next auto-incremented id to the item, calls validateItem, * pushes to items, and returns the saved item.
     
      */
  add(item: Omit<T, 'id'>): T {
    const newItem = { ...item, id: this._nextId++ } as T;

    this.validateItem(newItem);

    this.items.push(newItem);

    return newItem;
  }
  /**
   * Returns all stored items as a readonly array so callers
   * cannot mutate the internal list.
   */
  getAll(): Readonly<T>[] {
    return this.items;
  }

  /**
   * Returns the item with the matching id, or undefined if not found.
   */
  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  update(id: number, updatedItem: Partial<T>): boolean {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.items[index] = {
      ...this.items[index],
      ...updatedItem,
      id: this.items[index].id,
    };

    return true;
  }

  /**
   * Removes the item with the given id.
   * Returns true if removed, false if no item with that id existed.
   */
  remove(id: number): boolean {
    const idx = this.items.findIndex((item) => item.id === id);

    if (idx === -1) {
      return false;
    }

    this.items.splice(idx, 1);
    return true;
  }

  /** Returns the number of stored items. */
  get count(): number {
    return this.items.length;
  }

  /** * Override in subclasses to validate domain rules before add() saves an item.
   * Throw an Error with a descriptive message if the item is invalid.
   * Default implementation does nothing.
   */
  protected validateItem(item: T): void {
    // Base implementation — intentionally empty.
    // Subclasses override this method to add their own validation.
  }
}

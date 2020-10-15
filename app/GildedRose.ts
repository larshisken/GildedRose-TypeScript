import { Item, updatedItem } from './Item';

export class GildedRose {
  items: Item[];

  constructor(items: Item[] = []) {
    this.items = items;
  }

  updateQuality(): Item[] {
    this.items = this.items.map(updatedItem);

    return this.items;
  }
}

import { Item, updateItemQuality } from './Item';

export class GildedRose {
  items: Item[];

  constructor(items: Item[] = []) {
    this.items = items;
  }

  updateQuality(): Item[] {
    this.items = this.items.map(updateItemQuality);

    return this.items;
  }
}

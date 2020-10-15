import { itemConfig } from './itemConfig';

// Belongs to the goblin in the corner
export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export const createItem = ({ name, quality, sellIn }: Item): Item => {
  const minQuality = 0;

  const { maxQuality } = itemConfig[name] || {
    maxQuality: 50,
  };

  if (quality < minQuality) {
    throw new Error(`Quality should be higher than or equal to ${minQuality}`);
  }

  if (quality > maxQuality) {
    throw new Error(`Quality should be lower than or equal to ${maxQuality}`);
  }

  return new Item(name, sellIn, quality);
};

export const updateItemQuality = (item: Item): Item => {
  if (
    item.name != 'Aged Brie' &&
    item.name != 'Backstage passes to a TAFKAL80ETC concert'
  ) {
    if (item.quality > 0) {
      if (item.name != 'Sulfuras, Hand of Ragnaros') {
        item.quality = item.quality - 1;
      }
    }
  } else {
    if (item.quality < 50) {
      item.quality = item.quality + 1;
      if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
        if (item.sellIn < 11) {
          if (item.quality < 50) {
            item.quality = item.quality + 1;
          }
        }
        if (item.sellIn < 6) {
          if (item.quality < 50) {
            item.quality = item.quality + 1;
          }
        }
      }
    }
  }
  if (item.name != 'Sulfuras, Hand of Ragnaros') {
    item.sellIn = item.sellIn - 1;
  }
  if (item.sellIn < 0) {
    if (item.name != 'Aged Brie') {
      if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (item.quality > 0) {
          if (item.name != 'Sulfuras, Hand of Ragnaros') {
            item.quality = item.quality - 1;
          }
        }
      } else {
        item.quality = item.quality - item.quality;
      }
    } else {
      if (item.quality < 50) {
        item.quality = item.quality + 1;
      }
    }
  }

  return item;
};

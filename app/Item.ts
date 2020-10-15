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

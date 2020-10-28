import { DecayBracket, ITEM_CONFIG } from './itemConfig';

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

export const createItem = (
  { name, quality, sellIn }: Item,
  config = ITEM_CONFIG
): Item => {
  const minQuality = 0;

  const { maxQuality } = config[name] || {
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

export const updatedQuality = (
  quality: number,
  x: number,
  [min, max]: [number, number]
): number => {
  if (quality + x > max) {
    return max;
  }

  if (quality + x < min) {
    return min;
  }

  return quality + x;
};

export const currentDecay = (sellIn: number) => ({
  max,
  min,
}: DecayBracket): boolean =>
  (min === null || sellIn >= min) && (max === null || sellIn <= max);

export const updatedItem = (
  { name, sellIn, quality }: Item,
  config = ITEM_CONFIG
): Item => {
  const defaultDecay = -1;

  const { decay, expirationTime, maxQuality } = config[name] || {
    decay: defaultDecay,
    expirationTime: -1,
    maxQuality: 50,
  };

  const decayToday =
    typeof decay === 'number'
      ? decay
      : decay.find(currentDecay(sellIn))?.value || defaultDecay;

  const sellInFactor = sellIn < 0 ? 2 : 1;

  const qualityRange: [number, number] = [0, maxQuality];

  return {
    name,
    quality: updatedQuality(quality, decayToday * sellInFactor, qualityRange),
    sellIn: sellIn + expirationTime,
  };
};

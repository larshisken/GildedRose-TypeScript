export interface DecayBracket {
  max: number | null;
  min: number | null;
  value: number;
}

export interface ItemConfig {
  decay: number | DecayBracket[];
  expirationTime: number;
  maxQuality: number;
}

export const ITEM_CONFIG: Record<string, ItemConfig> = {
  'Conjured Mana Cake': {
    decay: -2,
    expirationTime: -1,
    maxQuality: 50,
  },
  'Sulfuras, Hand of Ragnaros': {
    decay: 0,
    expirationTime: 0,
    maxQuality: 80,
  },
  'Aged Brie': {
    decay: 1,
    expirationTime: -1,
    maxQuality: 50,
  },
  'Backstage passes to a TAFKAL80ETC concert': {
    decay: [
      {
        max: 0,
        min: null,
        value: Number.MIN_SAFE_INTEGER,
      },
      {
        max: 5,
        min: 0,
        value: 3,
      },
      {
        max: 10,
        min: 5,
        value: 2,
      },
      {
        max: null,
        min: 10,
        value: 1,
      },
    ],
    expirationTime: -1,
    maxQuality: 50,
  },
};

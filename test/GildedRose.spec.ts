import { expect } from 'chai';
import { GildedRose } from '../app/GildedRose';
import { createItem } from '../app/Item';

describe('Gilded Rose', () => {
  it('should update items accordingly', () => {
    const items = [
      createItem({
        name: '+5 Dexterity Vest',
        sellIn: 10,
        quality: 20,
      }),
      createItem({
        name: 'Aged Brie',
        sellIn: 2,
        quality: 0,
      }),
      createItem({
        name: 'Elixir of the Mongoose',
        sellIn: 5,
        quality: 7,
      }),
      createItem({
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: 3,
        quality: 80,
      }),
      createItem({
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: -1,
        quality: 80,
      }),
      createItem({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 15,
        quality: 20,
      }),
      createItem({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 10,
        quality: 49,
      }),
      createItem({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 5,
        quality: 49,
      }),
      createItem({
        name: 'Conjured Mana Cake',
        sellIn: 3,
        quality: 6,
      }),
    ];

    const expected = [
      createItem({
        name: '+5 Dexterity Vest',
        sellIn: 9,
        quality: 19,
      }),
      createItem({
        name: 'Aged Brie',
        sellIn: 1,
        quality: 1,
      }),
      createItem({
        name: 'Elixir of the Mongoose',
        sellIn: 4,
        quality: 6,
      }),
      createItem({
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: 3,
        quality: 80,
      }),
      createItem({
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: -1,
        quality: 80,
      }),
      createItem({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 14,
        quality: 21,
      }),
      createItem({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 9,
        quality: 50,
      }),
      createItem({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 4,
        quality: 50,
      }),
      createItem({
        name: 'Conjured Mana Cake',
        sellIn: 2,
        quality: 4,
      }),
    ];

    const gildedRose = new GildedRose();

    gildedRose.items = items;
    gildedRose.updateQuality();

    const actual = gildedRose.items;

    expect(actual).to.deep.equals(expected);
  });
});

import { expect } from 'chai';
import { createItem, updateItemQuality } from '../app/Item';

describe('createItem', () => {
  it('quality should never be negative', () => {
    expect(() =>
      createItem({ name: 'foo', sellIn: 0, quality: -1 })
    ).to.throw();

    expect(() =>
      createItem({ name: 'foo', sellIn: 0, quality: 0 })
    ).to.not.throw();
  });

  it('quality should be lower than or equal to 50 for normal items', () => {
    expect(() =>
      createItem({ name: 'foo', sellIn: 0, quality: 51 })
    ).to.throw();

    expect(() =>
      createItem({ name: 'foo', sellIn: 0, quality: 50 })
    ).to.not.throw();
  });

  it('quality should be lower than or equal to 80 for legendary items', () => {
    expect(() =>
      createItem({
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: 0,
        quality: 81,
      })
    ).to.throw();

    expect(() =>
      createItem({
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: 0,
        quality: 80,
      })
    ).to.not.throw();
  });
});

describe('updateItemQuality', () => {
  it('should never update legendary items', () => {
    const item = {
      name: 'Sulfuras, Hand of Ragnaros',
      sellIn: 3,
      quality: 80,
    };

    expect(updateItemQuality(item)).to.deep.equals(item);
  });

  it('should increase quality for items that mature', () => {
    expect(
      updateItemQuality({
        name: 'Aged Brie',
        sellIn: 3,
        quality: 0,
      })
    ).to.deep.equals({
      name: 'Aged Brie',
      sellIn: 2,
      quality: 1,
    });
  });

  it('should increase quality by 2 when sellIn is higher than 5 and lte 10', () => {
    expect(
      updateItemQuality({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 10,
        quality: 10,
      })
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: 9,
      quality: 12,
    });
  });

  it('should increase quality by 3 when sellIn is higher than 0 and lte 5', () => {
    expect(
      updateItemQuality({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 5,
        quality: 10,
      })
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: 4,
      quality: 13,
    });
  });

  it('should drop quality to 0 when sellIn is lte 0', () => {
    expect(
      updateItemQuality({
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn: 0,
        quality: 10,
      })
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: -1,
      quality: 0,
    });
  });

  it('should degrade quality twice as fast when sell date has passed', () => {
    expect(
      updateItemQuality({
        name: '+5 Dexterity Vest',
        sellIn: -1,
        quality: 20,
      })
    ).to.deep.equals({
      name: '+5 Dexterity Vest',
      sellIn: -2,
      quality: 18,
    });
  });

  it('should degrade quality twice as fast when an item is conjured', () => {
    expect(
      updateItemQuality({
        name: 'Conjured Mana Cake',
        sellIn: 3,
        quality: 6,
      })
    ).to.deep.equals({
      name: 'Conjured Mana Cake',
      sellIn: 2,
      quality: 4,
    });

    expect(
      updateItemQuality({
        name: 'Conjured Mana Cake',
        sellIn: -1,
        quality: 6,
      })
    ).to.deep.equals({
      name: 'Conjured Mana Cake',
      sellIn: -2,
      quality: 2,
    });
  });
});

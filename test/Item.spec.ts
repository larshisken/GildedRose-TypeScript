import { expect } from 'chai';
import { createItem, updatedItem, updatedQuality } from '../app/Item';

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

describe('updatedQuality', () => {
  it('should increase quality', () => {
    expect(updatedQuality(0, 1, [0, 50])).to.equals(1);
    expect(updatedQuality(1, 1, [0, 50])).to.equals(2);
  });

  it('should increase quality until max', () => {
    expect(updatedQuality(50, 1, [0, 50])).to.equals(50);
    expect(updatedQuality(50, 2, [0, 50])).to.equals(50);
    expect(updatedQuality(50, 3, [0, 50])).to.equals(50);
  });

  it('should decrease quality', () => {
    expect(updatedQuality(0, -1, [0, 50])).to.equals(0);
    expect(updatedQuality(1, -1, [0, 50])).to.equals(0);
  });

  it('should decrease quality until min', () => {
    expect(updatedQuality(0, -1, [0, 50])).to.equals(0);
  });
});

describe('updatedItem', () => {
  it('should never update legendary items', () => {
    const item = {
      name: 'Sulfuras, Hand of Ragnaros',
      sellIn: 3,
      quality: 80,
    };

    expect(updatedItem(item)).to.deep.equals(item);
  });

  it('should increase quality for items that mature', () => {
    expect(
      updatedItem({
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
      updatedItem({
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
      updatedItem({
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
      updatedItem({
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
      updatedItem({
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
      updatedItem({
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
      updatedItem({
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

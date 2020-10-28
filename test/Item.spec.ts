import { expect } from 'chai';
import {
  createItem,
  currentDecay,
  updatedItem,
  updatedQuality,
} from '../app/Item';

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
      createItem(
        {
          name: 'Sulfuras, Hand of Ragnaros',
          sellIn: 0,
          quality: 81,
        },
        {
          'Sulfuras, Hand of Ragnaros': {
            decay: 0,
            expirationTime: 0,
            maxQuality: 80,
          },
        }
      )
    ).to.throw();

    expect(() =>
      createItem(
        {
          name: 'Sulfuras, Hand of Ragnaros',
          sellIn: 0,
          quality: 80,
        },
        {
          'Sulfuras, Hand of Ragnaros': {
            decay: 0,
            expirationTime: 0,
            maxQuality: 80,
          },
        }
      )
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

describe('currentDecay', () => {
  it('must return a boolean value stating whether decay is current', () => {
    expect(currentDecay(1)({ value: 0, min: null, max: 10 })).to.be.true;
    expect(currentDecay(1)({ value: 0, min: 0, max: null })).to.be.true;
    expect(currentDecay(1)({ value: 0, min: 0, max: 10 })).to.be.true;

    expect(currentDecay(11)({ value: 0, min: null, max: 10 })).to.be.false;
    expect(currentDecay(-1)({ value: 0, min: 0, max: null })).to.be.false;
    expect(currentDecay(11)({ value: 0, min: 0, max: 10 })).to.be.false;
  });
});

describe('updatedItem', () => {
  it('should never update legendary items', () => {
    const item = {
      name: 'Sulfuras, Hand of Ragnaros',
      sellIn: 3,
      quality: 80,
    };

    expect(
      updatedItem(item, {
        'Sulfuras, Hand of Ragnaros': {
          decay: 0,
          expirationTime: 0,
          maxQuality: 80,
        },
      })
    ).to.deep.equals(item);
  });

  it('should increase quality for items that mature', () => {
    expect(
      updatedItem(
        {
          name: 'Aged Brie',
          sellIn: 3,
          quality: 0,
        },
        {
          'Aged Brie': {
            decay: 1,
            expirationTime: -1,
            maxQuality: 50,
          },
        }
      )
    ).to.deep.equals({
      name: 'Aged Brie',
      sellIn: 2,
      quality: 1,
    });
  });

  it('should increase quality by 2 when sellIn is higher than 5 and lte 10', () => {
    expect(
      updatedItem(
        {
          name: 'Backstage passes to a TAFKAL80ETC concert',
          sellIn: 10,
          quality: 10,
        },
        {
          'Backstage passes to a TAFKAL80ETC concert': {
            decay: [
              {
                max: 10,
                min: 5,
                value: 2,
              },
            ],
            expirationTime: -1,
            maxQuality: 50,
          },
        }
      )
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: 9,
      quality: 12,
    });
  });

  it('should increase quality by 3 when sellIn is higher than 0 and lte 5', () => {
    expect(
      updatedItem(
        {
          name: 'Backstage passes to a TAFKAL80ETC concert',
          sellIn: 5,
          quality: 10,
        },
        {
          'Backstage passes to a TAFKAL80ETC concert': {
            decay: [
              {
                max: 5,
                min: 0,
                value: 3,
              },
            ],
            expirationTime: -1,
            maxQuality: 50,
          },
        }
      )
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: 4,
      quality: 13,
    });
  });

  it('should drop quality to 0 when sellIn is lte 0', () => {
    expect(
      updatedItem(
        {
          name: 'Backstage passes to a TAFKAL80ETC concert',
          sellIn: 0,
          quality: 10,
        },
        {
          'Backstage passes to a TAFKAL80ETC concert': {
            decay: [
              {
                max: 0,
                min: null,
                value: Number.MIN_SAFE_INTEGER,
              },
            ],
            expirationTime: -1,
            maxQuality: 50,
          },
        }
      )
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: -1,
      quality: 0,
    });
  });

  it('should use the default decay of -1 when not inside a bracket', () => {
    expect(
      updatedItem(
        {
          name: 'Backstage passes to a TAFKAL80ETC concert',
          sellIn: 10,
          quality: 10,
        },
        {
          'Backstage passes to a TAFKAL80ETC concert': {
            decay: [
              {
                max: 0,
                min: 5,
                value: Number.MIN_SAFE_INTEGER,
              },
            ],
            expirationTime: -1,
            maxQuality: 50,
          },
        }
      )
    ).to.deep.equals({
      name: 'Backstage passes to a TAFKAL80ETC concert',
      sellIn: 9,
      quality: 9,
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

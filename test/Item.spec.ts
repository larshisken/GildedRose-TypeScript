import { expect } from 'chai';
import { createItem } from '../app/Item';

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

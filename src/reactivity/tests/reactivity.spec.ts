import { reactivity } from '../reactivity';

describe('reactivity', () => {
  it('happy path', () => {
    // expect()
    const foo = { foo: 1 };
    const obsverved = reactivity(foo);
    expect(foo).not.toBe(obsverved);
    expect(obsverved.foo).toBe(1);
    obsverved.foo ++;
    expect(obsverved.foo).toBe(2);
  });
});

import { isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const foo = { foo: 1 };
    const observer = reactive(foo);
    expect(foo).not.toBe(observer);
    expect(isReactive(observer)).toBeTruthy()
    expect(observer.foo).toBe(1);
    observer.foo++;
    expect(observer.foo).toBe(2);
  });
  it('嵌套的reactive', () => {
    const foo = {
      foo: 1,
      test: {
        o1: "o1"
      },
      array: [{arr: 0}]
    };
    const observer = reactive(foo);
    expect(isReactive(observer.test)).toBeTruthy();
    expect(isReactive(observer.array)).toBeTruthy();
    expect(isReactive(observer.array[0])).toBeTruthy();
  })

});

import { reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const foo = { foo: 1 };
    const observer = reactive(foo);
    expect(foo).not.toBe(observer);
    expect(observer.foo).toBe(1);
    observer.foo++;
    expect(observer.foo).toBe(2);
  });
  
});

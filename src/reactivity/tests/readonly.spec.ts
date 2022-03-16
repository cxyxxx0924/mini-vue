import { readonly, isReadonly, isReactive } from '../reactive'
describe('readonly', () => {
  it('happy path', () => {
    const foo = { foo: 1 };
    const observer = readonly(foo);
    expect(observer.foo).toBe(1);
    expect(observer).not.toBe(foo);
  });
  it('修改readonly发出警告', () => {
    const observer = readonly({ foo: 1 });
    console.warn = jest.fn();
    observer.foo++;
    expect(console.warn).toBeCalledTimes(1);
  });
  it('isReadonly and isReactive', () => {
    const foo = { foo: 1 };
    const observer = readonly(foo);
    expect(isReadonly(observer)).toBeTruthy();
    expect(isReactive(observer)).toBeFalsy();
  });
  it('isReadonly 嵌套', () => {
    const foo = {
      foo: {
        test: 1,
        test1: 2,
      }
    }
    const observer = readonly(foo);
    expect(isReadonly(observer)).toBeTruthy();
    expect(isReadonly(observer.foo)).toBeTruthy();
  })
});
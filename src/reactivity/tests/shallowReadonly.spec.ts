import { isProxy, isReactive, isReadonly, readonly, shallowReadonly } from "../reactive";

describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive ', () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReactive(props.n)).toBe(false);
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
    expect(isProxy(props)).toBeTruthy();
  });
  it('should differentiate from normal readonly calls', () => {
    const original = { foo: {} };
    const shallowProxy = shallowReadonly(original);
    const readonlyProxy = readonly(original);
    expect(shallowProxy).not.toBe(readonlyProxy);
    expect(isReadonly(shallowProxy.foo)).toBe(false);
    expect(isReadonly(readonlyProxy.foo)).toBe(true);
  });
});
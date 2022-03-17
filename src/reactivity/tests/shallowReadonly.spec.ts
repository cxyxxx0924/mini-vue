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
    const reactiveProxy = readonly(original);
    expect(shallowProxy).not.toBe(reactiveProxy);
    expect(isReadonly(shallowProxy.foo)).toBe(false);
    expect(isReadonly(reactiveProxy.foo)).toBe(true);
  });
});
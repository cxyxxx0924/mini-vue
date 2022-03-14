import { reactivity } from "../reactivity";
import { effect } from "../effect";
describe('effect', () => {
  it('直接执行一次effect的函数', () => {
    const fnSpy = jest.fn(() => { });
    effect(fnSpy);
    expect(fnSpy).toBeCalledTimes(1);
  });
  it('effect happy path', () => {
    const user = reactivity({
      age: 10
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });
  it('effect return', () => {
    let count = 10;
    const _effect = effect(() => {
      return count = count + 1;
    });
    const _count = _effect();
    expect(count).toBe(12);
    expect(_count).toBe(12);
  });
  it('scheduler', () => {
    // scheduler只有在响应式对象触发依赖的时候会被执行
    // 如果加了scheduler，那么run方法就不执行
    let dummy = 0;
    let run;
    const foo = reactivity({
      foo: 1
    })
    const scheduler = jest.fn(() => {
      run = runner
    });
    const runner = effect(() => {
      dummy = foo.foo;
    }, { scheduler });
    expect(scheduler).toBeCalledTimes(0);
    expect(dummy).toBe(1);
    foo.foo++;
    expect(scheduler).toBeCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

});
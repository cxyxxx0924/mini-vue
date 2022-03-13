import { reactivity } from "../reactivity";
import { effect } from "../effect";
describe('effect', () => {
  // it('直接执行一次effect的函数', () => {
  //   const fnSpy = jest.fn(() => { });
  //   effect(fnSpy);
  //   expect(fnSpy).toBeCalledTimes(1);
  // });
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
  })
});
import { effect } from "../effect";
import { isReactive, reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe('ref', () => {
  it('happy path', () => {
    const val = ref(1);
    expect(val.value).toBe(1);
    val.value = 2;
    expect(val.value).toBe(2);
  });

  it('ref & effect', () => {
    let dummy = 0;
    let calls = 0
    const val = ref(1);
    effect(() => {
      dummy = val.value;
      calls++;
    })
    expect(dummy).toBe(1);
    expect(calls).toBe(1);
    val.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
    val.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  });
  it('ref is Object & effect', () => {
    const val = ref({ foo: 1 });
    let dummy = 0;
    let calls = 0;
    effect(() => {
      dummy = val.value.foo;
      calls++;
    });
    expect(isReactive(val.value)).toBe(true);
    expect(dummy).toBe(1);
    expect(calls).toBe(1);
    val.value.foo++;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  });
  it("test isRef test", () => {
    const val = ref(1);
    const user = reactive({ a: 1 })
    expect(isRef(val)).toBeTruthy();
    expect(isRef(1)).toBeFalsy();
    expect(isRef(user)).toBeFalsy();
  });
  it("test unRef test", () => {
    const val = ref(1);
    expect(unRef(val)).toBe(1);
    expect(unRef(1)).toBe(1);
  });
  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: 'xiaohong'
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe('xiaohong');

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(30);
    expect(proxyUser.age).toBe(30);
    expect(user.age.value).toBe(30);
  })
});
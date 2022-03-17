import { effect } from "../effect";
import { isReactive } from "../reactive";
import { ref } from "../ref";

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
    const val = ref({foo: 1});
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
  })
});
import { computed } from "../computed";
import { reactive } from "../reactive";


describe('computed', () => {
  it('happy path', () => {
    const value = reactive({
      foo: 1
    });
    const getter = computed(() => {
      return value.foo + 1;
    });
    expect(getter.value).toBe(2);
    value.foo = 2;
    expect(getter.value).toBe(3);
  });
  it("should computed laze load", () => {
    const value = reactive({
      foo: 1
    });
    const getter = jest.fn(() => {
      return value.foo + 1;
    });
    const cValue = computed(getter);
    expect(getter).toBeCalledTimes(0);
    expect(cValue.value).toBe(2)
    expect(getter).toBeCalledTimes(1);
    cValue.value;
    expect(getter).toBeCalledTimes(1);
    value.foo = 2;
    expect(getter).toBeCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(3);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  })
});
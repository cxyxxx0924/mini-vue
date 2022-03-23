import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  name: 'Foo',
  setup () {
    return {
      count: 1
    }
  },
  render () {
    const age = 19;
    const foo = h("p", {}, "foo");
    console.log('$slots', this.$slots);
    // return h('div', {}, [foo, renderSlots(this.$slots)]);
    return h('div', {}, [
      renderSlots(this.$slots, "header", { age }), 
      foo, 
      renderSlots(this.$slots, "footer")
    ]);
  }
}
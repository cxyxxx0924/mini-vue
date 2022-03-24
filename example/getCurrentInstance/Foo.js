import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  name: 'Foo',
  setup () {
    const currentIncense = getCurrentInstance();
    console.log('foo currentIncense', currentIncense);
  },
  render () {
    return h('div', {}, "foo")
  }
}
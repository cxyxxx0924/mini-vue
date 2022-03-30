import { h, ref } from '../../lib/guide-mini-vue.esm.js'

const nextChildren = "newChildren";
const oldChildren = [h('div', {}, "A"),h('div', {}, "B")]
export default {
  name: 'ArrayToText',
  setup () {
    const isChange = ref(false);
    window.isChange = isChange;
    return {
      // demo
      isChange
    }
  },
  render () {
    const self = this;
    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, oldChildren)
  }
}
import { h, ref } from '../../lib/guide-mini-vue.esm.js'
// import { Foo } from './Foo.js';
export const App = {
  name: 'app',
  setup () {
    const count = ref(0);
    const clickBtn = () => {
      count.value++;
    }
    return {
      count,
      clickBtn
    }
  },

  render () {
    console.log("count ", this.count);
    const app = h("div", {}, "app count -> " + this.count);
    const btn = h("button", {onClick: this.clickBtn}, "add one")
    return h('div',{}, 
      [app, btn]
    )
  }
}
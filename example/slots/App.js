import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';
export const App = {
  name: 'app',
  setup () {
  },

  render () {
    const app = h("div", {}, "app")
    return h('div',
      {},
      // 'hello ' + this.name
      // [app, h(Foo, {}, h("p", {}, "123"))]
      // [app, h(Foo, {}, [h("p", {}, "123"), h("p", {}, "456")])]
      [app, h(Foo, {}, {
        header: ({ age }) => h("p", {}, "header" + age),
        footer: () => h("p", {}, "footer")
      })]
    )
  }
}
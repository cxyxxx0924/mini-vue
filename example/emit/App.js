import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';
export const App = {
  name: 'app',
  setup () {
  },

  render () {
    const app = h('p', {}, 'app.js')
    return h('div', 
      { },
      // 'hello ' + this.name
      [app, h(Foo, {
        onAdd() {
          console.log('app.js onAdd')
        },
        onSendEmit(test) {
          console.log('app.hs onSendEmit', test)
        }
      })]
    )
  }
}
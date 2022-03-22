import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';
window.self = null;
export const App = {
  name: 'app',
  setup () {
    const onAdd = () => {
      console.log('call on add');
    }
    return {
      name: 'mini-vue',
      onAdd
    }
  },

  render () {
    window.self = this;
    return h('div', 
    { 
      class: ['red', 'hard'], 
      onClick: (() => console.log('onClick!')), 
      onMousedown: (() => console.log('onMousedown!!!')),
      onAdd: (() => {
        console.log('call onAdd!')
      })
    },
    // 'hello ' + this.name
      [ h('p', {class: 'red'}, 'hi ' + this.name), h(Foo, {
        msg: "我是props",
        count: 1,
      })] 
    )
  }
}
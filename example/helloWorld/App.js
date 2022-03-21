import { h } from '../../lib/guide-mini-vue.esm.js'
window.self = null;
export const App = {
  setup () {
    return {
      name: 'mini-vue'
    }
  },

  render () {
    window.self = this;
    return h('div', { class: ['red', 'hard'] }, 'hello ' + this.name
      // [ h('p', {class: 'red'}, 'hi ' + this.name), h('p', {class: 'blue'}, 'mini-vue')] 
    )
  }
}
import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  setup () {
    return {
      name: 'hello mini-vue'
    }
  },

  render () {
    return h('div', 'hi ' + this.name)
  }
}
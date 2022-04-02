import { h, ref } from '../../lib/guide-mini-vue.esm.js'
// import { Foo } from './Foo.js';
import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'
export const App = {
  name: 'app',
  setup () {
    
    return {
    }
  },

  render () {
    return h('div', {},
      [
        h("div", {}, "主页"),
        // h(ArrayToText)
        // h(TextToText)
        // h(TextToArray)
        h(ArrayToArray)
      ]
    )
  }
}
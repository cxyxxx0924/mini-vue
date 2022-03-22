import { h } from "../../lib/guide-mini-vue.esm.js"


export const Foo = {
  name: 'foo',
  setup (props, { emit }) {
    const sendEmit = () => {
      console.log('sendEmit!');
      emit('add');
    }
    const sendEmit1 = () => {
      console.log('sendEmit!');
      emit('send-emit', 'test hahaha');
    }
    return {
      sendEmit,
      sendEmit1
    }
  },
  render () {
    const btn = h('button', {
      onClick: this.sendEmit
    }, '发送emit');
    const btn1 = h('button', {
      onClick: this.sendEmit1
    }, 'sendEmit1')
    const foo = h('p', {}, 'foo')
    return h('div', {}, [foo, btn, btn1]);
  }
}
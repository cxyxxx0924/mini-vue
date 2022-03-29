import { App } from "./App.js";
import { createRenderer } from '../../lib/guide-mini-vue.esm.js';

// console.log(PIXI);
const game = new PIXI.Application({
  width: 500,
  height: 500
});

const renderer = createRenderer({
  createElement (type) {
    debugger
    if (type === "react") {
      const react = new PIXI.Graphics()
      react.beginFill(0xff0000)
      react.drawRect(0, 0, 100, 100)
      react.endFill()

      return react
    }
  },
  patchProps (el, key, value) {
    el[key] = value
  },
  insert (parent, el) {
    parent.addChild(el);
  }
})

renderer.createApp(App).mount(game.stage)

// const appContainer = document.querySelector("#app")
// createApp(App).mount(appContainer)


import { App } from "./App.js";
import { createApp } from '../../lib/guide-mini-vue.esm.js';
const appContainer = document.querySelector("#app")
createApp(App).mount(appContainer)
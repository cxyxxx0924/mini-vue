import { handlerKey } from "../shared/index";

export const emit = (instance, event, ...args) => {
  const { props } = instance;
  
  const handlerName = props[handlerKey(event)];
  
  handlerName && handlerName(...args);
}

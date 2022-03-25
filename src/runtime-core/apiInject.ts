import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    currentInstance.provides[key] = value
  }
}

export function inject(key) {
  // 取 
  const currentInstance = getCurrentInstance();
  if (currentInstance && currentInstance.parent) {
    const value = currentInstance.parent.provides[key];
    return value;
  }
}
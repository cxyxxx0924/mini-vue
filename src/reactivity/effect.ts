import { extend } from "../shared";

let activityEffect;
let shouldTrack;

let targetMap = new Map();

class ReactivityEffect {
  private _fn: Function;
  deps: any[] = [];
  activity = true;
  onStop: Function | undefined;
  public scheduler: Function | undefined;
  constructor(fn) {
    this._fn = fn;
  }

  run() {
    if (!this.activity) return this._fn();
    shouldTrack = true;
    activityEffect = this;
    const result = this._fn();
    shouldTrack = false;

    return result;
  }

  // 移除effect
  stop() {
    if (this.activity) {
      cleanEffect(this);
      this.activity = false;
      if (this.onStop) this.onStop();
    }
  }
}

function cleanEffect(effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

export function effect(fn, option: any = {}) {
  const _effect = new ReactivityEffect(fn);
  extend(_effect, option);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

// 开启stop后会删除effect
// 但是可以运行runner
export function stop(runner) {
  // shouldTrack = false;
  runner.effect.stop();
}

// 收集依赖
// targets -> keys -> dep
// target可能会有n个key，所以把要target放到map中去。
// 每个key会对应1个dep
// dep下面会有n个effect，effect的数量取决于用户创建的数量
// 但是每次执行get的时候都会执行dep.add，会有重复的effect被加入进来，所以用set数组
export function track(target, key) {

  if (!isTracking()) return

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffect(dep)
}

export function trackEffect(dep) {
  if (dep.has(activityEffect)) return;
  dep.add(activityEffect);
  activityEffect.deps.push(dep);
}

export function isTracking() {
  // if (!shouldTrack) return;
  // if (!activityEffect) return;
  return shouldTrack && activityEffect !== undefined
}

// 触发依赖
// 主要触发effect中的run方法，去触发effect
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  triggerEffect(dep);
}

export function triggerEffect(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
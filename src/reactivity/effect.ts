class ReactivityEffect {
  private _fn: Function;
  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activityEffect = this;
    return this._fn();
  }
}

let activityEffect;
export function effect(fn, option: any = {}) {
  const _effect = new ReactivityEffect(fn, option?.scheduler);
  _effect.run();
  return _effect.run.bind(_effect);
}

// 收集依赖
// targets -> keys -> dep
// target可能会有n个key，所以把要target放到map中去。
// 每个key会对应1个dep
// dep下面会有n个effect，effect的数量取决于用户创建的数量
// 但是每次执行get的时候都会执行dep.add，会有重复的effect被加入进来，所以用set数组
let targetMap = new Map();
export function track(target, key) {
  // const dep = depsMap.get(key);
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
  dep.add(activityEffect);
}

// 触发依赖
// 主要触发effect中的run方法，去触发effect
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);
  for (const effect of dep) {
    if(!effect) {
      return;
    }
    // const {scheduler} = effect.scheduler()
    if(effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
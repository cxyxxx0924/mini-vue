import { hasChange, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private dep;
  private _rawValue: any;
  public isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = isObject(value) ? reactive(value) : value;
    // this._value = ;
    this.dep = new Set();
  }

  get value() {
    if (!isTracking()) return this._value;
    trackEffect(this.dep)

    return this._value;
  }

  set value(val) {
    if (hasChange(this._rawValue, val)) {
      this._value = isObject(val) ? reactive(val) : val;
      this._rawValue = val;
      triggerEffect(this.dep);
    }
  }
}

export function ref(value) {
  const ref = new RefImpl(value);
  return ref;
}

export function isRef(val) {
  return !!val.isRef;
}

export function unRef(val) {
  return isRef(val) ? val.value : val;
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key) {
      const ret = Reflect.get(target, key);
      return unRef(ret);
    },
    set(target, key, value) {
      if(!isRef(value) && isRef(target[key])) {
        return (target[key].value = value);
      } else {
        return (target[key] = value);
      }
    }
  })
}

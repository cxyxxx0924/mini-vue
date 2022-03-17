import { hasChange, isObject } from "../shared";
import { proxyRefsHandlers } from "./baseHandler";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private dep;
  private _rawValue: any;
  public isRef = true;

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    if (!isTracking()) return this._value;
    trackEffect(this.dep)
    return this._value;
  }

  set value(val) {
    if (hasChange(this._rawValue, val)) {
      this._value = convert(val);
      this._rawValue = val;
      triggerEffect(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
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
  return new Proxy(target, proxyRefsHandlers)
}

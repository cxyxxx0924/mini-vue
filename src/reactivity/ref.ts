import { hasChange, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private dep;
  private _rawValue: any;

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
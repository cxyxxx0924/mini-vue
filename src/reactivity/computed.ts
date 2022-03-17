import { ReactivityEffect } from "./effect";

class ComputerRefsImpl {
  private _getter: any;
  private _dirty = true;
  private _effect;
  private _value;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactivityEffect(getter, () => {
      if(!this._dirty) this._dirty = true;
    })
  }

  get value() {
    if(this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputerRefsImpl(getter)
}
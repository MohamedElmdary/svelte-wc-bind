export type Listener<T> = (value: T) => void;
export type Unsubscribe = () => void;
export type Transformer<T> = (e: any) => T;

export class BindValue<T> {
  private __value: T;
  private __listeners: Set<Listener<T>>;
  private __destroied: boolean;
  private __transform: Transformer<T>;

  public get value(): T {
    return this.__value;
  }

  public set value(value: T) {
    this.__value = this.__transform(value);
    this.notifyListener();
  }

  constructor(value: T, transform?: Transformer<T>) {
    this.__value = value;
    this.__listeners = new Set<Listener<T>>();
    this.__destroied = false;
    this.__transform = transform || ((e) => e);
  }

  public subscribe(listener: Listener<T>): Unsubscribe {
    if (!this.__destroied) {
      this.__listeners.add(listener);
      listener(this.value);
    }

    return () => {
      this.__listeners.delete(listener);
    };
  }

  public notifyListener() {
    for (const listener of this.__listeners) {
      listener(this.value);
    }
  }

  public destroy(): void {
    this.__listeners.clear();
    this.__destroied = true;
  }
}

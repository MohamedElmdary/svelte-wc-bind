import type { BindValue, Unsubscribe } from "./bind_value";

export interface BindOptions<T> {
  [key: `${string}` | `${string}:${string}`]: BindValue<T>;
}

export function bind<T>(node: HTMLElement, options: BindOptions<T>) {
  const listeners: Unsubscribe[] = [];

  for (const key in options) {
    const bindValue = options[key];
    const [attr, name = "bind"] = key.split(":") as [string, any];

    let locked = false;

    const onBind = (e: any) => {
      locked = true;
      bindValue.value = e.detail;
      locked = false;
    };

    node.setAttribute(attr, bindValue.value as any);
    node.addEventListener(name, onBind);

    const unsubscribe = bindValue.subscribe((value) => {
      console.log({ locked, value });
      if (locked) return;

      node.setAttribute(attr, value as any);
    });

    listeners.push(() => {
      unsubscribe();
      node.removeEventListener(name, onBind);
      bindValue.destroy();
    });
  }

  return {
    destroy() {
      listeners.forEach((fn) => fn());
    },
  };
}

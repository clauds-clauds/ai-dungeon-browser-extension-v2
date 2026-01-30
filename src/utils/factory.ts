import { writable } from "svelte/store";

class LEFactory {
  produceSettings<T>(key: string, defaults: T) {
    const { subscribe, set, update } = writable<T>(defaults);

    chrome.storage.local.get([key]).then((res) => {
      if (res[key]) {
        set({ ...defaults, ...res[key] });
      }
    });

    subscribe((val) => {
      chrome.storage.local.set({ [key]: JSON.parse(JSON.stringify(val)) });
    });

    return { subscribe, set, update };
  }

  produceCollection<T>(key: string) {
    const { subscribe, set, update } = writable<Record<string, T>>({});

    chrome.storage.local.get([key]).then((res) => {
      if (res[key]) set(res[key] as Record<string, T>);
    });

    subscribe((val) => {
      if (Object.keys(val).length > 0) {
        chrome.storage.local.set({ [key]: JSON.parse(JSON.stringify(val)) });
      }
    });

    return {
      subscribe,
      set,
      update,
      put: (id: string, item: T) => update((s) => ({ ...s, [id]: item })),
      remove: (id: string) =>
        update((s) => {
          const { [id]: _, ...rest } = s;
          return rest;
        }),
      patch: (id: string, data: Partial<T>) =>
        update((s) => {
          if (!s[id]) return s;
          return { ...s, [id]: { ...s[id], ...data } };
        }),
    };
  }
}

export const factory = new LEFactory();

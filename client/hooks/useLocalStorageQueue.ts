import { useEffect, useState } from "react";
import { IOptions } from "../pagination/IPagerParams";

export function useLocalStorageQueue(key: string, maxItems: number) {
  const [items, setItems] = useState<IOptions[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (e) {
          console.warn("Failed to parse localStorage item", e);
        }
      }
    }
  }, [key]);

  const save = (newItems: IOptions[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(newItems));
    }
  };

  const addSearch = (item: IOptions) => {
    const filtered = items.filter((i) => i.value !== item.value);
    const newItems = [item, ...filtered].slice(0, maxItems);
    save(newItems);
  };

  const removeItem = (item: IOptions) => {
    const newItems = items.filter((i) => i.value !== item.value);
    save(newItems);
  };

  return [items, addSearch, removeItem] as const;
}
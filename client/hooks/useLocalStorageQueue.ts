import { useState, useCallback } from "react";


// TODO!!!!!!!!!!
export interface IQueueItem {
  label: string;
  value: string;
  [key: string]: any;
}

export function useLocalStorageQueue(key: string, maxLength: number = 5): [
  IQueueItem[],
  (item: IQueueItem) => void,
  (item: IQueueItem) => void
] {
  const getQueue = (): IQueueItem[] => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [queue, setQueue] = useState<IQueueItem[]>(getQueue());

  const saveQueue = (newQueue: IQueueItem[]) => {
    setQueue(newQueue);
    localStorage.setItem(key, JSON.stringify(newQueue));
  };

  const addItem = useCallback(
    (item: IQueueItem) => {
      let newQueue = queue.filter((q) => q.value !== item.value);
      newQueue.unshift(item);
      if (newQueue.length > maxLength) newQueue = newQueue.slice(0, maxLength);
      saveQueue(newQueue);
    },
    [queue, maxLength, key]
  );

  const removeItem = useCallback(
    (item: IQueueItem) => {
      const newQueue = queue.filter((q) => q.value !== item.value);
      saveQueue(newQueue);
    },
    [queue, key]
  );

  return [queue, addItem, removeItem];
}
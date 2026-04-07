import { useState, useCallback } from 'react';

export class BaseViewModel {
  constructor() {
    this.listeners = new Set();
    this.state = {};
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  dispose() {
    this.listeners.clear();
  }
}

export function useViewModel(ViewModelClass, ...args) {
  const [vm] = useState(() => new ViewModelClass(...args));
  const [state, setState] = useState(vm.state);

  useState(() => {
    const unsubscribe = vm.subscribe(setState);
    return unsubscribe;
  });

  const dispose = useCallback(() => {
    vm.dispose();
  }, [vm]);

  useState(() => {
    return dispose;
  });

  return { vm, state };
}

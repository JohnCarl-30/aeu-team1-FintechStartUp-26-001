import { useState, useEffect, useCallback } from 'react';

export function useViewModel(VMClass, ...args) {
  const [vm] = useState(() => new VMClass(...args));
  const [, setState] = useState(() => vm.getState());

  useEffect(() => {
    const unsubscribe = vm.subscribe(() => {
      setState(vm.getState());
    });
    return () => {
      unsubscribe();
      vm.dispose();
    };
  }, [vm]);

  return vm;
}

import { useEffect, useState } from 'react'

export function useViewModel(VMClass, ...args) {
  const [vm] = useState(() => new VMClass(...args))
  const [state, setState] = useState(() => vm.getState())

  useEffect(() => {
    const unsubscribe = vm.subscribe(setState)

    return () => {
      unsubscribe()
      vm.dispose()
    }
  }, [vm])

  return { vm, state }
}

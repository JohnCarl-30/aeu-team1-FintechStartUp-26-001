import { useState, useRef, useEffect } from 'react'

export function useAnimatedNumber(target) {
  const [value, setValue] = useState(target)
  const previousValueRef = useRef(target)

  useEffect(() => {
    const start = previousValueRef.current
    const end = target

    if (start === end) {
      previousValueRef.current = end
      return
    }

    let frameId = 0
    let startTime = null
    const duration = 240

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp
      }

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = Math.round(start + (end - start) * eased)

      setValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      } else {
        previousValueRef.current = end
        setValue(end)
      }
    }

    frameId = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frameId)
  }, [target])

  return value
}

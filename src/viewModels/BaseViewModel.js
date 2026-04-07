export class BaseViewModel {
  constructor(initialState = {}) {
    this.listeners = new Set()
    this.state = initialState
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState() {
    return { ...this.state }
  }

  notify() {
    const snapshot = this.getState()
    this.listeners.forEach((listener) => listener(snapshot))
  }

  setState(updates) {
    const nextState = typeof updates === 'function' ? updates(this.state) : updates

    this.state = { ...this.state, ...nextState }
    this.notify()
    return this.getState()
  }

  dispose() {
    this.listeners.clear()
  }
}

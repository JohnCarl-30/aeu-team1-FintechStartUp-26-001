import { BaseModel } from './BaseModel'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export class User extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.id = data.id ?? null
    this.email = data.email ?? ''
    this.name = data.name ?? ''
    this.balance = Number(data.balance ?? 0)
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
  }

  get displayName() {
    return this.name.trim() || this.email || 'Guest'
  }

  get initials() {
    const parts = this.displayName.split(/\s+/).filter(Boolean).slice(0, 2)

    return parts.map((part) => part.charAt(0).toUpperCase()).join('') || 'GU'
  }

  formatBalance() {
    return currencyFormatter.format(this.balance)
  }
}

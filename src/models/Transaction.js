import { BaseModel } from './BaseModel'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const debitTypes = new Set(['withdrawal', 'transfer', 'payment'])

export class Transaction extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.id = data.id ?? null
    this.userId = data.userId ?? null
    this.type = data.type ?? 'deposit'
    this.amount = Math.abs(Number(data.amount ?? 0))
    this.status = data.status ?? 'pending'
    this.description = data.description ?? ''
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
  }

  static TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    TRANSFER: 'transfer',
    PAYMENT: 'payment',
  }

  static STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  }

  static isDebitType(type) {
    return debitTypes.has(type)
  }

  get isCompleted() {
    return this.status === Transaction.STATUS.COMPLETED
  }

  get isPending() {
    return this.status === Transaction.STATUS.PENDING
  }

  get isDebit() {
    return Transaction.isDebitType(this.type)
  }

  get signedAmount() {
    return this.isDebit ? -this.amount : this.amount
  }

  get typeLabel() {
    return `${this.type.charAt(0).toUpperCase()}${this.type.slice(1)}`
  }

  get statusLabel() {
    return `${this.status.charAt(0).toUpperCase()}${this.status.slice(1)}`
  }

  formatAmount(options = {}) {
    const { withSign = true } = options
    const value = withSign ? this.signedAmount : this.amount

    return currencyFormatter.format(value)
  }

  formatDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  formatDateTime() {
    return this.createdAt.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }
}

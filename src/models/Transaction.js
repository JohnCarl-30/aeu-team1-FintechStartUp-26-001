import { BaseModel } from './BaseModel';

export class Transaction extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.type = data.type || 'deposit';
    this.amount = data.amount || 0;
    this.status = data.status || 'pending';
    this.description = data.description || '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  static TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    TRANSFER: 'transfer',
    PAYMENT: 'payment',
  };

  static STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  };

  get isCompleted() {
    return this.status === Transaction.STATUS.COMPLETED;
  }

  get isPending() {
    return this.status === Transaction.STATUS.PENDING;
  }

  formatAmount() {
    const amount = this.type === Transaction.TYPES.WITHDRAWAL ? -this.amount : this.amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

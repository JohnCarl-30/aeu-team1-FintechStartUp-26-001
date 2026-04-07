import { BaseModel } from './BaseModel';

export class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.balance = data.balance || 0;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  get displayName() {
    return this.name || this.email;
  }

  formatBalance() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.balance);
  }
}

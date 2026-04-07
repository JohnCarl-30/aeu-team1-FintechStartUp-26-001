import { BaseViewModel } from './BaseViewModel';
import { Transaction } from '../models/Transaction';

export class TransactionViewModel extends BaseViewModel {
  constructor() {
    super();
    this.state = {
      transactions: [],
      loading: false,
      error: null,
      filter: 'all',
      sortBy: 'date',
    };
  }

  get transactions() {
    return this.filteredAndSortedTransactions;
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  get filter() {
    return this.state.filter;
  }

  get totalDeposits() {
    return this.state.transactions
      .filter(t => t.type === Transaction.TYPES.DEPOSIT && t.isCompleted)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalWithdrawals() {
    return this.state.transactions
      .filter(t => t.type === Transaction.TYPES.WITHDRAWAL && t.isCompleted)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get filteredAndSortedTransactions() {
    let result = [...this.state.transactions];

    if (this.state.filter !== 'all') {
      result = result.filter(t => t.type === this.state.filter);
    }

    result.sort((a, b) => {
      if (this.state.sortBy === 'date') {
        return b.createdAt - a.createdAt;
      }
      if (this.state.sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

    return result;
  }

  setFilter(filter) {
    this.setState({ filter });
  }

  setSortBy(sortBy) {
    this.setState({ sortBy });
  }

  async fetchTransactions(userId) {
    this.setState({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const mockData = [
        { id: 1, userId, type: 'deposit', amount: 5000, status: 'completed', description: 'Initial deposit', createdAt: new Date('2024-01-15') },
        { id: 2, userId, type: 'withdrawal', amount: 200, status: 'completed', description: 'ATM withdrawal', createdAt: new Date('2024-01-20') },
        { id: 3, userId, type: 'payment', amount: 50, status: 'completed', description: 'Online purchase', createdAt: new Date('2024-02-01') },
        { id: 4, userId, type: 'transfer', amount: 1000, status: 'pending', description: 'Transfer to savings', createdAt: new Date('2024-02-10') },
      ];
      const transactions = Transaction.fromJSONArray(mockData);
      this.setState({ transactions, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  async createTransaction(transactionData) {
    this.setState({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const newTransaction = Transaction.fromJSON({
        id: Date.now(),
        ...transactionData,
        status: Transaction.STATUS.PENDING,
        createdAt: new Date(),
      });
      const transactions = [...this.state.transactions, newTransaction];
      this.setState({ transactions, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }
}

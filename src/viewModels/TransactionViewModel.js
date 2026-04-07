import { BaseViewModel } from './BaseViewModel'
import { Transaction } from '../models/Transaction'
import {
  createTransaction as createTransactionRecord,
  fetchTransactions as fetchTransactionRecords,
} from '../services/fintechService'

const INITIAL_STATE = {
  transactions: [],
  loading: false,
  error: null,
  filter: 'all',
  sortBy: 'date',
}

export class TransactionViewModel extends BaseViewModel {
  constructor() {
    super({ ...INITIAL_STATE })
  }

  get transactions() {
    return this.filteredAndSortedTransactions
  }

  get loading() {
    return this.state.loading
  }

  get error() {
    return this.state.error
  }

  get filter() {
    return this.state.filter
  }

  get totalDeposits() {
    return this.state.transactions
      .filter(
        (transaction) =>
          transaction.type === Transaction.TYPES.DEPOSIT && transaction.isCompleted,
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  get totalOutflows() {
    return this.state.transactions
      .filter((transaction) => transaction.isCompleted && transaction.isDebit)
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  get pendingTransactionsCount() {
    return this.state.transactions.filter((transaction) => transaction.isPending).length
  }

  get completedTransactionsCount() {
    return this.state.transactions.filter((transaction) => transaction.isCompleted).length
  }

  get filteredAndSortedTransactions() {
    let result = [...this.state.transactions]

    if (this.state.filter !== 'all') {
      result = result.filter((transaction) => transaction.type === this.state.filter)
    }

    result.sort((a, b) => {
      if (this.state.sortBy === 'date') {
        return b.createdAt - a.createdAt
      }

      if (this.state.sortBy === 'amount') {
        return Math.abs(b.signedAmount) - Math.abs(a.signedAmount)
      }

      if (this.state.sortBy === 'type') {
        return a.type.localeCompare(b.type)
      }

      return 0
    })

    return result
  }

  setFilter(filter) {
    this.setState({ filter })
  }

  setSortBy(sortBy) {
    this.setState({ sortBy })
  }

  clearTransactions() {
    this.setState({ ...INITIAL_STATE })
  }

  async fetchTransactions(userId) {
    this.setState({ loading: true, error: null })

    try {
      const records = await fetchTransactionRecords(userId)
      const transactions = Transaction.fromJSONArray(records)
      this.setState({ transactions, loading: false })
      return transactions
    } catch (error) {
      this.setState({
        error:
          error instanceof Error
            ? error.message
            : 'We could not load the activity feed.',
        loading: false,
      })
      return []
    }
  }

  async createTransaction(transactionData) {
    this.setState({ loading: true, error: null })

    try {
      const payload = await createTransactionRecord(transactionData)
      const newTransaction = Transaction.fromJSON(payload.transaction)
      const transactions = [newTransaction, ...this.state.transactions]
      this.setState({ transactions, loading: false })

      return {
        transaction: newTransaction,
        user: payload.user,
      }
    } catch (error) {
      this.setState({
        error:
          error instanceof Error
            ? error.message
            : 'We could not create the transaction.',
        loading: false,
      })
      return null
    }
  }
}

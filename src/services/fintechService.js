import { Transaction } from '../models/Transaction'

const BASE_USER = {
  id: 'usr-demo',
  email: 'ava@northstar.bank',
  name: 'Ava Rey',
  balance: 48250.31,
  createdAt: '2025-09-14T09:00:00.000Z',
}

const defaultDescriptions = {
  deposit: 'Capital injection',
  withdrawal: 'Operating cash pull',
  transfer: 'Treasury rebalance',
  payment: 'Vendor payout',
}

let userStore = { ...BASE_USER }
let transactionSequence = 6
let transactionStore = [
  {
    id: 'txn-001',
    userId: BASE_USER.id,
    type: Transaction.TYPES.DEPOSIT,
    amount: 25000,
    status: Transaction.STATUS.COMPLETED,
    description: 'Seed round deposit',
    createdAt: '2026-03-17T10:15:00.000Z',
  },
  {
    id: 'txn-002',
    userId: BASE_USER.id,
    type: Transaction.TYPES.PAYMENT,
    amount: 1290,
    status: Transaction.STATUS.COMPLETED,
    description: 'Cloud hosting bill',
    createdAt: '2026-03-22T07:30:00.000Z',
  },
  {
    id: 'txn-003',
    userId: BASE_USER.id,
    type: Transaction.TYPES.TRANSFER,
    amount: 8000,
    status: Transaction.STATUS.PENDING,
    description: 'Move to reserve account',
    createdAt: '2026-03-24T15:00:00.000Z',
  },
  {
    id: 'txn-004',
    userId: BASE_USER.id,
    type: Transaction.TYPES.DEPOSIT,
    amount: 7200,
    status: Transaction.STATUS.COMPLETED,
    description: 'Marketplace revenue sweep',
    createdAt: '2026-03-29T13:45:00.000Z',
  },
  {
    id: 'txn-005',
    userId: BASE_USER.id,
    type: Transaction.TYPES.WITHDRAWAL,
    amount: 980,
    status: Transaction.STATUS.COMPLETED,
    description: 'ATM founder reimbursement',
    createdAt: '2026-04-01T11:20:00.000Z',
  },
]

function wait(ms = 280) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function formatNameFromEmail(email) {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function getSignedAmount(transaction) {
  const amount = Math.abs(Number(transaction.amount ?? 0))
  return Transaction.isDebitType(transaction.type) ? -amount : amount
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function nextTransactionId() {
  const id = `txn-${String(transactionSequence).padStart(3, '0')}`
  transactionSequence += 1
  return id
}

export async function loginUser(email, password) {
  await wait()

  if (!email || !email.includes('@')) {
    throw new Error('Enter a valid email address to open the demo account.')
  }

  if (!password) {
    throw new Error('A password is required, even for the demo account.')
  }

  userStore = {
    ...userStore,
    email,
    name: formatNameFromEmail(email) || userStore.name,
  }

  return clone(userStore)
}

export async function logoutUser() {
  await wait(160)
  return true
}

export async function updateUserProfile(userId, updates) {
  await wait(200)

  if (!userId || userStore.id !== userId) {
    throw new Error('We could not find the active user session.')
  }

  userStore = {
    ...userStore,
    ...updates,
    name: updates.name?.trim() || userStore.name,
  }

  return clone(userStore)
}

export async function fetchTransactions(userId) {
  await wait(260)

  if (!userId) {
    throw new Error('A user id is required to load transactions.')
  }

  return clone(
    transactionStore
      .filter((transaction) => transaction.userId === userId)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
  )
}

export async function createTransaction(transactionData) {
  await wait(220)

  const amount = Math.abs(Number(transactionData.amount ?? 0))

  if (!transactionData.userId) {
    throw new Error('A user id is required to create a transaction.')
  }

  if (!amount) {
    throw new Error('Add an amount greater than zero.')
  }

  const transaction = {
    id: nextTransactionId(),
    userId: transactionData.userId,
    type: transactionData.type ?? Transaction.TYPES.DEPOSIT,
    amount,
    status: transactionData.status ?? Transaction.STATUS.COMPLETED,
    description:
      transactionData.description?.trim() ||
      defaultDescriptions[transactionData.type] ||
      'Ledger update',
    createdAt: new Date().toISOString(),
  }

  transactionStore = [transaction, ...transactionStore]

  if (transaction.status === Transaction.STATUS.COMPLETED) {
    userStore = {
      ...userStore,
      balance: Number((userStore.balance + getSignedAmount(transaction)).toFixed(2)),
    }
  }

  return {
    transaction: clone(transaction),
    user: clone(userStore),
  }
}

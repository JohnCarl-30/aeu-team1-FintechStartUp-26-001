import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Transaction } from './models'
import {
  TransactionViewModel,
  UserViewModel,
  useViewModel,
} from './viewModels'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const filterOptions = [
  { value: 'all', label: 'All flows' },
  { value: Transaction.TYPES.DEPOSIT, label: 'Deposits' },
  { value: Transaction.TYPES.WITHDRAWAL, label: 'Withdrawals' },
  { value: Transaction.TYPES.TRANSFER, label: 'Transfers' },
  { value: Transaction.TYPES.PAYMENT, label: 'Payments' },
]

const sortOptions = [
  { value: 'date', label: 'Newest first' },
  { value: 'amount', label: 'Largest amount' },
  { value: 'type', label: 'Type' },
]

const transactionTypeOptions = [
  { value: Transaction.TYPES.DEPOSIT, label: 'Deposit' },
  { value: Transaction.TYPES.WITHDRAWAL, label: 'Withdrawal' },
  { value: Transaction.TYPES.TRANSFER, label: 'Transfer' },
  { value: Transaction.TYPES.PAYMENT, label: 'Payment' },
]

function formatCurrency(value) {
  return currencyFormatter.format(value)
}

function MetricCard({ label, value, hint }) {
  return (
    <article className="panel metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-hint">{hint}</p>
    </article>
  )
}

function TransactionRow({ transaction }) {
  return (
    <article className="transaction-row">
      <div className="row-meta">
        <div className="row-icon">{transaction.typeLabel.slice(0, 2)}</div>
        <div>
          <p className="row-title">{transaction.description || transaction.typeLabel}</p>
          <p className="row-detail">
            {transaction.typeLabel} - {transaction.formatDateTime()}
          </p>
        </div>
      </div>
      <p className={`amount ${transaction.isDebit ? 'debit' : 'credit'}`}>
        {transaction.formatAmount()}
      </p>
      <span className={`status-pill ${transaction.status}`}>
        {transaction.statusLabel}
      </span>
    </article>
  )
}

function App() {
  const { vm: userVM, state: userState } = useViewModel(UserViewModel)
  const { vm: transactionVM, state: transactionState } =
    useViewModel(TransactionViewModel)

  const [loginForm, setLoginForm] = useState({
    email: 'ava@northstar.bank',
    password: 'demo-password',
  })
  const [profileName, setProfileName] = useState('')
  const [transactionForm, setTransactionForm] = useState({
    type: Transaction.TYPES.DEPOSIT,
    amount: '1250',
    description: 'Angel round top-up',
  })

  useEffect(() => {
    const userId = userState.user?.id

    if (userId) {
      transactionVM.fetchTransactions(userId)
      return
    }

    transactionVM.clearTransactions()
  }, [transactionVM, userState.user?.id])

  const metrics = useMemo(
    () => [
      {
        label: 'Available balance',
        value: userState.user ? userVM.formattedBalance : '$0.00',
        hint: 'Live balance stays synced after every completed movement.',
      },
      {
        label: 'Cash in',
        value: formatCurrency(transactionVM.totalDeposits),
        hint: `${transactionVM.completedTransactionsCount} completed movements tracked.`,
      },
      {
        label: 'Cash out',
        value: formatCurrency(transactionVM.totalOutflows),
        hint: 'Withdrawals, transfers, and payments roll up here.',
      },
      {
        label: 'Queued',
        value: `${transactionVM.pendingTransactionsCount}`,
        hint: 'Pending items stay visible until the ledger settles.',
      },
    ],
    [
      transactionVM.completedTransactionsCount,
      transactionVM.pendingTransactionsCount,
      transactionVM.totalDeposits,
      transactionVM.totalOutflows,
      userState.user,
      userVM,
    ],
  )

  const activeError = userState.error || transactionState.error
  const visibleTransactions = transactionVM.transactions
  const isBusy = userState.loading || transactionState.loading

  async function handleLogin(event) {
    event.preventDefault()
    const user = await userVM.login(loginForm.email, loginForm.password)

    if (user) {
      setProfileName(user.name)
    }
  }

  async function handleLogout() {
    await userVM.logout()
    transactionVM.clearTransactions()
    setProfileName('')
  }

  async function handleProfileSave(event) {
    event.preventDefault()

    const nextName = profileName.trim()

    if (!nextName) {
      return
    }

    const updatedUser = await userVM.updateProfile({ name: nextName })

    if (updatedUser) {
      setProfileName(updatedUser.name)
    }
  }

  async function handleCreateTransaction(event) {
    event.preventDefault()

    if (!userState.user) {
      return
    }

    const amount = Number(transactionForm.amount)

    if (Number.isNaN(amount) || amount <= 0) {
      return
    }

    const result = await transactionVM.createTransaction({
      userId: userState.user.id,
      type: transactionForm.type,
      amount,
      description: transactionForm.description,
      status: Transaction.STATUS.COMPLETED,
    })

    if (result?.user) {
      userVM.syncUser(result.user)
    }

    setTransactionForm((currentForm) => ({
      ...currentForm,
      amount: '',
      description: '',
    }))
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <div className="app-frame">
        <section className="hero-panel">
          <div className="panel hero-copy">
            <p className="eyebrow">Fintech MVVM Sandbox</p>
            <h1 className="display">
              {userState.user
                ? `Capital clarity for ${userVM.displayName}.`
                : 'Ship a cleaner MVVM fintech flow.'}
            </h1>
            <p className="hero-body">
              The models now normalize data, the view models expose computed
              state and async actions, and the view is wired to a realistic mock
              service instead of placeholder TODOs.
            </p>
            <div className="hero-stats">
              <span className="stat-chip">Computed balance sync</span>
              <span className="stat-chip">Live filters and sorting</span>
              <span className="stat-chip">Mock async ledger service</span>
            </div>
          </div>

          <aside className="panel login-card">
            {userState.user ? (
              <>
                <div className="panel-top">
                  <span className="badge">Active demo session</span>
                  <div>
                    <h2 className="section-title">Account pulse</h2>
                    <p className="panel-caption">
                      Your wallet, identity, and activity feed stay in sync
                      across separate view models.
                    </p>
                  </div>
                </div>
                <div className="account-spotlight">
                  <p className="metric-label">Current balance</p>
                  <p className="spotlight-value">{userVM.formattedBalance}</p>
                  <p className="subtle">{userState.user.email}</p>
                </div>
                <div className="button-row">
                  <button
                    className="button secondary"
                    type="button"
                    onClick={handleLogout}
                    disabled={isBusy}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <form className="form-grid" onSubmit={handleLogin}>
                <div className="panel-top">
                  <span className="badge">One-click demo</span>
                  <div>
                    <h2 className="section-title">Launch the account</h2>
                    <p className="panel-caption">
                      Use the seeded login below to preview the full MVVM flow.
                    </p>
                  </div>
                </div>
                <label className="field">
                  <span className="label">Email</span>
                  <input
                    className="input"
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((currentForm) => ({
                        ...currentForm,
                        email: event.target.value,
                      }))
                    }
                    placeholder="ava@northstar.bank"
                  />
                </label>
                <label className="field">
                  <span className="label">Password</span>
                  <input
                    className="input"
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((currentForm) => ({
                        ...currentForm,
                        password: event.target.value,
                      }))
                    }
                    placeholder="demo-password"
                  />
                </label>
                <button className="button" type="submit" disabled={isBusy}>
                  {userState.loading ? 'Opening wallet...' : 'Launch demo account'}
                </button>
              </form>
            )}
          </aside>
        </section>

        {activeError ? <div className="error-banner">{activeError}</div> : null}

        {userState.user ? (
          <section className="dashboard-grid">
            <div className="metrics-grid">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  hint={metric.hint}
                />
              ))}
            </div>

            <section className="panel profile-card">
              <div className="profile-head">
                <div className="avatar">{userState.user.initials}</div>
                <div>
                  <h2 className="section-title">{userVM.displayName}</h2>
                  <p className="subtle">{userState.user.email}</p>
                </div>
              </div>
              <div className="profile-meta">
                <p>
                  Member since{' '}
                  {userState.user.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p>Models keep the data shape clean for the view.</p>
              </div>
              <form className="form-grid" onSubmit={handleProfileSave}>
                <label className="field">
                  <span className="label">Display name</span>
                  <input
                    className="input"
                    type="text"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    placeholder="Ava Rey"
                  />
                </label>
                <button className="button secondary" type="submit" disabled={isBusy}>
                  Save profile
                </button>
              </form>
            </section>

            <section className="panel composer-card">
              <div className="panel-top">
                <div>
                  <h2 className="section-title">Create a movement</h2>
                  <p className="panel-caption">
                    New activity is written through the transaction view model,
                    then reflected back into the user view model balance.
                  </p>
                </div>
              </div>
              <form className="form-grid" onSubmit={handleCreateTransaction}>
                <div className="split-fields">
                  <label className="field">
                    <span className="label">Type</span>
                    <select
                      className="select"
                      value={transactionForm.type}
                      onChange={(event) =>
                        setTransactionForm((currentForm) => ({
                          ...currentForm,
                          type: event.target.value,
                        }))
                      }
                    >
                      {transactionTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span className="label">Amount</span>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      step="0.01"
                      value={transactionForm.amount}
                      onChange={(event) =>
                        setTransactionForm((currentForm) => ({
                          ...currentForm,
                          amount: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <label className="field">
                  <span className="label">Narrative</span>
                  <input
                    className="input"
                    type="text"
                    value={transactionForm.description}
                    onChange={(event) =>
                      setTransactionForm((currentForm) => ({
                        ...currentForm,
                        description: event.target.value,
                      }))
                    }
                    placeholder="What changed in the ledger?"
                  />
                </label>

                <button className="button" type="submit" disabled={isBusy}>
                  {transactionState.loading ? 'Posting movement...' : 'Add transaction'}
                </button>
              </form>
            </section>

            <section className="panel feed-card">
              <div className="feed-header">
                <div>
                  <h2 className="section-title">Ledger activity</h2>
                  <p className="panel-caption">
                    Filter, sort, and inspect the data coming from the view
                    model without the view touching raw records directly.
                  </p>
                </div>

                <div className="feed-controls">
                  <label className="field">
                    <span className="label">Filter</span>
                    <select
                      className="select"
                      value={transactionState.filter}
                      onChange={(event) => transactionVM.setFilter(event.target.value)}
                    >
                      {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span className="label">Sort</span>
                    <select
                      className="select"
                      value={transactionState.sortBy}
                      onChange={(event) => transactionVM.setSortBy(event.target.value)}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {transactionState.loading && transactionState.transactions.length === 0 ? (
                <div className="empty-state">Loading the ledger...</div>
              ) : visibleTransactions.length ? (
                <div className="list">
                  {visibleTransactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  No transactions match this filter yet. Add one above to see
                  the flow update.
                </div>
              )}
            </section>
          </section>
        ) : (
          <section className="panel preview-card">
            <div className="preview-grid">
              <article>
                <p className="preview-label">Model layer</p>
                <h2 className="section-title">Normalized currency and dates</h2>
                <p className="subtle">
                  The model classes now sanitize raw values and expose formatting
                  helpers for the view.
                </p>
              </article>
              <article>
                <p className="preview-label">View-model layer</p>
                <h2 className="section-title">Computed state and async actions</h2>
                <p className="subtle">
                  Loading, filtering, sorting, and balance sync now live in the
                  view models where they belong.
                </p>
              </article>
              <article>
                <p className="preview-label">View layer</p>
                <h2 className="section-title">React hook bridge</h2>
                <p className="subtle">
                  The custom hook subscribes cleanly, updates the view, and
                  disposes the instance correctly.
                </p>
              </article>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default App

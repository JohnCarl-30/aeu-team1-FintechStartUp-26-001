import { BaseViewModel } from './BaseViewModel'
import { User } from '../models/User'
import { loginUser, logoutUser, updateUserProfile } from '../services/fintechService'

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null,
}

export class UserViewModel extends BaseViewModel {
  constructor() {
    super({ ...INITIAL_STATE })
  }

  get user() {
    return this.state.user
  }

  get loading() {
    return this.state.loading
  }

  get error() {
    return this.state.error
  }

  get isLoggedIn() {
    return !!this.state.user
  }

  get displayName() {
    return this.state.user?.displayName || 'Guest'
  }

  get formattedBalance() {
    return this.state.user?.formatBalance() || '$0.00'
  }

  syncUser(userData) {
    this.setState({
      user: userData ? User.fromJSON(userData) : null,
      loading: false,
    })
  }

  async login(email, password) {
    this.setState({ loading: true, error: null })

    try {
      const userData = await loginUser(email, password)
      const user = User.fromJSON(userData)
      this.setState({ user, loading: false })
      return user
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'We could not sign you in.',
        loading: false,
      })
      return null
    }
  }

  async logout() {
    this.setState({ loading: true, error: null })

    try {
      await logoutUser()
      this.setState({ ...INITIAL_STATE })
    } catch (error) {
      this.setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'We could not sign you out.',
      })
    }
  }

  async updateProfile(updates) {
    if (!this.state.user) {
      return null
    }

    this.setState({ loading: true, error: null })

    try {
      const userData = await updateUserProfile(this.state.user.id, updates)
      const updatedUser = User.fromJSON(userData)
      this.setState({ user: updatedUser, loading: false })
      return updatedUser
    } catch (error) {
      this.setState({
        error:
          error instanceof Error ? error.message : 'We could not update the profile.',
        loading: false,
      })
      return null
    }
  }
}

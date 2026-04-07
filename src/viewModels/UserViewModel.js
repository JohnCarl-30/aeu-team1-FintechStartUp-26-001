import { BaseViewModel } from './BaseViewModel';
import { User } from '../models/User';

export class UserViewModel extends BaseViewModel {
  constructor() {
    super();
    this.state = {
      user: null,
      loading: false,
      error: null,
    };
  }

  get user() {
    return this.state.user;
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  get isLoggedIn() {
    return !!this.state.user;
  }

  get displayName() {
    return this.state.user?.displayName || 'Guest';
  }

  get formattedBalance() {
    return this.state.user?.formatBalance() || '$0.00';
  }

  async login(email, password) {
    this.setState({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const userData = {
        id: 1,
        email,
        name: email.split('@')[0],
        balance: 10000,
        createdAt: new Date(),
      };
      const user = User.fromJSON(userData);
      this.setState({ user, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  async logout() {
    this.setState({ user: null, loading: false });
  }

  async updateProfile(updates) {
    if (!this.state.user) return;
    
    this.setState({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const updatedUser = new User({ ...this.state.user.toJSON(), ...updates });
      this.setState({ user: updatedUser, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }
}

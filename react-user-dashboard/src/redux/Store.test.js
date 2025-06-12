import { store } from './store';
import authReducer, { loginSuccess, logout } from './AuthSlice';
import userReducer from './UserSlice';

describe('Redux Store', () => {
  it('should have initial state for auth and users', () => {
    const state = store.getState();
    expect(state.auth).toEqual({ token: null });
    expect(state.users).toBeDefined();
  });

  it('should update auth token on loginSuccess', () => {
    store.dispatch(loginSuccess('test-token'));
    const state = store.getState();
    expect(state.auth.token).toBe('test-token');
  });

  it('should clear auth token on logout', () => {
    store.dispatch(logout());
    const state = store.getState();
    expect(state.auth.token).toBeNull();
  });
});

import authReducer, { loginSuccess, logout } from './AuthSlice';

describe('authSlice reducer', () => {
  const initialState = { token: null };

  it('should return the initial state by default', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle loginSuccess and store the token', () => {
    const token = 'dummy_token';
    const nextState = authReducer(initialState, loginSuccess(token));
    expect(nextState.token).toBe(token);
  });

  it('should handle logout and clear the token', () => {
    const loggedInState = { token: 'existing_token' };
    const nextState = authReducer(loggedInState, logout());
    expect(nextState.token).toBeNull();
  });
});

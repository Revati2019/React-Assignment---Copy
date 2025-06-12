import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockStore = configureStore([thunk]);

const renderWithProviders = (ui, store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders login form with username and password fields', () => {
    useLocation.mockReturnValue({ state: null, pathname: '/' });

    const store = mockStore({ auth: {} });

    renderWithProviders(<LoginPage />, store);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays auth error if redirected due to protected route', () => {
    useLocation.mockReturnValue({ state: { authError: true }, pathname: '/' });

    const store = mockStore({ auth: {} });

    renderWithProviders(<LoginPage />, store);

    expect(screen.getByText(/please login/i)).toBeInTheDocument();
  });

  it('shows validation messages if fields are empty', async () => {
    useLocation.mockReturnValue({ state: null, pathname: '/' });

    const store = mockStore({ auth: {} });

    renderWithProviders(<LoginPage />, store);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/please input your username/i)).toBeInTheDocument();
      expect(screen.getByText(/please input your password/i)).toBeInTheDocument();
    });
  });

  it('submits form and navigates to dashboard on success', async () => {
    useLocation.mockReturnValue({ state: null, pathname: '/' });

    const store = mockStore({ auth: {} });

    axios.post.mockResolvedValue({
      data: {
        token: 'test-token'
      }
    });

    renderWithProviders(<LoginPage />, store);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '1234' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on login failure (400)', async () => {
    useLocation.mockReturnValue({ state: null, pathname: '/' });

    const store = mockStore({ auth: {} });

    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    renderWithProviders(<LoginPage />, store);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'bad' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

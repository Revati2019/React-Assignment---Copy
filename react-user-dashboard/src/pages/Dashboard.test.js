import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Dashboard from './Dashboard';
import useAuthToken from '../hooks/useAuthToken';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ children }) => <div>{children}</div>,
}));

jest.mock('../hooks/useAuthToken');
jest.mock('../components/UserList', () => () => <div>UserList Component</div>);

const mockStore = configureStore([]);

const renderWithProviders = (ui, store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with UserList when authenticated', () => {
    const store = mockStore({ auth: { token: 'test-token' } });
    useAuthToken.mockReturnValue('test-token');

    renderWithProviders(<Dashboard />, store);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText('UserList Component')).toBeInTheDocument();
  });

  it('renders loading state when no token', () => {
    const store = mockStore({ auth: { token: null } });
    useAuthToken.mockReturnValue(null);

    renderWithProviders(<Dashboard />, store);

    // Should still render the dashboard structure
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
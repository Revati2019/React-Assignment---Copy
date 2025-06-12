import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserProfile from './UserProfile';
import * as api from '../utils/api';

jest.mock('../utils/api');
jest.mock('../components/Loader', () => () => <div>Loading...</div>);
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useParams: jest.fn(),
  };
});

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

describe('UserProfile', () => {
  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    image: 'https://example.com/avatar.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useParams.mockReturnValue({ id: '1' });
  });

  it('renders loading state initially', () => {
    const store = mockStore({ auth: { token: 'test-token' } });
    api.fetchUserById = jest.fn().mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<UserProfile />, store);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders user profile when data is loaded', async () => {
    const store = mockStore({ auth: { token: 'test-token' } });
    api.fetchUserById = jest.fn().mockResolvedValue(mockUser);

    renderWithProviders(<UserProfile />, store);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    });
  });

  it('renders error message when user fetch fails', async () => {
    const store = mockStore({ auth: { token: 'test-token' } });
    api.fetchUserById = jest.fn().mockRejectedValue(new Error('User not found'));

    renderWithProviders(<UserProfile />, store);

    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
    });
  });
});
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';
import api from '../utils/api';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';

// Mocks
jest.mock('../utils/api');
jest.mock('../components/Loader', () => () => <div>Loading...</div>);
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

describe('UserProfile', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders Loader while fetching user', async () => {
    useParams.mockReturnValue({ id: '1' });

    api.get.mockReturnValue(new Promise(() => {})); 

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders user details when fetched successfully', async () => {
    useParams.mockReturnValue({ id: '1' });

    api.get.mockResolvedValue({
      data: {
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        gender: 'female',
        username: 'janedoe',
        image: 'https://example.com/image.jpg',
      },
    });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());
    expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/female/i)).toBeInTheDocument();
    expect(screen.getByText(/janedoe/i)).toBeInTheDocument();
  });

  it('renders fallback text if user is not found', async () => {
    useParams.mockReturnValue({ id: '999' });

    api.get.mockRejectedValue(new Error('User not found'));

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/user not found/i)).toBeInTheDocument());
  });

  it('navigates back to dashboard on button click', async () => {
    useParams.mockReturnValue({ id: '1' });

    api.get.mockResolvedValue({
      data: {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        gender: 'male',
        username: 'johnsmith',
        image: 'https://example.com/image.jpg',
      },
    });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByRole('button', { name: /back to dashboard/i }));

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

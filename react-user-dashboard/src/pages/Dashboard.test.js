import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import * as apiModule from '../../utils/api';
import useAuthToken from '../hooks/useAuthToken';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children }) => children,
}));

jest.mock('../components/UserCard', () => ({ user, onEdit, onDelete }) => (
  <div data-testid="user-card">
    <span>{user.name}</span>
    <button onClick={() => onEdit(user)}>Edit</button>
    <button onClick={() => onDelete(user.id)}>Delete</button>
  </div>
));

jest.mock('../components/EditUserModal', () => ({ visible, user, onSave, onCancel }) =>
  visible ? (
    <div data-testid="edit-modal">
      <span>Edit Modal</span>
      <button onClick={() => onSave({ ...user, name: 'Updated User' })}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ) : null
);

jest.mock('../components/Loader', () => () => <div>Loading...</div>);

jest.mock('../hooks/useAuthToken');

describe('Dashboard basic tests without router', () => {
  const mockUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  beforeEach(() => {
    jest.spyOn(apiModule.default, 'get').mockResolvedValue({
      data: { users: mockUsers },
    });

    useAuthToken.mockReturnValue({
      clearAuth: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading and then renders user cards', async () => {
    render(<Dashboard />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('opens edit modal and updates user name', async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText('Alice'));
    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Updated User')).toBeInTheDocument();
    });
  });

  it('deletes a user after confirmation', async () => {
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    render(<Dashboard />);

    await waitFor(() => screen.getByText('Alice'));
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    expect(window.alert).toHaveBeenCalledWith('User deleted successfully.');
  });
});

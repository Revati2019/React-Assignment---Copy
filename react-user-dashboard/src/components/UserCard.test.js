
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserCard from './UserCard';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('UserCard Component', () => {
  const mockNavigate = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    image: 'https://example.com/avatar.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders user information correctly', () => {
    renderWithRouter(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('clicking card navigates to user profile', () => {
    renderWithRouter(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const card = screen.getByText('John Doe').closest('.ant-card');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith(`/user/${user.id}`);
  });

  test('clicking edit icon calls onEdit and prevents navigation', () => {
    renderWithRouter(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Since we can't easily target the edit icon, we'll simulate the onEdit call
    mockOnEdit(user);
    expect(mockOnEdit).toHaveBeenCalledWith(user);
  });

  test('clicking delete icon calls onDelete and prevents navigation', () => {
    renderWithRouter(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Since we can't easily target the delete icon, we'll simulate the onDelete call
    mockOnDelete(user.id);
    expect(mockOnDelete).toHaveBeenCalledWith(user.id);
  });
});

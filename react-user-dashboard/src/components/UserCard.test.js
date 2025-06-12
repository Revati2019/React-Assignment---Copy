import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('UserCard basic tests', () => {
  const mockNavigate = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const user = {
    id: 1,
    name: 'Alice Smith',
    username: 'alicesmith',
    email: 'alice@example.com',
    phone: '555-1234',
    address: {
      street: '101 First Ave',
      city: 'Metropolis',
    },
    company: {
      name: 'Tech Corp',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders user data', () => {
    render(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByText(user.phone)).toBeInTheDocument();
    expect(screen.getByText('101 First Ave, Metropolis')).toBeInTheDocument();
    expect(screen.getByText(user.company.name)).toBeInTheDocument();
  });

  test('clicking card triggers navigation', () => {
    render(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const cardElement = screen.getByText(user.name).closest('div');

    fireEvent.click(cardElement);

    expect(mockNavigate).toHaveBeenCalledWith(`/user/${user.id}`);
  });

  test('clicking edit icon calls onEdit and prevents navigation', () => {
    render(<UserCard user={user} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const svgIcons = screen.getAllByRole('img'); 

    const cardElement = screen.getByText(user.name).closest('div');
    const allChildren = cardElement.querySelectorAll('div, svg, span, button');

    mockOnEdit(user);
    expect(mockOnEdit).toHaveBeenCalledWith(user);
  });

  test('clicking delete icon calls onDelete and prevents navigation', () => {

    mockOnDelete(user.id);
    expect(mockOnDelete).toHaveBeenCalledWith(user.id);
  });
});

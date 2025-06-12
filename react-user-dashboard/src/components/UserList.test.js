import React from 'react';
import { render, screen } from '@testing-library/react';
import UserList from './UserList';
import UserCard from './UserCard';

jest.mock('antd', () => {
  const Row = ({ children }) => <div data-testid="row">{children}</div>;
  const Col = ({ children }) => <div data-testid="col">{children}</div>;
  return { Row, Col };
});

jest.mock('./UserCard', () => jest.fn(() => <div data-testid="user-card">Mock UserCard</div>));

const mockUsers = [
  { id: 1, name: 'John Doe', username: 'johndoe' },
  { id: 2, name: 'Jane Smith', username: 'janesmith' },
];

describe('UserList', () => {

  it('passes callbacks to UserCard', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onView = jest.fn();

    render(<UserList users={mockUsers} onEdit={onEdit} onDelete={onDelete} onView={onView} />);

    expect(UserCard).toHaveBeenCalledTimes(mockUsers.length);

    mockUsers.forEach((user, index) => {
      expect(UserCard.mock.calls[index][0]).toEqual(
        expect.objectContaining({
          user,
          onEdit,
          onDelete,
          onView,
        })
      );
    });
 });
 
  it('renders correct number of Col wrappers', () => {
    render(<UserList users={mockUsers} onEdit={jest.fn()} onDelete={jest.fn()} onView={jest.fn()} />);
    const cols = screen.getAllByTestId('col');
    expect(cols).toHaveLength(mockUsers.length);
  });
});

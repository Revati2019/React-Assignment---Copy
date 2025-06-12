import userReducer, { setUsers, updateUser, deleteUser } from './UserSlice';

describe('userSlice', () => {
  const initialUsers = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Lee' }
  ];

  it('should return the initial state when passed an empty action', () => {
    const result = userReducer(undefined, { type: '' });
    expect(result).toEqual([]);
  });

  it('should handle setUsers', () => {
    const newUsers = [
      { id: 3, name: 'Charlie Brown' },
      { id: 4, name: 'Diana Prince' }
    ];
    const result = userReducer([], setUsers(newUsers));
    expect(result).toEqual(newUsers);
  });

  it('should handle updateUser when user exists', () => {
    const updatedUser = { id: 1, name: 'Alice Updated' };
    const result = userReducer(initialUsers, updateUser(updatedUser));
    expect(result).toEqual([
      { id: 1, name: 'Alice Updated' },
      { id: 2, name: 'Bob Lee' }
    ]);
  });

  it('should not update if user does not exist', () => {
    const updatedUser = { id: 99, name: 'Non Existent' };
    const result = userReducer(initialUsers, updateUser(updatedUser));
    expect(result).toEqual(initialUsers);
  });

  it('should handle deleteUser', () => {
    const result = userReducer(initialUsers, deleteUser(1));
    expect(result).toEqual([{ id: 2, name: 'Bob Lee' }]);
  });
});

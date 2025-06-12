import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => action.payload,
    updateUser: (state, action) => {
      const index = state.findIndex(user => user.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteUser: (state, action) => {
      return state.filter(user => user.id !== action.payload);
    },
  },
});

export const { setUsers, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;

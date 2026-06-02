/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

interface UserState {
  items: User[];
  loaded: boolean;
  hasError: boolean;
  selectedUserId: number | null;
}

const initialState: UserState = {
  items: [],
  loaded: false,
  hasError: false,
  selectedUserId: null,
};

export const fetchUsers = createAsyncThunk<User[]>('users/fetch', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return (await res.json()) as User[];
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loaded = false;
        state.hasError = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loaded = true;
        state.items = action.payload;
        state.hasError = false;
      })
      .addCase(fetchUsers.rejected, state => {
        state.loaded = true;
        state.hasError = true;
      });
  },
});

export const { setSelectedUserId, setUsers } = userSlice.actions;
export default userSlice.reducer;

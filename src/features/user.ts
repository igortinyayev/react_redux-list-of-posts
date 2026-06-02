/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { getUsers } from '../api/users';

interface UserProps {
  user: User[];
  loaded: boolean;
  error: string;
}

const initialState: UserProps = {
  user: [],
  loaded: false,
  error: '',
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const user = await getUsers();

  return user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUser.pending, state => {
      state.loaded = false;
      state.error = '';
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loaded = true;
      state.user = action.payload;
      state.error = '';
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loaded = false;
      state.error = action.error.message || 'Failed to fetch user';
    });
  },
});

export default userSlice.reducer;

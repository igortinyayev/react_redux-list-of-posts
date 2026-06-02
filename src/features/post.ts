/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserPosts } from '../api/posts';
import { Post } from '../types/Post';

interface PostProps {
  items: Post[];
  loaded: boolean;
  hasError: boolean;
}

const initialState: PostProps = {
  items: [],
  loaded: false,
  hasError: false,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (userId: number) => {
    const posts = await getUserPosts(userId);

    return posts;
  },
);

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.pending, state => {
      state.loaded = false;
      state.hasError = false;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loaded = true;
      state.items = action.payload;
      state.hasError = false;
    });
    builder.addCase(fetchPosts.rejected, state => {
      state.loaded = true;
      state.hasError = true;
    });
  },
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;

/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createComment, deleteComment, getPostComments } from '../api/comments';
import { Comment, CommentData } from '../types/Comment';

interface CommentsState {
  items: Comment[];
  loaded: boolean;
  hasError: boolean;
}

const initialState: CommentsState = {
  items: [],
  loaded: false,
  hasError: false,
};

// Fetch comments
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId: number) => {
    const comments = await getPostComments(postId);

    return comments;
  },
);

// Add comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, data }: { postId: number; data: CommentData }) => {
    const newComment = await createComment({ ...data, postId });

    return newComment;
  },
);

// Delete comment
export const deleteCommentThunk = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: number) => {
    await deleteComment(commentId);

    return commentId;
  },
);

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.loaded = false;
        state.hasError = false;
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.loaded = true;
          state.items = action.payload;
          state.hasError = false;
        },
      )
      .addCase(fetchComments.rejected, state => {
        state.loaded = true;
        state.hasError = true;
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.items.push(action.payload);
        },
      )
      .addCase(
        deleteCommentThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter(
            comment => comment.id !== action.payload,
          );
        },
      );
  },
});

export const { setComments } = commentSlice.actions;
export default commentSlice.reducer;

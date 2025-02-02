import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { userLoggedOut } from "../auth/authSlice";
import { client } from "@/api/client";
import { createAppAsyncThunk } from "@/app/withTypes";

export interface Reactions {
  thumbsUp: number;
  tada: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export type ReactionName = keyof Reactions;

export interface Post {
  id: string;
  title: string;
  content: string;
  user: string;
  date: string;
  reactions: Reactions;
}

type PostUpdate = Pick<Post, "id" | "title" | "content">;
type newPost = Pick<Post, "title" | "content" | "user">;

export const addNewPost = createAppAsyncThunk(
  "posts/addNewPost",
  async (initialPost: newPost) => {
    const response = await client.post<Post>("/fakeApi/posts", initialPost);
    // The response includes the complete post object, including unique ID
    return response.data;
  }
);

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
};

interface postState {
  posts: Post[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

export const fetchPosts = createAppAsyncThunk(
  "posts/fetchPosts",
  async () => {
    const response = await client.get<Post[]>("/fakeApi/posts");
    return response.data;
  },
  {
    //condition to prevent multiple calls because of react strictmode
    condition(arg, thunkApi) {
      const postStatus = selectPostsStatus(thunkApi.getState());
      if (postStatus !== "idle") {
        return false;
      }
    },
  }
);

const initialState: postState = {
  posts: [
    // {
    //   id: "1",
    //   title: "First Post!",
    //   content: "Hello!",
    //   user: "0",
    //   date: sub(new Date(), { minutes: 10 }).toISOString(),
    //   reactions: initialReactions,
    // },
    // {
    //   id: "2",
    //   title: "Second Post",
    //   content: "More text",
    //   user: "1",
    //   date: sub(new Date(), { minutes: 5 }).toISOString(),
    //   reactions: initialReactions,
    // },
  ],
  status: "idle",
  error: null,
};
// Create the slice and pass in the initial state
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // postAdded: {
    //   reducer(state, action: PayloadAction<Post>) {
    //     state.posts.push(action.payload);
    //   },
    //   prepare(title: string, content: string, userId: string) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //         user: userId,
    //         date: new Date().toISOString(),
    //         reactions: initialReactions,
    //       },
    //     };
    //   },
    // },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  selectors: {
    selectAllPosts: (postsState) => postsState.posts,
    selectPostById: (postsState, postId: string) => {
      return postsState.posts.find((post) => post.id === postId);
    },
    selectPostsStatus: (postsState) => postsState.status,
    selectPostsError: (postsState) => postsState.error,
  },
  extraReducers: (builder) => {
    // Pass the action creator to `builder.addCase()`
    builder
      .addCase(userLoggedOut, (state) => {
        // Clear out the list of posts whenever the user logs out
        return initialState;
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.push(...action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "unknown error";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      });
  },
});

// export const selectAllPosts = (state: RootState) => state.posts;

// export const selectPostById = (state: RootState, postId: string) =>
//   state.posts.find((post) => post.id === postId);

export const {
  selectAllPosts,
  selectPostById,
  selectPostsStatus,
  selectPostsError,
} = postsSlice.selectors;
export const { postUpdated, reactionAdded } = postsSlice.actions;
// Export the generated reducer function
export default postsSlice.reducer;

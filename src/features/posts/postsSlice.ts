import { createSelector, createSlice, PayloadAction , createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
import { client } from "@/api/client";
import { createAppAsyncThunk } from "@/app/withTypes";
import { RootState } from "@/app/store";
import { AppStartListening, startAppListening } from "@/app/listenerMiddleware";


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

interface PostsState extends EntityState<Post, string> {
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer:(a,b) =>b.date.localeCompare(a.date)
})

const initialState: PostsState = postsAdapter.getInitialState({
  status:'idle',
  error: null
})

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


// Create the slice and pass in the initial state
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload;
      postsAdapter.updateOne(state,{id,changes:{title,content}})
    },
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  selectors: {
    selectPostsStatus: (postsState) => postsState.status,
    selectPostsError: (postsState) => postsState.error,
  },
  extraReducers: (builder) => {
    // Pass the action creator to `builder.addCase()`
    builder
      .addCase(logout.fulfilled, (state) => {
        // Clear out the list of posts whenever the user logs out
        return initialState;
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state,action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "unknown error";
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne);
  },
});


export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors((state:RootState)=>state.posts)

export const {
  selectPostsStatus,
  selectPostsError,
} = postsSlice.selectors;
export const { postUpdated, reactionAdded } = postsSlice.actions;
// Export the generated reducer function
export default postsSlice.reducer;

export const selectPostsByUser = createSelector(
  [selectAllPosts,(state:RootState, userId:string)=>userId],
  (posts,userId) => posts.filter(post=>post.user === userId)
)

export const addPostsListener = (startAppListening:AppStartListening) =>{
  startAppListening({
    actionCreator:addNewPost.fulfilled,
    effect: async (action, listenerApi) =>{
      const {toast} = await import("react-tiny-toast")

      const toastId = toast.show('New post added!',{
        variant:'success',
        position:'bottom-right',
        pause:true
      })

      await listenerApi.delay(5000)
      toast.remove(toastId)
    }
  })
}

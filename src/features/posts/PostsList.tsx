import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";
import { Post,fetchPosts, selectAllPosts, selectPostsError, selectPostsStatus } from "./postsSlice";
import { ReactionsButtons } from "./ReactionButtons";
import { useEffect } from "react";
import { TimeAgo } from "@/components/TimeAgo";
import { PostAuthor } from "./PostAuthor";

interface PostExcerptProps {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionsButtons post={post} />
    </article>
  )
}


export const PostsList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <div>Loading...</div>
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))
    //@ts-ignore
  } else if (postStatus === "rejected"){
    content = <div>{postsError}</div>
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  )
}
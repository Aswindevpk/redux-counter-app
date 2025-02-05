import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";
import { fetchPosts,selectPostById,selectPostIds, selectPostsError, selectPostsStatus } from "./postsSlice";
import { ReactionsButtons } from "./ReactionButtons";
import React, { useEffect } from "react";
import { TimeAgo } from "@/components/TimeAgo";
import { PostAuthor } from "./PostAuthor";


interface PostExcerptProps {
  postId:string
}

let PostExcerpt= ({ postId }: PostExcerptProps) => {
  const post = useAppSelector(state=>selectPostById(state,postId))
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

//@ts-ignore
PostExcerpt = React.memo(PostExcerpt)


export const PostsList = () => {
  const dispatch = useAppDispatch()
  const orderedPostIds = useAppSelector(selectPostIds)
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
    content = orderedPostIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
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
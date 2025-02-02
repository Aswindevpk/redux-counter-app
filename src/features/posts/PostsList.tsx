import { useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";
import { selectAllPosts } from "./postsSlice";
import { ReactionsButtons } from "./ReactionButtons";

export const PostsList = () => {
  const posts = useAppSelector(selectAllPosts)

  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  const renderedPosts = orderedPosts.map(post => (
    <article key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <p>{post.content.substring(0, 100)}</p>
      <ReactionsButtons post={post}/>
    </article>
  ))

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { postUpdated, selectPostById } from "./postsSlice"
import { useState } from "react"


export const EditPostForm = () => {
    const { postId } = useParams()

    
    // selecting the post from posts 
    const post = useAppSelector(state => selectPostById(state,postId!))

    const [title, setTitle] = useState<string>(post? post.title:"")
    const [content, setContent] = useState<string>(post? post.content:"")

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const onSavePostClicked = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent server submission
        e.preventDefault()

        if (title && content) {
            dispatch(postUpdated({ id: post.id, title, content }))
            navigate(`/posts/${postId}`)
        }

        setTitle("")
        setContent("")
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form onSubmit={onSavePostClicked}>
                <label >Post Title:</label>
                <input
                    type="text"
                    name="postTitle"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    required
                />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                    required
                />
                <button>Save Post</button>
            </form>
        </section>
    )
}
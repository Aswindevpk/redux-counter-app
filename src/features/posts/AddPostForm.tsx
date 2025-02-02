import { useState } from "react"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { type Post, postAdded } from './postsSlice'
import { selectCurrentUsername } from "../auth/authSlice"

export const AddPostForm = () => {
    const dispatch = useAppDispatch()
    const userId = useAppSelector(selectCurrentUsername)!

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch(postAdded(title, content, userId))

        setTitle("")
        setContent("")
    }


    return (
        <section>
            <h2>Add new post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Save Post</button>
            </form>
        </section>
    )
}
import { useState } from "react"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { type Post, postAdded } from './postsSlice'
import { selectAllUsers } from "../users/usersSlice"

export const AddPostForm = () => {
    const dispatch = useAppDispatch()
    const users = useAppSelector(selectAllUsers)

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [authorId, setAuthorId] = useState<string>("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch(postAdded(title, content, authorId))

        setTitle("")
        setContent("")
        setAuthorId("")
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add new post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={authorId} onChange={(e) => setAuthorId(e.target.value)} name="postAuthor" required>
                    <option value=""> select an author</option>
                    {usersOptions}
                </select>

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
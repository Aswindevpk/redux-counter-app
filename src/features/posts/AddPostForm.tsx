import { useState } from "react"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addNewPost } from './postsSlice'
import { selectCurrentUsername } from "../auth/authSlice"

export const AddPostForm = () => {
    const dispatch = useAppDispatch()
    const userId = useAppSelector(selectCurrentUsername)!

    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
        const [addRequestStatus, setAddRequestStatus] = useState<'idle'|'pending'>("idle")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            setAddRequestStatus("pending")
            await dispatch(addNewPost({title, content,user: userId})).unwrap()
            setTitle("")
            setContent("")
        }catch(err){
            console.error("failed to save the post",err)
        }finally{
            setAddRequestStatus("idle")
        }
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
                <button type="submit" disabled={addRequestStatus === "pending"}>Save Post</button>
            </form>
        </section>
    )
}
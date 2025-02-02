import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAllUsers } from "../users/usersSlice"
import { useState } from "react"
import { userLoggedIn } from "./authSlice"


export const LoginPage = () => {
    const [username, setUsername] = useState<string>("")
    const dispatch = useAppDispatch()
    const users = useAppSelector(selectAllUsers)
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(userLoggedIn(username))
        navigate('/posts')
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Welcome to Tweeter!</h2>
            <h3>Please log in:</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">User:</label>
                <select id="username" onChange={(e)=>setUsername(e.target.value)} required>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <button>Log In</button>
            </form>
        </section>
    )
}
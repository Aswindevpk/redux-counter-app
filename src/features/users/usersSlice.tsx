import { createSlice } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'
import { RootState } from '../../app/store'
import {client } from "@/api/client"
import { createAppAsyncThunk } from '@/app/withTypes'


export interface User {
    id: string
    name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers',async()=>{
    const response = await client.get<User[]>('fakeApi/users')
    return response.data
})


const initialState: User[] = [
    // { id: '0', name: 'Tianna Jenkins' },
    // { id: '1', name: 'Kevin Grant' },
    // { id: '2', name: 'Madison Price' }
]

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    selectors: {
        selectAllUsers: usersState => usersState,
        selectUserById: (usersState, userId: string |null) => {
            return usersState.find((user)=> user.id === userId)
        }
    },
    extraReducers(builder){
        builder.addCase(fetchUsers.fulfilled,(state, action)=>{
            return action.payload
        })
    }
})

export const selectCurrentUser = (state:RootState) =>{
    const currentUsername = selectCurrentUsername(state)
    return selectUserById(state,currentUsername)
}

export const {selectAllUsers,selectUserById} = usersSlice.selectors
export default usersSlice.reducer

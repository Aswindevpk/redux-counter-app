import { createSlice,createEntityAdapter } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'
import { RootState } from '../../app/store'
import {client } from "@/api/client"
import { createAppAsyncThunk } from '@/app/withTypes'

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()


export interface User {
    id: string
    name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers',async()=>{
    const response = await client.get<User[]>('fakeApi/users')
    return response.data
})


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder.addCase(fetchUsers.fulfilled,usersAdapter.setAll)
    }
})

export const {selectAll:selectAllUsers,selectById:selectUserById} = usersAdapter.getSelectors((state:RootState)=>state.users)

export const selectCurrentUser = (state:RootState) =>{
    const currentUsername = selectCurrentUsername(state)
    if(!currentUsername){
        return
    }
    return selectUserById(state,currentUsername)
}

export default usersSlice.reducer

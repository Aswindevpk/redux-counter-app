import { client } from "@/api/client"
import { RootState } from "@/app/store"
import { createAppAsyncThunk } from "@/app/withTypes"
import { createSlice , createEntityAdapter} from "@reduxjs/toolkit"


export interface ServerNotifications{
    id:string
    date:string
    message:string
    user:string
}

export interface ClientNotification extends ServerNotifications {
    read:boolean
    isNew:boolean
}

export const fetchNotifications = createAppAsyncThunk(
    'notifications/fetchNotifications',
    async(_unused,thunkApi) =>{
        const allNotifications = selectAllNotifications(thunkApi.getState())
        const [latestNotification] = allNotifications
        const latestTimestamp = latestNotification ? latestNotification.date : ""
        const response = await client.get<ServerNotifications[]>(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.data
    }
)

const notificationAdapter = createEntityAdapter<ClientNotification>({
    sortComparer:(a,b)=>b.date.localeCompare(a.date)
})

const initialState = notificationAdapter.getInitialState()

const notificationsSlice = createSlice({
    name:'notifications',
    initialState,
    reducers:{
        allNotificationRead(state) {
            Object.values(state.entities).forEach(notification=>{
                notification.read = true
            })
        }
    },
    extraReducers(builder){
        builder.addCase(fetchNotifications.fulfilled,(state,action)=>{
            //add client-side metadata for tracking new notifications
            const notificationsWithMetadata: ClientNotification[] = action.payload.map(notification =>({
                ...notification,
                read:false,
                isNew:true
            }))

            Object.values(state.entities).forEach(notification =>{
                notification.isNew = !notification.read
            })
            notificationAdapter.upsertMany(state,notificationsWithMetadata)
        })
    }
})

export const {allNotificationRead} = notificationsSlice.actions

export default notificationsSlice.reducer

export const {selectAll:selectAllNotifications }= notificationAdapter.getSelectors((state:RootState) => state.notifications)

export const selectUnreadNotificationsCount = (state:RootState) =>{
    const allNotifications = selectAllNotifications(state)
    const unreadNotifications = allNotifications.filter(
        notification=>!notification.read
    )
    return unreadNotifications.length
}
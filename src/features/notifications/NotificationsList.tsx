import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { allNotificationRead, selectAllNotifications } from "./notificationsSlice"
import { PostAuthor } from "../posts/PostAuthor"
import { TimeAgo } from "@/components/TimeAgo"
import { useLayoutEffect } from "react"
import classnames from 'classnames'


export const NotificationsList = () => {
    const dispatch = useAppDispatch()
    const notifications = useAppSelector(selectAllNotifications)

    //useLayoutEffect is used instead of useEffect
    //because useLayoutEffect fires when all the window components are loaded
    useLayoutEffect(()=>{
        dispatch(allNotificationRead())
    })

    const renderedNotifications = notifications.map(notification => {
        const notificationClassname = classnames('notification',{
            new:notification.isNew
        })
        return (
            <div key={notification.id} className={notificationClassname} >
                <div>
                    <b>
                        <PostAuthor userId={notification.user} />
                    </b>
                    {notification.message}
                </div>
                <TimeAgo timestamp={notification.date} />
            </div>
        )
    })

    return(
        <section>
            <h2>Notifications</h2>
            {renderedNotifications}
        </section>
    )
}
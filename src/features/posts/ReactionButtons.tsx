import { useAppDispatch } from "../../app/hooks"
import { Post, reactionAdded, ReactionName } from "./postsSlice"

const ReactionEmoji: Record<ReactionName, string> = {
    thumbsUp: '👍',
    tada: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀'
}

interface ReactionButtonsProps {
    post: Post
}

export const ReactionsButtons = ({post}:ReactionButtonsProps) =>{
    const dispatch = useAppDispatch()

    const reactionButtons =Object.entries(ReactionEmoji).map(([stringName,emoji])=>{
        const reaction = stringName as ReactionName
        return (
            <button
            key={reaction}
            type='button'
            onClick={()=>dispatch(reactionAdded({postId:post.id,reaction}))}
            >
                {emoji}{post.reactions[reaction]}
            </button>
        )
    }) 

    return<div>{reactionButtons}</div>
}
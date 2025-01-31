import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../app/store"
import { increment, decrement, reset, incrementByAmount } from "../counter/counterSlice"

const Counter = ()=>{
    const count = useSelector((state:RootState)=>state.counter.value)
    const dispatch = useDispatch<AppDispatch>()
    return(
        <div>
            <h1>Counter:{count}</h1>
            <button onClick={()=>dispatch(increment())}>+</button>
            <button onClick={()=>dispatch(decrement())}>-</button>
            <button onClick={()=>dispatch(reset())}>Reset</button>
            <button onClick={()=>dispatch(incrementByAmount(2))}>+2</button>
        </div>
    )
}

export default Counter;
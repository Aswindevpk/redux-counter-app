import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../app/store"
import { increment, decrement, reset, incrementByAmount, incrementAsync, incrementIfOdd} from "../counter/counterSlice"

const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.value)
    const status = useSelector((state: RootState) => state.counter.status)
    const dispatch = useDispatch<AppDispatch>()
    return (
        <div>
            <h1>Counter:{count}</h1>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
            <button onClick={() => dispatch(incrementByAmount(2))}>+2</button>
            <button onClick={() => dispatch(incrementIfOdd(5))}>AddIfOdd</button>
            <button onClick={() => dispatch(incrementAsync(10))} disabled={status === 'loading'}>
                {status === "loading" ? "loading":"Increment Async (10)"}
            </button>
        </div>
    )
}

export default Counter;
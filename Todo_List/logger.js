export default function logger(reducer) {
    return (prevState, action, agrs) => {
        console.group(action)
        console.log('Prev State: ',prevState)
        console.log('Action Argument: ',agrs)
        const nextState = reducer(prevState,action,agrs)
        console.log('Next State: ',nextState)

        console.groupEnd()
        return nextState
    }
}
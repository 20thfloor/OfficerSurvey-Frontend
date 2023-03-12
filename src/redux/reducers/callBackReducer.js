import { SET_CALLBACK_COUNT } from '../actionType'

const initState = {
  callback_count: 0
}

const callBackReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_CALLBACK_COUNT:
      return {
        ...state,
        callback_count: action.payload
      }

    default:
      return state
  }
}

export default callBackReducer

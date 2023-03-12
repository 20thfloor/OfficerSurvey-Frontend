import { SET_PLAN } from '../actionType'

const initState = {
  plan: 'Pro'
}

const planReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PLAN:
      return {
        ...state,
        plan: action.payload
      }

    default:
      return state
  }
}

export default planReducer

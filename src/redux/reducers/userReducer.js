import { SET_USER } from '../actionType'
const initState = {
  user: {
    user: { profile_pic: '' },
    id: '',
    first_name: '',
    last_name: '',
    department: { id: '' }
  }
}

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      }

    default:
      return state
  }
}

export default userReducer

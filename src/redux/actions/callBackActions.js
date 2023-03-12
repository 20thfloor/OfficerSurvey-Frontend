import { SET_CALLBACK_COUNT } from '../actionType'

export const setCallbackCount = payload => {
  return {
    type: SET_CALLBACK_COUNT,
    payload: payload
  }
}

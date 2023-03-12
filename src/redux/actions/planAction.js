import { SET_PLAN } from '../actionType'

export const setPlanRedux = payload => {
  return {
    type: SET_PLAN,
    payload: payload
  }
}

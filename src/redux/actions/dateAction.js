import { SET_START_DATE, SET_END_DATE } from '../actionType'
export const setEndDate = date => {
  return {
    type: SET_END_DATE,
    payload: date
  }
}

export const setStartDate = date => {
  return {
    type: SET_START_DATE,
    payload: date
  }
}

import { SET_START_DATE, SET_END_DATE } from '../actionType'
const dateOffset = 24 * 60 * 60 * 1000 * 10

const start = new Date()
const end = new Date()

start.setTime(end.getTime() - dateOffset)

const initState = {
  start_date: start,
  end_date: end
}

const dateReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_START_DATE:
      return {
        ...state,
        start_date: action.payload
      }

    case SET_END_DATE:
      return {
        ...state,
        end_date: action.payload
      }

    default:
      return state
  }
}

export default dateReducer

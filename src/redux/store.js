import { dateReducer, callbackCountReducer, userReducer, planReducer } from './reducers'
import { combineReducers, createStore } from 'redux'

export const store = createStore(
  combineReducers({
    date: dateReducer,
    callbackCount: callbackCountReducer,
    user: userReducer,
    plan: planReducer
  })
)

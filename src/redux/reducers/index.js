import { combineReducers } from 'redux'
import { gameReducer } from './game'

export const rootReducer = combineReducers({
    game: gameReducer
})
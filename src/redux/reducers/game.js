let init = {
    owner:0,
    config:{}
}

export const gameReducer = (state = init, action) => {
    switch(action.type){
        case 'updateConfig':
            return {...state, config:action.payload}
        case 'updateGame':
            return {...state, config:action.payload.config, owner:action.payload.owner}
        case 'updateCurrentButton':
            return {...state, config:{...config, currentButton:action.payload}}
        case 'restoreGame':
            return {owner:0,config:{}}
        default:
            return state
    }
}
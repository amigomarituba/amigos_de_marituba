import { legacy_createStore as createStore } from 'redux'
import { instanceAxios } from './config/api'

function SessionValidat() {
  let user = JSON.parse(localStorage.getItem('@user'))

  if (user){
    instanceAxios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
  }

  return user
}

const initialState = {
  sidebarShow: true,
  theme: 'dark',
  user:SessionValidat()
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)

export default store

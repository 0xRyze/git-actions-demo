import { Provider } from 'react-redux'

import store from './index'

const StateProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default StateProvider

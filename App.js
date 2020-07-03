import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import Router from './src/pages/router'
import reducers from './src/reducers/reducers'

export default class App extends React.Component {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))
    console.disableYellowBox = true
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}

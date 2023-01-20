import React from 'react'
import {Provider} from 'react-redux'
import {createRoot} from 'react-dom/client'
import {store} from './store/store'
import App from './App'
import './index.scss'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <App/>
  </Provider>
)

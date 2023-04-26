import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.scss'

console.log('%c ❤ The strongest will win. Good luck!', 'color: lime')
const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App/>)

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { store } from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
export const history = createBrowserHistory()

root.render(
  <>
    <Provider store={store}>
      <React.StrictMode>
        <BrowserRouter history={history}>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </Provider>
  </>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button, Result } from 'antd'
import './App.css'
import Overview from './page/overview'

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Overview />} />
        <Route
          path="*"
          element={
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={
                <Button href="/" type="primary">
                  Back Home
                </Button>
              }
            />
          }
        />
      </Routes>
    </>
  )
}

export default App

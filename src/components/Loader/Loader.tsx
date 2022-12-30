import React from 'react'
// @ts-ignore
import { createUseStyles } from 'react-jss'
import { Spin } from 'antd'

const styles = createUseStyles({
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
    zIndex: 9999,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const Loader = () => {
  const classes = styles()

  return (
    <div className={classes.wrapper}>
      <Spin size={'large'} />
    </div>
  )
}
export default Loader

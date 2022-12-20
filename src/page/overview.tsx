import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'

const styles = createUseStyles({
  overviewBlock: {
    margin: '0 auto',
    padding: '20px',
  },
  overviewTitle: {
    color: 'black',
  },
})

const Overview = () => {
  const classes = styles()

  return (
    <div className={classes.overviewBlock}>
      <div className={classes.overviewTitle}>Accounts</div>
    </div>
  )
}

export default Overview

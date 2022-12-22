import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import TableOverview from 'src/components/TableOverview/tableOverview'
const styles = createUseStyles({
  overviewBlock: {
    margin: '0 auto',
    padding: '20px',
  },
  overviewTitle: {
    color: 'black',
  },
  overviewTableBlock: {
    cursor: 'default',
  },
})

const Overview = () => {
  const classes = styles()

  return (
    <div className={classes.overviewBlock}>
      <h1 className={classes.overviewTitle}>Orbiter One Liquidator</h1>
      <div className={classes.overviewTableBlock}>
        <TableOverview />
      </div>
    </div>
  )
}

export default Overview

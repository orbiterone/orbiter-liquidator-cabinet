import React from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import TableOverview from 'src/components/TableOverview/tableOverview'
import Loader from '../components/Loader/Loader'
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
  loadingWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
})

const Overview = () => {
  const classes = styles()
  const loading = useSelector((state: any) => state.loadingReducer)

  return (
    <>
      {loading.loading && <Loader />}
      <div className={classes.overviewBlock}>
        <h1 className={classes.overviewTitle}>Orbiter One Liquidator</h1>
        <div className={classes.overviewTableBlock}>
          <TableOverview />
        </div>
      </div>
    </>
  )
}

export default Overview

import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from 'antd'
import Loader from '../components/Loader/Loader'
import { useSelector } from 'react-redux'
const styles = createUseStyles({
  button: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
})
interface Props {
  connectWallet: (type: string) => void
  switchNetwork: () => void
  chainId: number
}
const NotConnected: React.FC<Props> = ({ connectWallet }) => {
  const classes = styles()
  const loading = useSelector((state: any) => state.loadingReducer)
  return (
    <>
      {loading.loading && <Loader />}
      <div className={classes.button}>
        <Button
          size="large"
          type="primary"
          onClick={() => {
            connectWallet('metamask')
          }}
        >
          Connect Wallet
        </Button>
      </div>
    </>
  )
}

export default NotConnected

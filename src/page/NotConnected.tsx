import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from 'antd'
import Loader from '../components/Loader/Loader'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '../redux/loading'

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
  userAdress: string
  CHAIN_ID: number
}
const NotConnected: React.FC<Props> = ({
  connectWallet,
  userAdress,
  chainId,
  CHAIN_ID,
}) => {
  const classes = styles()
  const loading = useSelector((state: any) => state.loadingReducer)
  const dispatch = useDispatch()
  if (userAdress && chainId !== CHAIN_ID) {
    dispatch(setLoading(false))
  }
  return (
    <>
      {/*{loading.loading && <Loader />}*/}
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

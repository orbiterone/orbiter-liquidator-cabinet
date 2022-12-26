import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from 'antd'
const styles = createUseStyles({
  button: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
})

const CHAIN_ID = +process.env.REACT_APP_X_ORBITER_CHAIN_ID
interface Props {
  connectWallet: (type: string) => void
  switchNetwork: () => void
  chainId: number
}
const NotConnected: React.FC<Props> = ({
  connectWallet,
  switchNetwork,
  chainId,
}) => {
  const classes = styles()
  console.log(CHAIN_ID, chainId)
  return (
    <div className={classes.button}>
      {/*{chainId !== CHAIN_ID ?*/}
      {/*    <Button*/}
      {/*        size="large"*/}
      {/*        type="primary"*/}
      {/*        onClick={() => {*/}
      {/*            console.log(1)*/}
      {/*            switchNetwork()*/}
      {/*        }}*/}
      {/*    >Switch Network</Button> :*/}
      <Button
        size="large"
        type="primary"
        onClick={() => {
          connectWallet('metamask')
        }}
      >
        Connect Wallet
      </Button>
      {/*}*/}
    </div>
  )
}

export default NotConnected

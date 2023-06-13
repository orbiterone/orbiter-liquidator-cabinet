import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button, Result } from 'antd'
import './App.css'
import Overview from './page/overview'
import Borrower from './page/borrower'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import NotConnected from './page/NotConnected'

const CHAIN_ID = +process.env.REACT_APP_X_ORBITER_CHAIN_ID

const WalletType = {
  metamask: 'metamask',
  walletconnect: 'walletconnect',
}

let provider = {
  [WalletType.metamask]: undefined, // required, not null
  [WalletType.walletconnect]: undefined, // required, not null
}

let web3 = Web3

function App() {
  const [user, setUser] = useState({
    address: null,
    addressShort: null,
    chainId: null,
    connected: false,
  })

  useEffect(() => {
    connectWallet('metamask')
  }, [])

  const createProviderMetamask = async (force = true) => {
    return new Promise(async (resolve, reject) => {
      try {
        switch (true) {
          case provider[WalletType.metamask] === undefined:
          case provider[WalletType.metamask] === null:
            provider[WalletType.metamask] =
              'ethereum' in window ? window['ethereum'] : Web3.givenProvider
            break
          default:
        }

        web3 = new Web3(provider[WalletType.metamask])

        if ('enable' in web3.currentProvider) {
          await web3.currentProvider.enable()
        }
      } catch (error) {
        if (!error.code) {
          window.open(
            'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
            '_blank'
          )
        }
        return reject(null)
      }

      try {
        await getWalletData(WalletType.metamask)

        provider[WalletType.metamask].removeAllListeners('accountsChanged')
        provider[WalletType.metamask].removeAllListeners('chainChanged')
        provider[WalletType.metamask].removeAllListeners('disconnect')

        provider[WalletType.metamask].on('accountsChanged', async () => {
          await getWalletData(WalletType.metamask)
        })
        provider[WalletType.metamask].on('chainChanged', (chainId) => {
          setUser((user) => ({
            ...user,
            chainId: web3.utils.hexToNumber(chainId),
          }))
        })

        provider[WalletType.metamask].on('disconnect', () => {
          removeWalletData()
          removeWalletType()
        })

        return resolve(null)
      } catch (error) {
        console.error('Internal JSON-RPC error')

        return reject(null)
      }
    })
  }

  const createProviderWalletConnect = async (force = true) => {
    return new Promise(async (resolve, reject) => {
      try {
        switch (true) {
          case force:
            localStorage.removeItem(WalletType.walletconnect)
          case !provider[WalletType.walletconnect]:
          case !provider[WalletType.walletconnect].connected:
            provider[WalletType.walletconnect] = await new Web3Modal({
              disableInjectedProvider: true,
              cacheProvider: false,
              providerOptions: {
                [WalletType.walletconnect]: {
                  package: WalletConnectProvider,
                  options: {
                    // network: 'Moonbase Alpha',
                    rpc: {
                      [CHAIN_ID]:
                        CHAIN_ID === 1287
                          ? 'https://rpc.api.moonbase.moonbeam.network/'
                          : 'https://1rpc.io/glmr',
                    },
                    chainId: CHAIN_ID,
                  },
                },
              },
            }).connectTo(WalletType.walletconnect)

            break
          default:
        }

        web3 = new Web3(provider[WalletType.walletconnect])

        let chainId = null
        try {
          chainId = await web3.eth.net.getId()
        } catch (error) {
          console.error(error)
        }

        if (chainId !== CHAIN_ID) {
          console.error("You're connected to the wrong network")
        }

        if ('enable' in web3.currentProvider) {
          await web3.currentProvider.enable()
        }

        await getWalletData(WalletType.walletconnect)

        provider[WalletType.walletconnect].removeAllListeners('accountsChanged')
        provider[WalletType.walletconnect].removeAllListeners('chainChanged')
        provider[WalletType.walletconnect].removeAllListeners('disconnect')

        provider[WalletType.walletconnect].on('accountsChanged', async () => {
          await getWalletData(WalletType.walletconnect)
        })

        provider[WalletType.walletconnect].on('chainChanged', (chainId) => {
          setUser({ chainId: web3.utils.hexToNumber(chainId) })
        })

        provider[WalletType.walletconnect].on('disconnect', () => {
          removeWalletData()
          removeWalletType()
        })

        return resolve(null)
      } catch (error) {
        return reject(null)
      }
    })
  }

  const getWalletData = async (walletType) => {
    const [wallet] = await web3.eth.getAccounts()
    if (!wallet) {
      return await removeWalletData()
    }

    let chainId = null
    try {
      chainId = await web3.eth.net.getId()
    } catch (error) {
      console.error(error)
    }

    // Set Wallet type
    setWalletType(walletType)

    // Set Wallet address
    setUser({
      address: wallet,
      addressShort: `${wallet.substr(0, 5)}...${wallet.substr(
        wallet.length - 4
      )}`,
      chainId,
    })

    return true
  }

  const switchNetwork = async () => {
    const connectedWalletType = getWalletType()

    try {
      await provider[WalletType[connectedWalletType]]
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(CHAIN_ID) }],
        })
        .catch(() => {
          throw { code: 4902 }
        })
    } catch (err) {
      if (err.code === 4902) {
        await provider[WalletType[connectedWalletType]].request({
          method: 'wallet_addEthereumChain',
          params:
            CHAIN_ID === 1287
              ? [
                  {
                    chainName: 'Moonbase Alpha',
                    chainId: web3.utils.toHex(CHAIN_ID),
                    nativeCurrency: {
                      name: 'DEV',
                      decimals: 18,
                      symbol: 'DEV',
                    },
                    rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
                    blockExplorerUrls: ['https://moonbase.moonscan.io/'],
                  },
                ]
              : [
                  {
                    chainName: 'Moonbeam',
                    chainId: 1284,
                    nativeCurrency: {
                      name: 'GLMR',
                      decimals: 18,
                      symbol: 'GLMR',
                    },
                    rpcUrls: ['https://rpc.api.moonbeam.network'],
                    blockExplorerUrls: ['https://moonbeam.moonscan.io/'],
                  },
                ],
        })
      }
    }
  }

  const removeWalletData = async () => {
    // Remove Wallet type
    removeWalletType()
    localStorage.removeItem('walletconnect')

    // Reset Wallet address
    setUser({
      address: null,
      addressShort: null,
      chainId: null,
      connected: false,
    })

    return true
  }

  const getWalletType = () => {
    return localStorage.getItem('wallet-type')
  }

  const setWalletType = (walletType) => {
    localStorage.setItem('wallet-type', walletType)
  }

  const removeWalletType = () => {
    localStorage.removeItem('wallet-type')
  }

  const connectWallet = async (walletType, force = true) => {
    if (walletType === 'metamask') {
      try {
        await createProviderMetamask(force)
      } catch (error) {
        return null
      }

      return null
    }

    if (walletType === 'walletconnect') {
      try {
        await createProviderWalletConnect(force)
      } catch (error) {
        return null
      }

      return null
    }
  }

  const handleConnectWallet = (type) => {
    connectWallet(type).then(() => {
      if (user.chainId !== CHAIN_ID) {
        switchNetwork()
      }
    })
  }

  return (
    <>
      {user && user.address && user.chainId === CHAIN_ID ? (
        <Routes>
          <Route
            path="/borrower/:userAddress"
            element={<Borrower web3={web3} user={user} />}
          />
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
      ) : (
        <NotConnected
          connectWallet={handleConnectWallet}
          chainId={user.chainId}
          userAdress={user.address}
          switchNetwork={switchNetwork}
          CHAIN_ID={CHAIN_ID}
        />
      )}
    </>
  )
}

export default App

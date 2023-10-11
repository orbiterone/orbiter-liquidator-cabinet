import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useNavigate, useParams } from 'react-router-dom'
import { Table, Button, Tag, Tooltip, notification } from 'antd'
import { fromBn, toBn } from 'evm-bn'
import erc20Abi from '../contracts/erc20Abi.abi'
import cEthAbi from '../contracts/cEthAbi.abi'
import cErcAbi from '../contracts/cErcAbi.abi'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { request } from '../factory/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserAssets } from '../redux/userAssets'
import { transform } from '../factory/bigNumber'
import Input from 'antd/es/input/Input'
import { commify } from '../utils'
import Loader from '../components/Loader/Loader'
import bigDecimal from 'js-big-decimal'
const styles = createUseStyles({
  overviewBlock: {
    margin: '0 auto',
    padding: '20px',
  },
  overviewTitle: {
    color: 'black',
  },
  total: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 100,
    marginTop: 10,
    marginBottom: 10,
    color: '#000000E0',
    fontSize: '16px',
    lineHeight: '18px',
  },
  overviewTableBlock: {},
  textWrapper: {
    paddingBottom: 10,
    gap: 5,
    display: 'flex',
    alignItems: 'center',
  },
  positionWrapper: {
    display: 'contents',
  },
  blockWrapper: {
    display: 'flex',
    padding: [20, 0],
  },
  bottomMenuWrapper: {
    gap: 20,
    paddingTop: 30,
    justifyContent: 'end',
    display: 'flex',
  },
  hr: {
    backgroundColor: '#A8A8B2',
    width: 1,
    height: 16,
  },
  repayButton: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'start',
  },
  bottomMenuInfo: {
    color: '#00000094',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  bottomMenuInfoUSD: {
    color: '#00000094',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
  },
  bottomMenuOperationWrapper: {
    display: 'flex',
    width: 416,
  },
  addressLink: {
    textDecorationLine: 'none',
    cursor: 'pointer',
    color: '#000000E0',
    '&:active': {
      textDecoration: 'none',
    },
    '&:hover': {
      textDecorationLine: 'underline',
      color: '#000000E0',
    },
  },
  tableText: {
    cursor: 'default',
  },
})

const Borrower = ({ user, web3 }: any) => {
  const [health, setHealth] = useState<any>({
    coefficient: null,
    percentage: null,
  })
  const [coped, setCoped] = useState<any>(false)
  const [tokenBalance, setTokenBalance] = useState<any>(null)
  const [suppliedToken, setSuppliedToken] = useState<any>(null)
  const [borrowedToken, setBorrowedToken] = useState<any>(null)
  const [borrowedCheckbox, setBorrowedCheckbox] = useState<any>(false)
  const [suppliedCheckbox, setSuppliedCheckbox] = useState<any>(false)
  const [locked, setLocked] = useState<any>(false)
  const [inputValue, setInputValue] = useState<any>('')
  const [totalBorrowed, setTotalBorrowed] = useState<any>('')
  const [totalSupplied, setTotalSuplied] = useState<any>('')

  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()

  const { supplied, borrowed } = useSelector(
    (state: any) => state.userAssetsReducer
  )
  const { chain } = useSelector((state) => state.appChainReducer)

  const { tableParams } = useSelector((state: any) => state.tableParamsReducer)
  const loading = useSelector((state: any) => state.loadingReducer)

  const { userAddress } = useParams()
  const dispatch = useDispatch()
  const openNotification = (
    message: string,
    description: string,
    type: string
  ) => {
    switch (type) {
      case 'info':
        api.info({
          message,
          description,
          placement: 'top',
          duration: 15,
        })
        break
      case 'success':
        api.success({
          message,
          description,
          placement: 'top',
          duration: 15,
        })
        break
      case 'error':
        api.error({
          message,
          description,
          placement: 'top',
          duration: 15,
        })
        break
    }
  }

  const disable = !!suppliedToken && !!borrowedToken

  // @ts-ignore
  const zeroInInput = !(inputValue.replace(/[\s,]/g, '') == 0)

  const closeFactor = 0.5

  const maxToRepay = () => {
    const maxToRepayUSD =
      borrowedToken?.value * borrowedToken?.token.lastPrice * closeFactor

    const maxBorrowedUsd = suppliedToken?.token.lastPrice * suppliedToken?.value

    return maxBorrowedUsd > maxToRepayUSD ? maxToRepayUSD : maxBorrowedUsd * 0.9
  }

  useEffect(() => {
    setSuppliedToken(null)
    setBorrowedToken(null)
    setSuppliedCheckbox(false)
    setBorrowedCheckbox(false)
    request({
      method: 'get',
      path: `assets/${userAddress}`,
    }).then((res) => {
      dispatch(setUserAssets(res.data.data))
      setTotalBorrowed(res.data.data.totalBorrowUSD)
      setTotalSuplied(res.data.data.totalSupplyUSD)
    })
    request({
      method: 'get',
      path: `users/${userAddress}`,
    }).then((res) => {
      setHealth(res.data.data.positionHealth)
      if (
        res.data.data.positionHealth.coefficient > 0.985 ||
        res.data.data.totalBorrowed -
          (1.1 / 100) * res.data.data.totalBorrowed <=
          res.data.data.totalColateral
      ) {
        setLocked(true)
      }
    })
  }, [user.address])

  useEffect(() => {
    setInputValue('')
  }, [suppliedToken, borrowedToken])

  const classes = styles()

  const setChecked = (value: any, type: any) => {
    switch (type) {
      case 'borrowed': {
        if (value.symbol === borrowedCheckbox.symbol) {
          return borrowedCheckbox.checked
        }
        break
      }

      case 'supplied': {
        if (value.symbol === suppliedCheckbox.symbol) {
          return suppliedCheckbox.checked
        }
        break
      }
      case 'delete': {
        setSuppliedToken(null)
        setBorrowedToken(null)
        setBorrowedCheckbox({ symbol: null, checked: false })
        setSuppliedCheckbox({ symbol: null, checked: false })
        return false
      }
    }
  }
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      width: '10%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '50%',
      render: (text: string) => (
        <a
          className={classes.addressLink}
          target="_blank"
          href={`${chain.chainData.blockExplorerUrls[0]}address/${text}`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Supplied',
      dataIndex: 'supplied',
      key: 'supplied',
      width: '10%',
      render: (value: string) => (
        <Tooltip title={transform(value, 25)}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Supplied, $',
      dataIndex: 'suppliedUSD',
      key: 'suppliedUSD',
      render: (value: string) => (
        <Tooltip title={transform(value, 25)}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (value: any) => (
        <input
          disabled={calcState() === 'risky' || locked}
          type="radio"
          name="suppliedRadio"
          checked={setChecked(value, 'supplied')}
          onChange={() => handleSuppliedApprove(value.item)}
        />
      ),
    },
  ]
  const columnsBorrowed = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      width: '10%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '50%',
      render: (text: string) => (
        <a
          className={classes.addressLink}
          target="_blank"
          href={`${chain.chainData.blockExplorerUrls[0]}address/${text}`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Borrowed',
      dataIndex: 'borrowed',
      key: 'borrowed',
      width: '10%',
      render: (value: string) => (
        <Tooltip title={transform(value, 25)}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Borrowed, $',
      dataIndex: 'borrowedUSD',
      key: 'borrowedUSD',
      render: (value: string) => (
        <Tooltip title={transform(value, 25)}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '10%',

      render: (value: any) => {
        return (
          <input
            disabled={calcState() === 'risky' || locked}
            type="radio"
            name="borrowedRadio"
            checked={setChecked(value, 'borrowed')}
            onChange={() => handleBorrowedApprove(value.item)}
          />
        )
      },
    },
  ]

  const handleCopy = () => {
    setCoped(true)
    navigator.clipboard.writeText(userAddress ?? '')
    setTimeout(() => {
      setCoped(false)
    }, 2000)
  }

  const calcState = (item = health.coefficient) => {
    let state = ''

    let health = item
    if (health <= 0.985) {
      state = 'unsafe'
    } else if (health > 0.98 && health <= 1.25) {
      state = 'risky'
    } else {
      state = 'safe'
    }
    return state
  }

  const defineContracts = async (asset: any, isMainToken: any) => {
    const tokenContract = new web3.eth.Contract(
      erc20Abi,
      asset.token.tokenAddress
    )

    const marketContract = new web3.eth.Contract(
      isMainToken ? cEthAbi : cErcAbi,
      asset.token.oTokenAddress
    )

    return {
      tokenContract,
      marketContract,
    }
  }

  const approve = async (asset: any, value: any, tokenContract: any) => {
    openNotification(
      'Approval needed',
      `You need to grant access to your ${asset.token.symbol} funds to Orbiter One Liquidator before completing your payment. Confirm the fund approval in your wallet.`,
      'info'
    )
    try {
      let gasPrice = await web3.eth.getGasPrice()

      gasPrice = +gasPrice
      gasPrice += gasPrice

      let gasLimit = await tokenContract.methods
        .approve(
          asset.token.oTokenAddress,
          toBn(`${value}`, asset.token.tokenDecimal).toString()
        )
        .estimateGas({
          from: user.address,
        })

      gasLimit = +gasLimit
      gasLimit += gasLimit

      const result = await tokenContract.methods
        .approve(
          asset.token.oTokenAddress,
          toBn(`${99999}`, asset.token.tokenDecimal).toString()
        )
        .send({
          from: user.address,
          gasLimit: web3.utils.toHex(Math.round(gasLimit)),
          gasPrice: web3.utils.toHex(Math.round(gasPrice)),
        })
        .on(
          'transactionHash',
          (hash: string) =>
            hash &&
            openNotification(
              'Approval submitted',
              `You submitted your approval to grant Orbiter One Liquidator access to your ${asset.token.symbol} funds. This process might take a few minutes to complete.`,
              'info'
            )
        )
      openNotification(
        'You have given Orbiter One Liquidator access to your funds',
        'Complete your transaction in your wallet.',
        'success'
      )
      console.log('approve:', result)
    } catch (error) {
      openNotification(
        'Denied the transaction',
        'You denied the transaction request in your wallet. Please resubmit your transaction.',
        'error'
      )
      console.log(error)
    }
  }

  const liquidateBorrow = async (
    asset: any,
    value: any,
    tokenContract: any,
    borrowedAsset: any
  ) => {
    let result
    openNotification(
      'Payment in progress',
      'Your payment is in progress; this process might take a couple of minutes. Please confirm your payment in your wallet.',
      'info'
    )
    try {
      if (!borrowedAsset.token.tokenAddress) {
        let gasPrice = await web3.eth.getGasPrice()

        gasPrice = +gasPrice
        gasPrice += gasPrice

        let gasLimit = await tokenContract.methods
          .liquidateBorrow(userAddress, asset.token.oTokenAddress)
          .estimateGas({
            from: user.address,
          })

        gasLimit = +gasLimit
        gasLimit += gasLimit

        result = await tokenContract.methods
          .liquidateBorrow(userAddress, asset.token.oTokenAddress)
          .send({
            from: user.address,
            gasLimit: web3.utils.toHex(Math.round(gasLimit)),
            gasPrice: web3.utils.toHex(Math.round(gasPrice)),
            value: toBn(
              `${value}`,
              borrowedAsset.token.tokenDecimal
            ).toString(),
          })
          .on(
            'transactionHash',
            (hash: string) =>
              hash &&
              openNotification(
                'Payment in progress',
                'Your payment has been submitted. Your payment might take a couple of minutes to complete',
                'info'
              )
          )
      } else {
        let gasPrice = await web3.eth.getGasPrice()

        gasPrice = +gasPrice
        gasPrice += gasPrice

        let gasLimit = await tokenContract.methods
          .liquidateBorrow(
            userAddress,
            toBn(`${value}`, borrowedAsset.token.tokenDecimal).toString(),
            asset.token.oTokenAddress
          )
          .estimateGas({
            from: user.address,
          })

        gasLimit = +gasLimit
        gasLimit += gasLimit

        result = await tokenContract.methods
          .liquidateBorrow(
            userAddress,
            toBn(`${value}`, borrowedAsset.token.tokenDecimal).toString(),
            asset.token.oTokenAddress
          )
          .send({
            gasLimit: web3.utils.toHex(Math.round(gasLimit)),
            gasPrice: web3.utils.toHex(Math.round(gasPrice)),
            from: user.address,
          })
          .on(
            'transactionHash',
            (hash: string) =>
              hash &&
              openNotification(
                'Payment in progress',
                'Your payment has been submitted. Your payment might take a couple of minutes to complete',
                'info'
              )
          )
      }
      setChecked(null, 'delete')
      request({
        method: 'get',
        path: `assets/${userAddress}`,
      }).then((res) => {
        dispatch(setUserAssets(res.data.data))
        setChecked(null, 'delete')
      })
      request({
        method: 'get',
        path: `users/${userAddress}`,
      }).then((res) => {
        setHealth(res.data.data.positionHealth)
        if (
          res.data.data.positionHealth.coefficient < 0.985 ||
          res.data.data.totalBorrowed -
            (1.1 / 100) * res.data.data.totalBorrowed <=
            res.data.data.totalColateral
        ) {
          setLocked(true)
        }
      })
      setBorrowedToken(null)
      setSuppliedToken(null)
      openNotification(
        'Success',
        'Your repayment is complete and your balances have been updated.',
        'success'
      )
      console.log('liquidate:', result)
    } catch (error) {
      openNotification(
        'Denied the transaction',
        'You denied the transaction request in your wallet. Please resubmit your transaction.',
        'error'
      )
      console.log(error)
    }
  }

  const getTokenBalance = async (
    tokenContract: any,
    asset: any,
    isMainToken: any
  ) => {
    try {
      let result

      if (isMainToken) {
        result = await web3.eth.getBalance(user.address)
      } else {
        result = await tokenContract.methods.balanceOf(user.address).call()
      }

      setTokenBalance(fromBn(result, asset.token.tokenDecimal).toString())
    } catch (error) {
      console.log(error)
    }
  }

  const handleBorrowedApprove = async (value: any) => {
    const { tokenContract } = await defineContracts(
      value,
      !value.token.tokenAddress
    )
    getTokenBalance(tokenContract, value, !value.token.tokenAddress)
    setBorrowedToken(value)
    setBorrowedCheckbox({ symbol: value.token.symbol, checked: true })
  }

  const handleSuppliedApprove = async (value: any) => {
    setSuppliedToken(value)
    setSuppliedCheckbox({ symbol: value.token.symbol, checked: true })
  }

  const handleRepay = async () => {
    const value = inputValue.replace(/[\s,]/g, '')
    const asset = borrowedToken
    const suppliedAsset = suppliedToken
    const { tokenContract, marketContract } = await defineContracts(
      asset,
      !asset.token.tokenAddress
    )
    if (asset.token.tokenAddress) {
      await approve(asset, value, tokenContract)
    }

    await liquidateBorrow(suppliedAsset, value, marketContract, asset)
    await getTokenBalance(tokenContract, asset, !asset.token.tokenAddress)
    setInputValue('')
  }

  const setMaxInInput = () => {
    const balanceInUSD = tokenBalance * borrowedToken?.token.lastPrice
    const maxToInput = maxToRepay() > balanceInUSD ? balanceInUSD : maxToRepay()
    const maxToInputToken = maxToInput / borrowedToken?.token.lastPrice

    setInputValue(commify(bigDecimal.multiply(maxToInputToken, 1)))
  }

  const disableRepayButton =
    disable &&
    +inputValue.replace(/[\s,]/g, '') <=
      maxToRepay() / borrowedToken?.token.lastPrice &&
    zeroInInput

  return (
    <>
      {loading.loading && <Loader />}
      {contextHolder}
      <div className={classes.overviewBlock}>
        <Button
          style={{ marginBottom: 10 }}
          onClick={() =>
            navigate({ pathname: `/`, search: `?page=${tableParams.current}` })
          }
        >
          Back
        </Button>
        <div className={classes.textWrapper}>
          <div className={classes.overviewTitle}>Address:</div>
          <div className={classes.overviewTitle}>{userAddress}</div>
          <Button
            type="default"
            icon={coped ? <CheckOutlined /> : <CopyOutlined />}
            onClick={() => handleCopy()}
            size={'small'}
          />
        </div>
        <div className={classes.textWrapper}>
          <div>Position Health:</div>
          <div className={classes.positionWrapper}>
            <div>{transform(health.coefficient, 2)}</div>
            <div className={classes.hr}></div>
            <div>
              {health.percentage > 100 ? 100 : transform(health.percentage, 2)}%
            </div>
          </div>
        </div>
        <div className={classes.textWrapper}>
          <div>State status:</div>
          <div>
            <Tag
              color={
                calcState() === 'safe'
                  ? 'green'
                  : calcState() === 'unsafe'
                  ? 'red'
                  : 'orange'
              }
            >
              {calcState()}
            </Tag>
          </div>
        </div>
        <div className={classes.blockWrapper}>
          Choose an asset to collect at 10% discount:
        </div>
        <Table
          columns={columns}
          pagination={false}
          size="small"
          dataSource={supplied}
        />
        <div className={classes.total}>
          Total Supplied, $: {transform(totalSupplied, 4)}
        </div>
        <div className={classes.blockWrapper}>
          Choose a different asset to repay on behalf of borrower to return
          their Account Health to under to 100:
        </div>
        <Table
          size="small"
          columns={columnsBorrowed}
          pagination={false}
          dataSource={borrowed}
        />
        <div className={classes.total}>
          Total Borrowed, $: {transform(totalBorrowed, 4)}
        </div>
        <div className={classes.bottomMenuWrapper}>
          <div>
            <div className={classes.bottomMenuOperationWrapper}>
              <Input.Group compact>
                <Input
                  style={{
                    width: '250px',
                  }}
                  disabled={!disable}
                  placeholder={`Enter ${borrowedToken?.token.symbol} amount`}
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(
                      `${commify(
                        `${e.target.value
                          .replace(/[^0-9.]/g, '')
                          .replace(/(\..*)\./g, '$1')}`
                      )}`
                    )
                  }
                />
                <Button
                  type="primary"
                  disabled={!disable}
                  onClick={() => setMaxInInput()}
                >
                  Set Max
                </Button>
              </Input.Group>
              <div className={classes.repayButton}>
                <Button
                  disabled={!disableRepayButton}
                  size="middle"
                  type="primary"
                  onClick={() => handleRepay()}
                >
                  Repay
                </Button>
              </div>
            </div>

            <div>
              <div className={classes.bottomMenuInfo}>
                Your balance, {borrowedToken?.token.symbol}:{' '}
                <Tooltip
                  placement="topRight"
                  title={transform(tokenBalance, 25)}
                >
                  {transform(tokenBalance)}
                </Tooltip>
              </div>
              <Tooltip
                placement="topRight"
                className={classes.bottomMenuInfoUSD}
                title={transform(
                  borrowedToken?.token.lastPrice * tokenBalance,
                  25
                )}
              >
                ~${transform(borrowedToken?.token.lastPrice * tokenBalance)}
              </Tooltip>
              <div className={classes.bottomMenuInfo}>
                Max available to repay, {borrowedToken?.token.symbol}:{' '}
                <Tooltip
                  placement="topRight"
                  title={transform(
                    maxToRepay() / borrowedToken?.token.lastPrice,
                    25
                  )}
                >
                  {transform(maxToRepay() / borrowedToken?.token.lastPrice)}
                </Tooltip>
              </div>
              <Tooltip
                placement="topRight"
                className={classes.bottomMenuInfoUSD}
                title={transform(maxToRepay(), 25)}
              >
                ~${suppliedToken ? transform(maxToRepay().toString()) : 0}
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Borrower

import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import { Table, Button, Tag, Tooltip } from 'antd'
import { fromBn, toBn } from 'evm-bn'
import erc20Abi from '../contracts/erc20Abi.abi'
import cEthAbi from '../contracts/cEthAbi.abi'
import cErcAbi from '../contracts/cErcAbi.abi'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { request } from '../factory/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserAssets } from '../redux/userAssets'
import { transform } from '../factory/bigNumber'
import BigNumber from 'bignumber.js'
import Input from 'antd/es/input/Input'
import { commify } from '../utils'
const styles = createUseStyles({
  overviewBlock: {
    margin: '0 auto',
    padding: '20px',
  },
  overviewTitle: {
    color: 'black',
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
    justifyContent: 'end',
    alignItems: 'end',
  },
})

const Borrower = ({ user, web3 }: any) => {
  const [healse, setHealse] = useState({ coefficient: null, percentage: null })
  const [coped, setCoped] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(null)
  const [suppliedToken, setSuppliedToken] = useState(null)
  const [borrowedToken, setBorrowedToken] = useState(null)
  const [totalBorrow, setTotalBorrow] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const disable = !!suppliedToken && !!borrowedToken

  const zeroInInput = !(inputValue.replace(/[\s,]/g, '') == 0)

  const disableRepayButton =
    disable && +inputValue.replace(/[\s,]/g, '') <= tokenBalance && zeroInInput

  const closeFactor = 0.33

  const maxToRepayUSD = totalBorrow * closeFactor

  const maxSuppliedUsd = suppliedToken?.token.lastPrice * suppliedToken?.value

  const maxToRepay = () => {
    return maxSuppliedUsd > maxToRepayUSD ? maxToRepayUSD : maxSuppliedUsd
  }

  const { supplied, borrowed } = useSelector(
    (state: any) => state.userAssetsReducer
  )

  const { userAddress } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    request({
      method: 'get',
      path: `assets/${userAddress}`,
    }).then((res) => dispatch(setUserAssets(res.data.data)))
    request({
      method: 'get',
      path: `users/${userAddress}`,
    }).then((res) => {
      setTotalBorrow(res.data.data.totalBorrowed)
      setHealse(res.data.data.positionHealth)
    })
  }, [])

  const classes = styles()

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <a
          target="_blank"
          href={`https://moonbase.moonscan.io/address/${text}`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Supplied',
      dataIndex: 'supplied',
      key: 'supplied',
      render: (value: string) => (
        <Tooltip title={value}>
          <span>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Supplied, $',
      dataIndex: 'suppliedUSD',
      key: 'suppliedUSD',
      render: (value: string) => (
        <Tooltip title={value}>
          <span>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '10%',

      render: (value: any) => (
        <input
          type="radio"
          name="suppliedRadio"
          onChange={() => heandleSuppliedApprove(value.item)}
        />
      ),
    },
  ]
  const columnsBorrowed = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <a
          target="_blank"
          href={`https://moonbase.moonscan.io/address/${text}`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Borrowed',
      dataIndex: 'borrowed',
      key: 'borrowed',
      render: (value: string) => (
        <Tooltip title={value}>
          <span>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Borrowed, $',
      dataIndex: 'borrowedUSD',
      key: 'borrowedUSD',
      render: (value: string) => (
        <Tooltip title={value}>
          <span>{transform(value)}</span>
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
            type="radio"
            name="borrowedRadio"
            onChange={() => heandleBorrowedApprove(value.item)}
          />
        )
      },
    },
  ]
  const formatter = (value: number) => `${value}null%`

  const handleCopy = () => {
    setCoped(true)
    navigator.clipboard.writeText(userAddress ?? '')
    setTimeout(() => {
      setCoped(false)
    }, 2000)
  }

  const calcState = (item = healse.coefficient) => {
    let state = ''

    let health = item
    if (health < 1) {
      state = 'unsafe'
    } else if (health <= 1.05) {
      state = 'risky'
    } else {
      state = 'safe'
    }
    return state
  }

  const defineContracts = async (asset, isMainToken) => {
    const tokenContract = new web3.eth.Contract(
      erc20Abi,
      asset.token.tokenAddress
    )
    // setTokenContract(tokenContract)

    const marketContract = new web3.eth.Contract(
      isMainToken ? cEthAbi : cErcAbi,
      asset.oTokenAddress
    )
    // setMarketContract(marketContract)
    return {
      tokenContract,
      marketContract,
    }
  }

  const approve = async (asset: any, value: any, tokenContract: any) => {
    try {
      const result = await tokenContract.methods
        .approve(
          asset.token.oTokenAddress,
          toBn(`${value}`, asset.token.tokenDecimal).toString()
        )
        .send({ from: user.address })

      console.log('approve:', result)
    } catch (error) {
      console.log(error)
    }
  }

  const liquidateBorrow = async (asset: any, tokenContract) => {
    try {
      const result = await tokenContract.methods
        .liquidateBorrow(
          asset.token.oTokenAddress,
          toBn(`${asset.value}`, asset.token.tokenDecimal).toString()
        )
        .send({
          from: user.address,
        })

      console.log('approve:', result)
    } catch (error) {
      console.log(error)
    }
  }

  const getTokenBalance = async (tokenContract, asset) => {
    try {
      let result
      result = await tokenContract.methods.balanceOf(user.address).call()

      setTokenBalance(fromBn(result, asset.token.tokenDecimal).toString())
    } catch (error) {
      console.log(error)
    }
  }

  const heandleBorrowedApprove = async (value) => {
    const { tokenContract, marketContract } = await defineContracts(
      value,
      !value.token.tokenAddress
    )
    getTokenBalance(tokenContract, value)
    setBorrowedToken(value)
  }

  const heandleSuppliedApprove = async (value) => {
    setSuppliedToken(value)
  }

  const heandleRepay = async () => {
    const value = inputValue.replace(/[\s,]/g, '')
    const asset = borrowedToken
    const { tokenContract, marketContract } = await defineContracts(
      asset,
      !asset.token.tokenAddress
    )
    await approve(asset, value, tokenContract)
  }

  const setMaxInInput = () => {
    setInputValue(
      commify((maxToRepay() / borrowedToken?.token.lastPrice).toString())
    )
  }

  // @ts-ignore
  return (
    <div className={classes.overviewBlock}>
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
          <div>{transform(healse.coefficient, 2)}</div>
          <div className={classes.hr}></div>
          <div>{transform(healse.percentage, 2)}%</div>
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
      <div className={classes.blockWrapper}>
        Choose a different asset to repay on behalf of borrower to return their
        Account Liquidity to 0:
      </div>
      <Table
        size="small"
        columns={columnsBorrowed}
        pagination={false}
        dataSource={borrowed}
      />
      <div className={classes.bottomMenuWrapper}>
        <div>
          <div>
            Your balance({borrowedToken?.token.symbol}):
            <Tooltip title={tokenBalance}>{transform(tokenBalance)}</Tooltip>
          </div>
          <Tooltip title={borrowedToken?.token.lastPrice * tokenBalance}>
            ~${transform(borrowedToken?.token.lastPrice * tokenBalance)}
          </Tooltip>
          <div>
            Max available to repay({borrowedToken?.token.symbol}):{' '}
            <Tooltip title={maxToRepay() / borrowedToken?.token.lastPrice}>
              {transform(maxToRepay() / borrowedToken?.token.lastPrice)}
            </Tooltip>
          </div>
          <Tooltip title={maxToRepay()}>
            ~${transform(maxToRepay().toString())}
          </Tooltip>
          <Input.Group compact>
            <Input
              style={{
                width: '200px',
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
        </div>
        <div className={classes.repayButton}>
          <Button
            disabled={!disableRepayButton}
            size="middle"
            type="primary"
            onClick={() => heandleRepay()}
          >
            Repay
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Borrower

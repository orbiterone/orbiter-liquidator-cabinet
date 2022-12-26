import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import { Table, Button, Slider, Tag } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { request } from '../factory/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserAssets } from '../redux/userAssets'
import { transform } from '../factory/bigNumber'
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
})

const Borrower = () => {
  const [healse, setHealse] = useState({ coefficient: null, percentage: null })
  const [coped, setCoped] = useState(false)

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
    }).then((res) => setHealse(res.data.data.positionHealth))
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
    },
    {
      title: '',
      key: 'action',
      width: '10%',

      render: (value: any) => (
        <input
          type="radio"
          name="tableRadio"
          onChange={() => console.log(value)}
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
      dataIndex: 'supplied',
      key: 'supplied',
    },
    {
      title: '',
      key: 'action',
      width: '10%',

      render: (value: any) => (
        <Button size="small" type="primary" onClick={() => console.log(value)}>
          Approve
        </Button>
      ),
    },
  ]
  const formatter = (value: number) => `${value}%`

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
        Choose an asset to collect at "get from the backend" discount:
      </div>
      <Table columns={columns} pagination={false} dataSource={supplied} />
      <div className={classes.blockWrapper}>
        Choose a different asset to repay on behalf of borrower to return their
        Account Liquidity to 0:
      </div>
      <Table
        columns={columnsBorrowed}
        pagination={false}
        dataSource={borrowed}
      />
      <div className={classes.bottomMenuWrapper}>
        <Slider max={33} tooltip={{ formatter }} style={{ width: 300 }} />
        <Button size="middle" type="primary" onClick={() => console.log(1)}>
          Repay
        </Button>
      </div>
    </div>
  )
}

export default Borrower

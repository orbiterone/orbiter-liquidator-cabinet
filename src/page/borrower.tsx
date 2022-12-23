import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import { Table } from 'antd/lib'
import { Button, Slider, Tag } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
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
  const classes = styles()
  const { userAddress } = useParams()
  const data = [
    {
      key: '1',
      symbol: 'cETH',
      address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
      supplied: '0',
    },
    {
      key: '2',
      symbol: 'cDAI',
      address: '0xf5dce57282a584d2746faf1593d3121fcac444dc',
      supplied: '0',
    },
    {
      key: '3',
      symbol: 'cUSDC',
      address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
      supplied: '0',
    },
    {
      key: '4',
      symbol: 'cBAT',
      address: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
      supplied: '0',
    },
    {
      key: '5',
      symbol: 'cREP',
      address: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
      supplied: '0',
    },
    {
      key: '6',
      symbol: 'cZRX',
      address: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
      supplied: '0',
    },
  ]

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
        <a target="_blank" href={`https://etherscan.io/address/${text}`}>
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
        <Button size="small" type="primary" onClick={() => console.log(value)}>
          Approve
        </Button>
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
        <a target="_blank" href={`https://etherscan.io/address/${text}`}>
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
  const [coped, setCoped] = useState(false)

  const handleCopy = () => {
    setCoped(true)
    navigator.clipboard.writeText(userAddress)
    setTimeout(() => {
      setCoped(false)
    }, 2000)
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
          <div>1</div>
          <div className={classes.hr}></div>
          <div>100%</div>
        </div>
      </div>
      <div className={classes.textWrapper}>
        <div>State status:</div>
        <div>
          <Tag color={'green'}>Safe</Tag>
        </div>
      </div>
      <div className={classes.blockWrapper}>
        Choose an asset to collect at "get from the backend" discount:
      </div>
      <Table columns={columns} pagination={false} dataSource={data} />
      <div className={classes.blockWrapper}>
        Choose a different asset to repay on behalf of borrower to return their
        Account Liquidity to 0:
      </div>
      <Table columns={columnsBorrowed} pagination={false} dataSource={data} />
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

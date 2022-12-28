import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import { request } from '../../factory/axios'
import { setOverview } from 'src/redux/overview'
import type { TablePaginationConfig } from 'antd/es/table'
import { transform } from '../../factory/bigNumber'

interface TableParams {
  pagination?: TablePaginationConfig
}

const styles = createUseStyles({
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

const TableOverview = () => {
  const classes = styles()
  const navigate = useNavigate()
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

  const { overview } = useSelector((state: any) => state.overviewReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    request({
      method: 'get',
      path: `users?page=${tableParams.pagination?.current}`,
    }).then((res) => dispatch(setOverview(res.data.data)))
  }, [tableParams.pagination?.current])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    })
  }

  const calcState = (item: any) => {
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
  const columns = [
    {
      title: 'Borrower address',
      dataIndex: 'address',
      width: '30%',
      ellipsis: true,
      render: (value: string) => (
        <a
          className={classes.addressLink}
          href={`https://moonbase.moonscan.io/address/${value}`}
          target="_blank"
        >
          {value}
        </a>
      ),
    },
    {
      title: 'Supply,$',
      dataIndex: 'totalSupplyUSD',
      sorter: (a: any, b: any) => a.totalSupplyUSD - b.totalSupplyUSD,
      defaultSortOrder: 'descend',
      render: (value: string) => (
        <Tooltip title={value}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Borrow,$',
      dataIndex: 'totalBorrowUSD',
      sorter: (a: any, b: any) => a.totalBorrowUSD - b.totalBorrowUSD,
      render: (value: string) => (
        <Tooltip title={value}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Health coefficient',
      dataIndex: 'health',
      sorter: (a: any, b: any) => a.health - b.health,
      render: (value: string) => (
        <Tooltip title={value}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'State',
      dataIndex: 'health',
      width: '10%',
      filters: [
        { text: 'Safe', value: 'safe' },
        { text: 'Unsafe', value: 'unsafe' },
        { text: 'Risky', value: 'risky' },
      ],
      onFilter: (value: string, record: any) =>
        calcState(record.health).indexOf(value) === 0,
      render: (value: string, record: any) => (
        <span className={classes.tableText}>
          <Tag
            color={
              calcState(value) === 'safe'
                ? 'green'
                : calcState(value) === 'unsafe'
                ? 'red'
                : 'orange'
            }
          >
            {calcState(value)}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',

      render: (value: any) => (
        <Button
          size="small"
          type="primary"
          onClick={() => {
            navigate(`/borrower/${value.address}`)
          }}
        >
          Inspect
        </Button>
      ),
    },
  ]

  return (
    <Table
      // @ts-ignore
      columns={columns}
      dataSource={overview.entities}
      pagination={{
        pageSize: 10,
        position: ['bottomCenter'],
        total: overview.countItem,
      }}
      onChange={handleTableChange}
      size="small"
    />
  )
}
export default TableOverview

import React, { useEffect } from 'react'
import { Table, Button, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import { request } from '../../factory/axios'
import { setOverview } from 'src/redux/overview'
import type { TablePaginationConfig } from 'antd/es/table'
import { transform } from '../../factory/bigNumber'
import { setTableParams } from 'src/redux/tableParams'
import Loader from '../Loader/Loader'
import { setLoading } from '../../redux/loading'
import { useSearchParams } from 'react-router-dom'

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
  const [searchParams] = useSearchParams()

  const { overview } = useSelector((state: any) => state.overviewReducer)
  const loading = useSelector((state: any) => state.loadingReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    request({
      method: 'get',
      path: `users?page=${searchParams.get('page') || 1}`,
    }).then((res) => {
      dispatch(setOverview(res.data.data))
    })
  }, [searchParams.get('page')])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    navigate({ pathname: `/`, search: `?page=${pagination.current}` })
    dispatch(setTableParams({ current: pagination.current }))
  }

  const calcState = (item: any) => {
    let state = ''

    let health = item
    if (health <= 0.98) {
      state = 'unsafe'
    } else if (health > 0.98 && health <= 1.25) {
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
    <>
      {loading.loading && <Loader />}
      <Table
        // @ts-ignore
        columns={columns}
        dataSource={overview.entities}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          total: overview.countItem,
          current: +searchParams.get('page') || 1,
        }}
        onChange={handleTableChange}
        size="small"
      />
    </>
  )
}
export default TableOverview

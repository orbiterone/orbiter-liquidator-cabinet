import React, {useEffect, useState, useRef} from 'react'
import { Table, Button, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import { request } from '../../factory/axios'
import { setOverview } from 'src/redux/overview'
import type { TablePaginationConfig } from 'antd/es/table'
import { transform } from '../../factory/bigNumber'
import tableParams, { setTableParams } from 'src/redux/tableParams'
import Loader from '../Loader/Loader'
import { setLoading } from '../../redux/loading'
import { useSearchParams } from 'react-router-dom'
import {FilterValue, SorterResult} from "antd/es/table/interface";

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

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const TableOverview = () => {
  const classes = styles()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { chain } = useSelector((state) => state.appChainReducer)

  const { overview } = useSelector((state: any) => state.overviewReducer)
  const { tableParams } = useSelector((state: any) => state.tableParamsReducer)
  const loading = useSelector((state: any) => state.loadingReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    request({
      method: 'get',
      path: `users?page=${searchParams.get('page') || 1}${getParams(tableParams)}`,
    }).then((res) => {
      dispatch(setOverview(res.data.data))
    })
  }, [searchParams.get('page'), tableParams])

  const paramsName = (tableParamsOrder: string) => {
    if (tableParamsOrder === 'descend') {
      return 'asc'
    }
    if (tableParamsOrder === 'ascend') {
      return 'desc'
    }
    return ''
  }
  const getParams = (tableParams) => {
    if (tableParams.order && tableParams.filters?.health?.length) {
      return `&sort=${tableParams.field}&order=${paramsName(tableParams.order)}&state=${tableParams.filters.health.map((el) => `${el}`)}`
    }
    if (tableParams.order) {
      return `&sort=${tableParams.field}&order=${paramsName(tableParams.order)}`
    }
    if (tableParams.filters?.health?.length) {
      return `&state=${tableParams.filters.health.map((el) => `${el}`)}`
    }
    return ''
  }

  const handleTableChange = (pagination: TablePaginationConfig,
                             filters: Record<string, FilterValue>,
                             sorter: SorterResult<any>) => {
    navigate({ pathname: `/`, search: `?page=${pagination.current}` })
    dispatch(
    setTableParams({
      current: pagination.current,
      filters,
      ...sorter,
    }))
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
          href={`${chain.chainData.blockExplorerUrls[0]}address/${value}`}
          target="_blank"
        >
          {value}
        </a>
      ),
    },
    {
      title: 'Supply,$',
      dataIndex: 'totalSupplyUSD',
      sorter: true,
      render: (value: string) => (
        <Tooltip title={transform(value, 6)}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Borrow,$',
      dataIndex: 'totalBorrowUSD',
      sorter: true,
      render: (value: string) => (
        <Tooltip title={transform(value, 6)}>
          <span className={classes.tableText}>{transform(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Health coefficient',
      dataIndex: 'health',
      sorter: true,
      filterMultiple: false,
      // sorter: (a: any, b, sortOrder) => {
      //   console.log(sortOrder, 'sortOrder', sortedBy.current.order, 'sortedBy.current.order')
      //   sortedBy.current = {
      //     column: 'health',
      //     order: sortOrder === sortedBy.current.order ? '' : sortOrder
      //   }
      // },
      render: (value: string) => (
        <Tooltip title={transform(value, 6)}>
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

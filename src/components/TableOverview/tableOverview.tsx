import React, { useEffect, useState } from 'react'
import { Table, Button, Tag } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'

const columns = [
  {
    title: 'Borrower address',
    dataIndex: 'address',
    width: '30%',
    ellipsis: true,
  },
  {
    title: 'Supply,$',
    dataIndex: 'supply',
    sorter: (a: any, b: any) => a.supply - b.supply,
    defaultSortOrder: 'descend',
    ellipsis: true,
  },
  {
    title: 'Borrow,$',
    dataIndex: 'borrow',
    sorter: (a: any, b: any) => a.borrow - b.borrow,
    ellipsis: true,
  },
  {
    title: 'Health coefficient',
    dataIndex: 'health',
    sorter: (a: any, b: any) => a.health - b.health,
    ellipsis: true,
  },
  {
    title: 'State',
    dataIndex: 'state',
    width: '10%',
    filters: [
      { text: 'Safe', value: 'safe' },
      { text: 'Unsafe', value: 'unsafe' },
    ],
    onFilter: (value: string, record: any) => record.state.indexOf(value) === 0,
    render: (value: string, record: any) => (
      <Tag color={record.state === 'safe' ? 'green' : 'red'}>
        {record.state}
      </Tag>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    width: '10%',

    render: () => (
      <Button size="small" type="primary">
        Inspect
      </Button>
    ),
  },
]

const data = [
  {
    key: '1',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.18583572501447295635485017',
    borrow: '0.185835',
    health: '1.94342803232',
    state: 'safe',
  },
  {
    key: '2',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '1.185835',
    borrow: '1.185835',
    health: '4.94342803232',
    state: 'unsafe',
  },
  {
    key: '3',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.185835',
    borrow: '0.185835',
    health: '1.94342803232',
    state: 'unsafe',
  },
  {
    key: '4',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.185835',
    borrow: '1.085835',
    health: '1.94342803232',
    state: 'safe',
  },
  {
    key: '5',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.165835',
    borrow: '1.085835',
    health: '1.94342803232',
    state: 'safe',
  },
  {
    key: '6',
    address: '0xdd9edbc0adb53b01e97aa0fadd0e7c21f467cad8',
    supply: '0.385835',
    borrow: '1.285835',
    health: '1.94642803232',
    state: 'safe',
  },
  {
    key: '7',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '4.185835',
    borrow: '1.023835',
    health: '0.94342803232',
    state: 'safe',
  },
  {
    key: '8',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.165835',
    borrow: '1.085235',
    health: '1.64341812432',
    state: 'safe',
  },
  {
    key: '9',
    address: '0xdd9edbc0adb53b01e97aa0fadd0e7c21f467cad8',
    supply: '0.115835',
    borrow: '4.085835',
    health: '1.034342803232',
    state: 'unsafe',
  },
  {
    key: '10',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.134835',
    borrow: '7.155835',
    health: '1.61342803232',
    state: 'unsafe',
  },
  {
    key: '11',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '5.185835',
    borrow: '5.583835',
    health: '1.94342803232',
    state: 'safe',
  },
  {
    key: '12',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.875835',
    borrow: '1.085835',
    health: '1.28542803232',
    state: 'safe',
  },
  {
    key: '13',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.185335',
    borrow: '2.085835',
    health: '1.94342803032',
    state: 'safe',
  },
  {
    key: '14',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '1.185801',
    borrow: '1.085835',
    health: '1.94342403232',
    state: 'safe',
  },
  {
    key: '15',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '0.245835',
    borrow: '6.45835',
    health: '1.04342803232',
    state: 'safe',
  },
  {
    key: '16',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '3.043805',
    borrow: '3.170834',
    health: '1.34322803012',
    state: 'unsafe',
  },
  {
    key: '17',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '3.043835',
    borrow: '3.170835',
    health: '2.05342803012',
    state: 'unsafe',
  },
  {
    key: '18',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '3.043835',
    borrow: '3.170835',
    health: '1.20342803012',
    state: 'unsafe',
  },
  {
    key: '19',
    address: '0x0da42477E781bf656e9967c4e87b057b0843d999',
    supply: '3.048835',
    borrow: '3.143835',
    health: '1.94316803012',
    state: 'safe',
  },
]

const TableOverview = () => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 15, position: ['bottomCenter'] }}
      size="small"
    />
  )
}
export default TableOverview

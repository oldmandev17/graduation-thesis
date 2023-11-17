import useDebounce from 'hooks/useDebounce'
import { IOrder, OrderStatus } from 'modules/order'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from 'utils/auth'

function Order() {
  const [orders, setOrders] = useState<Array<IOrder>>([])
  const date = new Date()
  const [startDay, setStartDay] = useState<Date>(date)
  const [endDay, setEndDay] = useState<Date>(date)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [code, setCode] = useState<string>('')
  const codeDebounce = useDebounce(code, 500)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const navigate = useNavigate()
  const { accessToken } = getToken()

  const getAllOrders = useCallback(async () => {}, [])

  useEffect(() => {
    getAllOrders()
  }, [getAllOrders])

  const handleCheckAll = () => {
    document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').forEach((input) => {
      const checkedAll = document.querySelector<HTMLInputElement>('input[id=checkbox-all-search]')
      // eslint-disable-next-line no-param-reassign
      input.checked = checkedAll?.checked as boolean
    })
  }

  const getCheckedInputIds = () => {
    const checkedIds: string[] = []

    document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').forEach((input) => {
      if (input.checked) {
        checkedIds.push(input.id)
      }
    })

    return checkedIds
  }

  const handleCheckElement = () => {
    const checkedAll = document.querySelector<HTMLInputElement>('input[id=checkbox-all-search]')
    if (checkedAll) {
      if (
        getCheckedInputIds().length ===
        document.querySelectorAll<HTMLInputElement>('input[name=checkbox-table-search]').length
      ) {
        checkedAll.checked = true
      } else {
        checkedAll.checked = false
      }
    }
  }

  const handleSort = (sortByField: string) => {
    setSortBy(sortByField)
    if (sortByField === sortBy) {
      setOrderBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderBy('desc')
    }
  }

  const columns = [{ header: 'Name', key: 'name', width: 30 }]

  const handleUpdateStatus = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (getCheckedInputIds().length < 1) {
      toast.warning('Select a row to edit, please.')
    } else {
      console.log(event)
    }
  }

  return <div className='flex flex-col gap-5'>Order</div>
}

export default Order

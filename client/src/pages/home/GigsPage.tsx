/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ClickAwayListener, Divider, Grow, Paper, Popper } from '@mui/material'
import { getCategoryDetailBySlug } from 'apis/api'
import { SortFilter, arrDeliveryTimeFilter, arrSortFilter } from 'assets/data'
import ModalCustom from 'components/common/ModalCustom'
import { ICategory } from 'modules/category'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { IoHomeOutline } from 'react-icons/io5'
import { MdExpandMore, MdSlowMotionVideo } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

function GigsPage() {
  const { slug, keyword } = useParams<{ slug?: string; keyword?: string }>()
  const [category, setCategory] = useState<ICategory>()
  const [parentCategory, setParentCategory] = useState<ICategory>()
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openBudget, setOpenBudget] = useState<boolean>(false)
  const [openDeliveryTime, setOpenDeliveryTime] = useState<boolean>(false)
  const [openSort, setOpenSort] = useState<boolean>(false)
  const anchorRefDeliveryTime = useRef<HTMLButtonElement>(null)
  const anchorRefBudget = useRef<HTMLButtonElement>(null)
  const anchorRefSort = useRef<HTMLButtonElement>(null)
  const [budget, setBudget] = useState<number | null>(null)
  const [deliveryTime, setDeliveryTime] = useState<number | null>()
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortFilter>(SortFilter.BEST_SELLING)
  const handleToggleDeliveryTime = () => {
    setOpenDeliveryTime((prevOpenDeliveryTime) => !prevOpenDeliveryTime)
  }
  const handleToggleBudget = () => {
    setOpenBudget((prevOpenBudget) => !prevOpenBudget)
  }
  const handleToggleSort = () => {
    setOpenSort((prevOpenSort) => !prevOpenSort)
  }
  const handleCloseDeliveryTime = (event: Event | React.SyntheticEvent) => {
    if (anchorRefDeliveryTime.current && anchorRefDeliveryTime.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpenDeliveryTime(false)
  }
  const handleCloseBudget = (event: Event | React.SyntheticEvent) => {
    if (anchorRefBudget.current && anchorRefBudget.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpenBudget(false)
  }
  const handleCloseSort = (event: Event | React.SyntheticEvent) => {
    if (anchorRefSort.current && anchorRefSort.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpenSort(false)
  }
  const prevOpenDeliveryTime = useRef(openDeliveryTime)
  const prevOpenBudget = useRef(openBudget)
  const prevOpenSort = useRef(openSort)
  useEffect(() => {
    if (prevOpenDeliveryTime.current === true && openDeliveryTime === false) {
      anchorRefDeliveryTime.current!.focus()
    }
    prevOpenDeliveryTime.current = openDeliveryTime
  }, [openDeliveryTime])
  useEffect(() => {
    if (prevOpenBudget.current === true && openBudget === false) {
      anchorRefBudget.current!.focus()
    }
    prevOpenBudget.current = openBudget
  }, [openBudget])
  useEffect(() => {
    if (prevOpenSort.current === true && openSort === false) {
      anchorRefSort.current!.focus()
    }
    prevOpenSort.current = openSort
  }, [openSort])

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(Number(event.target.value))
  }

  const getCategoryDetails = useCallback(async () => {
    await getCategoryDetailBySlug(slug)
      .then((response) => {
        if (response.status === 200) {
          setCategory(response.data.category)
          setParentCategory(response.data.parentCategory)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [slug])

  useEffect(() => {
    if (slug) {
      getCategoryDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCategoryDetailBySlug])

  return (
    <div className='flex flex-col gap-8 py-10 px-28'>
      {slug ? (
        <>
          <div id='path' className='flex flex-row gap-2 mb-3'>
            <IoHomeOutline className='w-5 h-5 cursor-pointer' onClick={() => navigate('/')} />
            <span className='text-sm font-semibold text-gray-400'>/</span>
            <span className='text-base cursor-pointer' onClick={() => navigate(`/category/${parentCategory?.slug}`)}>
              {parentCategory?.name}
            </span>
          </div>
          <div id='gig_title' className='flex flex-col gap-3'>
            <h4 className='text-2xl font-bold text-gray-700'>{category?.name}</h4>
            <div className='flex gap-3'>
              <p className='text-base font-semibold text-gray-600'>{category?.description}</p>
              <span className='text-sm font-semibold text-gray-400'>|</span>
              <button
                type='button'
                className='flex justify-center items-center gap-1'
                onClick={() => setOpenModal(true)}
              >
                <MdSlowMotionVideo className='h-6 w-6' /> How Fiverr Works
              </button>
            </div>
            <ModalCustom onCancel={() => {}} open={openModal} setOpen={setOpenModal}>
              <video className='w-full' autoPlay muted controls>
                <source src='/how_fiverr_works.mp4' type='video/mp4' />
              </video>
            </ModalCustom>
          </div>
        </>
      ) : (
        <h4 className='text-2xl text-gray-700'>
          Result for <span className='font-bold'>{keyword}</span>
        </h4>
      )}
      <div className='flex flex-col gap-3 sticky'>
        <div className='flex gap-5'>
          <button
            type='button'
            className={`border ${
              budget !== null ? 'border-black' : 'border-gray-300'
            } p-3 flex gap-3 hover:border-black`}
            onClick={handleToggleBudget}
          >
            Budget <MdExpandMore className={`transition-all duration-300 ${openBudget && 'rotate-180'}`} />
          </button>
          <Popper
            open={openBudget}
            anchorEl={anchorRefBudget.current}
            role={undefined}
            placement='bottom-start'
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                }}
              >
                <Paper className='!rounded-xl'>
                  <ClickAwayListener onClickAway={handleCloseBudget}>
                    <div className='p-3'>
                      <input
                        type='text'
                        id='budget'
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 d'
                        placeholder='Enter Budget'
                      />
                      <Divider />
                      <div className='flex gap-10 items-center'>
                        <button
                          onClick={(event: any) => {
                            setBudget(null)
                            handleCloseBudget(event)
                          }}
                          type='button'
                          className='text-lg font-semibold text-gray-600 hover:text-gray-700'
                        >
                          Clear All
                        </button>
                        <button
                          type='button'
                          onClick={(event: any) => {
                            const budgetElement = document.getElementById('budget') as HTMLInputElement
                            setBudget(Number(budgetElement.value))
                            handleCloseBudget(event)
                          }}
                          className='p-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-950'
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <button
            type='button'
            className={`border ${
              deliveryTime !== null ? 'border-black' : 'border-gray-300'
            } p-3 flex gap-3 hover:border-black`}
            onClick={handleToggleDeliveryTime}
          >
            Delivery Time <MdExpandMore className={`transition-all duration-300 ${openDeliveryTime && 'rotate-180'}`} />
          </button>
          <Popper
            open={openDeliveryTime}
            anchorEl={anchorRefDeliveryTime.current}
            role={undefined}
            placement='bottom-start'
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                }}
              >
                <Paper className='!rounded-xl'>
                  <ClickAwayListener onClickAway={handleCloseDeliveryTime}>
                    <div className='p-3'>
                      <div className='flex flex-col gap-4'>
                        {arrDeliveryTimeFilter.length > 0 &&
                          arrDeliveryTimeFilter.map((time, index) => (
                            <div key={index} className='flex items-center'>
                              <input
                                checked={selectedValue === time.value}
                                id={time.label}
                                type='radio'
                                value={String(time.value)}
                                name='delivery-time-radio'
                                onChange={handleRadioChange}
                                className='w-4 h-4 text-black bg-transparent border-gray-600 '
                              />
                              <label
                                htmlFor={time.label}
                                className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                              >
                                {time.label}
                              </label>
                            </div>
                          ))}
                      </div>
                      <Divider />
                      <div className='flex gap-10 items-center'>
                        <button
                          onClick={(event: any) => {
                            setDeliveryTime(null)
                            handleCloseDeliveryTime(event)
                          }}
                          type='button'
                          className='text-lg font-semibold text-gray-600 hover:text-gray-700'
                        >
                          Clear All
                        </button>
                        <button
                          onClick={(event: any) => {
                            setDeliveryTime(Number(selectedValue))
                            handleCloseDeliveryTime(event)
                          }}
                          type='button'
                          className='p-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-950'
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <div className='flex gap-5'>
          {budget !== null && (
            <span
              id='badge-dismiss-dark'
              className='inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-gray-800 bg-gray-100 rounded'
            >
              Budget: ${budget}
              <button
                type='button'
                onClick={() => setBudget(null)}
                className='inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 '
                data-dismiss-target='#badge-dismiss-dark'
                aria-label='Remove'
              >
                <svg
                  className='w-2 h-2'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </button>
            </span>
          )}
          {deliveryTime !== null && (
            <span
              id='badge-dismiss-dark'
              className='inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-gray-800 bg-gray-100 rounded'
            >
              {arrDeliveryTimeFilter.filter((time) => time.value === deliveryTime)[0].label}
              <button
                type='button'
                onClick={() => setDeliveryTime(null)}
                className='inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 '
                data-dismiss-target='#badge-dismiss-dark'
                aria-label='Remove'
              >
                <svg
                  className='w-2 h-2'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
              </button>
            </span>
          )}
        </div>
      </div>
      <Divider />
      <div className='flex flex-col gap-4'>
        <div className='flex w-full justify-between items-center'>
          <p className='text-base font-semibold text-gray-600'>260,205 services available</p>
          <div className='flex justify-center items-center gap-3'>
            <span className='text-lg text-gray-600'>Sort By</span>
            <button type='button' className='p-2 flex gap-3 hover:bg-gray-50' onClick={handleToggleSort}>
              {arrSortFilter.filter((sort) => sort.value === sortBy)[0].label}
              <MdExpandMore className={`transition-all duration-300 ${openSort && 'rotate-180'}`} />
            </button>
            <Popper
              open={openSort}
              anchorEl={anchorRefSort.current}
              role={undefined}
              placement='bottom-start'
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                  }}
                >
                  <Paper className='!rounded-xl'>
                    <ClickAwayListener onClickAway={handleCloseSort}>
                      <div className='p-3 flex flex-col gap-2'>
                        {arrSortFilter.length > 0 &&
                          arrSortFilter.map((sort, index) => (
                            <button
                              onClick={() => setSortBy(sort.value)}
                              type='button'
                              key={index}
                              className='flex p-2 gap-5 justify-between items-center'
                            >
                              {sortBy === sort.value && <FaCheck className='w-6 h-6' />} {sort.label}
                            </button>
                          ))}
                      </div>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GigsPage

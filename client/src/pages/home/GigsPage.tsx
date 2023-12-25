/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ClickAwayListener, Divider, Grow, Paper, Popper } from '@mui/material'
import { getAllGigFilter, getCategoryDetailBySlug } from 'apis/api'
import { SortFilter, arrDeliveryTimeFilter, arrSortFilter } from 'assets/data'
import GigCard from 'components/common/GigCard'
import ModalCustom from 'components/common/ModalCustom'
import { ICategory } from 'modules/category'
import { GigStatus, IGig } from 'modules/gig'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaCheck } from 'react-icons/fa'
import { IoHomeOutline } from 'react-icons/io5'
import { MdExpandMore, MdSlowMotionVideo } from 'react-icons/md'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

function GigsPage() {
  const { slug } = useParams<{ slug?: string }>()
  const [search] = useSearchParams()
  const [keyword, setKeyword] = useState<string | null>()
  const [category, setCategory] = useState<ICategory | undefined>()
  const [parentCategory, setParentCategory] = useState<ICategory>()
  const navigate = useNavigate()
  const [gigs, setGigs] = useState<Array<IGig>>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openBudget, setOpenBudget] = useState<boolean>(false)
  const [openDeliveryTime, setOpenDeliveryTime] = useState<boolean>(false)
  const [openSort, setOpenSort] = useState<boolean>(false)
  const anchorRefDeliveryTime = useRef<HTMLButtonElement>(null)
  const anchorRefBudget = useRef<HTMLButtonElement>(null)
  const anchorRefSort = useRef<HTMLButtonElement>(null)
  const [budget, setBudget] = useState<number | null>(null)
  const [deliveryTime, setDeliveryTime] = useState<number>(-1)
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortFilter>(SortFilter.BEST_SELLING)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState<number>(1)

  const getAllGigFilters = useCallback(async () => {
    await getAllGigFilter(
      page,
      20,
      GigStatus.ACTIVE,
      search.get('keyword'),
      category?._id,
      budget,
      deliveryTime,
      sortBy
    )
      .then((response) => {
        if (response.status === 200) {
          setGigs(response.data.gigs)
          setCount(Math.ceil(response.data.filteredCount / 20))
          setFilteredCount(response.data.filteredCount)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [page, search, category, budget, deliveryTime, sortBy])

  useEffect(() => {
    getAllGigFilters()
  }, [getAllGigFilters])

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

  useEffect(() => {
    if (search && search.get('keyword')) {
      setKeyword(search.get('keyword'))
    }
  }, [search])

  const getCategoryDetails = useCallback(async () => {
    await getCategoryDetailBySlug(slug)
      .then((response) => {
        if (response.status === 200) {
          setCategory(response.data.category)
          setParentCategory(response.data.parentParentCategory)
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
  }, [getCategoryDetails])

  return (
    <>
      <Helmet>
        <title className='capitalize'>{`${
          keyword ? `Result For "${keyword}"` : `${category?.name} Service`
        } | Freelancer`}</title>
      </Helmet>
      <div className='flex flex-col gap-10 py-10 px-28'>
        {slug ? (
          <>
            <div id='path' className='flex flex-row gap-2'>
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
                  className='flex items-center justify-center gap-1'
                  onClick={() => setOpenModal(true)}
                >
                  <MdSlowMotionVideo className='w-6 h-6' /> How Freelancer Works
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
        <div className='sticky flex flex-col gap-3'>
          <div className='flex gap-5'>
            <button
              type='button'
              className={`border ${
                budget !== null ? 'border-black' : 'border-gray-300'
              } p-3 flex gap-3 hover:border-black`}
              ref={anchorRefBudget}
              aria-controls={openBudget ? 'budget-dropdown' : undefined}
              aria-expanded={openBudget ? 'true' : undefined}
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
                      <div className='flex flex-col gap-2 p-2'>
                        <input
                          type='text'
                          id='budget'
                          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 d'
                          placeholder='Enter Budget'
                        />
                        <Divider />
                        <div className='flex items-center gap-10'>
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
                            className='px-2 py-1 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-950'
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
              ref={anchorRefDeliveryTime}
              aria-controls={openDeliveryTime ? 'deliveryTime-dropdown' : undefined}
              aria-expanded={openDeliveryTime ? 'true' : undefined}
            >
              Delivery Time{' '}
              <MdExpandMore className={`transition-all duration-300 ${openDeliveryTime && 'rotate-180'}`} />
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
                      <div className='flex flex-col gap-2 p-2'>
                        <div className='flex flex-col gap-2'>
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
                                  className='text-sm font-medium text-gray-900 cursor-pointer ms-2'
                                >
                                  {time.label}
                                </label>
                              </div>
                            ))}
                        </div>
                        <Divider />
                        <div className='flex items-center gap-10'>
                          <button
                            onClick={(event: any) => {
                              setDeliveryTime(-1)
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
                            className='px-2 py-1 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-950'
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
                className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded me-2'
              >
                Budget: ${budget}
                <button
                  type='button'
                  onClick={() => setBudget(null)}
                  className='inline-flex items-center p-1 text-sm text-gray-400 bg-transparent rounded-sm ms-2 hover:bg-gray-200 hover:text-gray-900 '
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
            {deliveryTime !== -1 && (
              <span
                id='badge-dismiss-dark'
                className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded me-2'
              >
                {arrDeliveryTimeFilter.filter((time) => time.value === deliveryTime)[0]?.label}
                <button
                  type='button'
                  onClick={() => setDeliveryTime(-1)}
                  className='inline-flex items-center p-1 text-sm text-gray-400 bg-transparent rounded-sm ms-2 hover:bg-gray-200 hover:text-gray-900 '
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
          <div className='flex items-center justify-between w-full'>
            <p className='text-lg font-semibold text-gray-600'>
              {filteredCount.toLocaleString('en-US')} services available
            </p>
            <div className='flex items-center justify-center gap-3'>
              <span className='text-lg text-gray-600'>Sort By</span>
              <button
                type='button'
                className='flex gap-3 p-2 text-lg font-semibold hover:bg-gray-50'
                onClick={handleToggleSort}
                ref={anchorRefSort}
                aria-controls={openSort ? 'sort-dropdown' : undefined}
                aria-expanded={openSort ? 'true' : undefined}
              >
                {arrSortFilter.filter((sort) => sort.value === sortBy)[0].label}
                <MdExpandMore className={`transition-all duration-300 ${openSort && 'rotate-180'}`} />
              </button>
              <Popper
                open={openSort}
                anchorEl={anchorRefSort.current}
                role={undefined}
                placement='top-end'
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom-end' ? 'left top' : 'left bottom'
                    }}
                  >
                    <Paper className='!rounded-xl'>
                      <ClickAwayListener onClickAway={handleCloseSort}>
                        <div className='flex flex-col gap-2 p-3'>
                          {arrSortFilter.length > 0 &&
                            arrSortFilter.map((sort, index) => (
                              <button
                                onClick={(event: any) => {
                                  setSortBy(sort.value)
                                  handleCloseSort(event)
                                }}
                                type='button'
                                key={index}
                                className='flex items-center gap-5 px-2 py-1 text-lg font-semibold'
                              >
                                <span className='w-4 h-4'>
                                  {sortBy === sort.value && <FaCheck className='w-4 h-4' />}
                                </span>
                                {sort.label}
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
        <div className='grid grid-cols-4 gap-10'>
          {gigs.length > 0 &&
            gigs.map((gig, index) => <GigCard height={200} key={gig?._id + index} gig={gig} type='filter' />)}
        </div>
      </div>
    </>
  )
}

export default GigsPage

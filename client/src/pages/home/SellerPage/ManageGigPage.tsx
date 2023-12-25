/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { Fade, Menu, MenuItem } from '@mui/material'
import { getAllGigByUser, updateGigStatus } from 'apis/api'
import { arrGigStatus } from 'assets/data'
import GigStatusTag from 'components/common/GigStatusTag'
import { GigStatus, IGig } from 'modules/gig'
import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { IoIosArrowDown } from 'react-icons/io'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from 'stores/hooks'
import { getToken } from 'utils/auth'
import calculateTime from 'utils/calculateTime'

function Row({ gig, setReload }: { gig: IGig; setReload: any }) {
  const [anchorActionEl, setAnchorActionEl] = useState<null | HTMLElement>(null)
  const openAction = Boolean(anchorActionEl)
  const { accessToken } = getToken()
  const navigate = useNavigate()

  const handleClickAction = (event: MouseEvent<HTMLElement>) => {
    setAnchorActionEl(event.currentTarget)
  }
  const handleCloseAction = () => {
    setAnchorActionEl(null)
  }

  const handleUpdateGigStatus = async (status: GigStatus) => {
    await updateGigStatus([gig?._id], status, undefined, accessToken)
      .then((response) => {
        if (response.status === 200) {
          setReload((prev: boolean) => !prev)
          toast.success('Update Completed Successfully!')
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }

  return (
    <>
      <td className='p-4 text-sm font-medium text-gray-500'>{gig?.name}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{calculateTime(gig?.createdAt)}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{gig.orders ? gig.orders.length : 0}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{gig.reviews ? gig.reviews.length : 0}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>{gig?.reason}</td>
      <td className='p-4 text-sm font-medium text-gray-500'>
        <GigStatusTag status={gig?.status} />
      </td>
      <td>
        <button
          type='button'
          id='action'
          aria-controls={openAction ? 'fade-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={openAction ? 'true' : undefined}
          onClick={handleClickAction}
          className='px-2 py-1 border border-gray-300'
        >
          <IoIosArrowDown className='cursor-pointer' />
        </button>
        <Menu
          id='fade-menu'
          MenuListProps={{
            'aria-labelledby': 'action'
          }}
          anchorEl={anchorActionEl}
          open={openAction}
          onClose={handleCloseAction}
          TransitionComponent={Fade}
        >
          {gig.status === GigStatus.ACTIVE && (
            <MenuItem
              className='!pr-20 !py-2'
              onClick={() => {
                handleUpdateGigStatus(GigStatus.INACTIVE)
                handleCloseAction()
              }}
            >
              Hide
            </MenuItem>
          )}
          {gig.status === GigStatus.INACTIVE && (
            <MenuItem
              className='!pr-20 !py-2'
              onClick={() => {
                handleUpdateGigStatus(GigStatus.ACTIVE)
                handleCloseAction()
              }}
            >
              Show
            </MenuItem>
          )}
          {gig.status !== GigStatus.NONE && (
            <MenuItem
              className='!pr-20 !py-2'
              onClick={() => {
                navigate(`/user/${gig && gig.createdBy && gig.createdBy.id}/gig-detail/${gig._id}`)
                handleCloseAction()
              }}
            >
              View
            </MenuItem>
          )}
          <MenuItem
            className='!pr-20 !py-2'
            onClick={() => {
              navigate(`/user/${gig && gig.createdBy && gig.createdBy.id}/gig-create/${gig._id}/overview`)
              handleCloseAction()
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            className='!pr-20 !py-2'
            onClick={() => {
              handleUpdateGigStatus(GigStatus.DELETED)
              handleCloseAction()
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </td>
    </>
  )
}

function ManageGigPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [reload, setReload] = useState<boolean>(false)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { accessToken } = getToken()
  const [gigs, setGigs] = useState<Array<IGig>>([])
  const { user } = useAppSelector((state) => state.auth)
  const [status, setStatus] = useState<GigStatus | undefined>()
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [orderBy, setOrderBy] = useState<string>('desc')

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const getAllGigByUsers = useCallback(async () => {
    await getAllGigByUser(accessToken, status, sortBy, orderBy)
      .then((response) => {
        if (response.status === 200) {
          setGigs(response.data.gigs)
        }
      })
      .catch((error: any) => toast.error(error.response.data.error.message))
  }, [accessToken, status, sortBy, orderBy])

  useEffect(() => {
    getAllGigByUsers()
  }, [getAllGigByUsers, reload])

  const handleSort = (sortByField: string) => {
    setSortBy(sortByField)
    if (sortByField === sortBy) {
      setOrderBy((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderBy('desc')
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Gigs | Freelancer</title>
      </Helmet>
      <div className='flex flex-col h-screen gap-5 py-10 px-28'>
        <div className='flex flex-row justify-between'>
          <span className='text-4xl font-semibold text-gray-600'>Gigs</span>
          <button
            onClick={() => navigate(`/user/${user?.id}/gig-create/overview`)}
            type='button'
            className='bg-[#00b14f] text-lg font-bold text-white rounded-lg px-3 py-1 uppercase'
          >
            Create a new gig +
          </button>
        </div>
        <div>
          <table className='w-full my-5 bg-white'>
            <thead>
              <tr className='bg-gray-100 border border-gray-300'>
                <th className='py-5 text-base font-semibold text-gray-500'>NAME</th>
                <th
                  className='flex items-center justify-center gap-2 py-5 text-base font-semibold text-gray-500 cursor-pointer'
                  onClick={() => handleSort('createdAt')}
                >
                  CREATE AT
                  {sortBy === 'createdAt' &&
                    (orderBy === 'desc' ? (
                      <TiArrowSortedDown className='w-5 h-5' />
                    ) : (
                      <TiArrowSortedUp className='w-5 h-5' />
                    ))}
                </th>
                <th className='py-5 text-base font-semibold text-gray-500'>TOTAL ORDERS</th>
                <th className='py-5 text-base font-semibold text-gray-500'>TOTAL REVIEWS</th>
                <th className='py-5 text-base font-semibold text-gray-500 '>
                  REASON <span className='text-sm'>(Optional)</span>
                </th>
                <th>
                  <div className='flex flex-row items-center justify-center gap-2 font-semibold text-gray-500'>
                    <button
                      type='button'
                      id='filter'
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      className='flex items-center gap-2'
                    >
                      <span>
                        STATUS <span className='text-sm capitalize'>({status === undefined ? 'ALL' : status})</span>
                      </span>
                      <IoIosArrowDown className='cursor-pointer' />
                    </button>
                    <Menu
                      id='fade-menu'
                      MenuListProps={{
                        'aria-labelledby': 'filter'
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      TransitionComponent={Fade}
                    >
                      <MenuItem
                        className='!pr-20 !py-2'
                        onClick={() => {
                          setStatus(undefined)
                          handleClose()
                        }}
                      >
                        All
                      </MenuItem>
                      {arrGigStatus.length > 0 &&
                        arrGigStatus.map((sta, index) => (
                          <MenuItem
                            key={sta.label + index}
                            className='!pr-20 !py-2'
                            onClick={() => {
                              setStatus(sta.value)
                              handleClose()
                            }}
                          >
                            {sta.label}
                          </MenuItem>
                        ))}
                    </Menu>
                  </div>
                </th>
                <th className='py-5 text-base font-semibold text-gray-500'> </th>
              </tr>
            </thead>
            <tbody>
              {gigs.length > 0 &&
                gigs.map((gig, index) => (
                  <tr key={gig._id + index} className='p-3 text-center border-b border-gray-300 border-x'>
                    <Row gig={gig} setReload={setReload} />
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ManageGigPage

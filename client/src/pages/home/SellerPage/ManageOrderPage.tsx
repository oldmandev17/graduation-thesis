import { Fade, Menu, MenuItem } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { IoIosArrowDown } from 'react-icons/io'

function ManageOrderPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <Helmet>
        <title>Manage Sales | Freelancer</title>
      </Helmet>
      <div className='flex flex-col h-screen gap-5 py-10 px-28'>
        <div className='flex flex-row justify-between'>
          <span className='text-4xl font-semibold text-gray-600'>Manage Orders</span>
        </div>
        <div>
          <table className='w-full my-5 bg-white'>
            <thead>
              <tr className='border border-gray-300'>
                <th className='py-2 text-base font-semibold text-gray-400'>BUYER</th>
                <th className='text-base font-semibold text-gray-400'>GIG</th>
                <th className='text-base font-semibold text-gray-400'>DUE ON</th>
                <th className='text-base font-semibold text-gray-400'>TOTAL</th>
                <th className='text-base font-semibold text-gray-400'>NOTE</th>
                <th>
                  <div className='flex flex-row items-center justify-center gap-2 font-semibold text-gray-400'>
                    <span>STATUS</span>
                    <button
                      type='button'
                      id='filter'
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
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
                      <MenuItem className='!pr-20 !py-2' onClick={handleClose}>
                        All
                      </MenuItem>
                      <MenuItem className='!pr-20 !py-2' onClick={handleClose}>
                        PENDING
                      </MenuItem>
                      <MenuItem className='!pr-20  !py-2' onClick={handleClose}>
                        PAID
                      </MenuItem>
                      <MenuItem className='!pr-20  !py-2' onClick={handleClose}>
                        COMPLETE
                      </MenuItem>
                      <MenuItem className='!pr-20  !py-2' onClick={handleClose}>
                        CANCEL
                      </MenuItem>
                    </Menu>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='p-2 text-center border-b border-gray-300 border-x'>
                <td className='p-2 text-sm font-medium text-gray-500'>@nhattam107</td>
                <td className='p-2 text-sm font-medium text-gray-500'>12arf4gh</td>
                <td className='p-2 text-sm font-medium text-gray-500'>Jan 12 2024</td>
                <td className='p-2 text-sm font-medium text-gray-500'>1</td>
                <td className='p-2 text-sm font-medium text-gray-500'>Please contact me soon...</td>
                <td className='p-2 text-sm font-medium text-gray-500'>sending</td>
              </tr>
              <tr className='p-2 text-center border-b border-gray-300 border-x'>
                <td className='p-2 text-sm font-medium text-gray-500'>@nhattam107</td>
                <td className='p-2 text-sm font-medium text-gray-500'>12arf4gh</td>
                <td className='p-2 text-sm font-medium text-gray-500'>Jan 12 2024</td>
                <td className='p-2 text-sm font-medium text-gray-500'>1</td>
                <td className='p-2 text-sm font-medium text-gray-500'>Please contact me soon</td>
                <td className='p-2 text-sm font-medium text-gray-500'>sending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ManageOrderPage

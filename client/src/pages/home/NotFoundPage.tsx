/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { Divider } from '@mui/material'
import { getAllCategory } from 'apis/api'
import { ICategory } from 'modules/category'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function NotFoundPage() {
  const [keyword, setKeyword] = useState<string>('')
  const [categoriesLevel3, setCategoriesLevel3] = useState<Array<ICategory>>([])
  const navigate = useNavigate()

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
  }

  const handleSearchKeyword = (event: any) => {
    event.preventDefault()
    if (keyword) {
      navigate(`/search?keyword=${keyword.trim()}`)
    }
  }

  const getAllCategoriesLevel3 = useCallback(async () => {
    await getAllCategory(null, null, null, '', 'createdAt', 'asc', null, null, '', 3, undefined)
      .then((response) => {
        if (response.status === 200) {
          setCategoriesLevel3(response.data.categories)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [])

  useEffect(() => {
    getAllCategoriesLevel3()
  }, [getAllCategoriesLevel3])

  return (
    <>
      <Helmet>
        <title>Page Not Found | Freelancer</title>
      </Helmet>
      <div className='relative bg-cover'>
        <img alt='not found' src='/notFound.png' className='absolute top-0 right-0 z-0 object-cover w-full h-screen ' />
        <div className='absolute w-full h-screen gap-5 bg-gradient-to-r from-gray-900 z-5 opacity-80' />
        <div className='z-10 h-screen relative w-[650px] flex justify-center gap-10 flex-col ml-28'>
          <h1 className='text-5xl font-semibold leading-snug text-white'>Well, this isn't what you were looking for</h1>
          <Divider className='w-20 h-1 bg-white' />
          <div className='text-white'>
            <h4 className='text-3xl font-semibold'>But at least it's pretty</h4>
            <p className='text-xl'>Keep exploring</p>
          </div>
          <form onSubmit={handleSearchKeyword} className='flex align-middle'>
            <div className='relative'>
              <input
                onChange={handleChangeKeyword}
                type='text'
                className='h-14 w-[450px] pl-10 rounded-md rounded-r-none'
                placeholder={`Try "building mobile app"`}
              />
            </div>
            <button type='submit' className='bg-[#10BF73] text-white px-12 text-lg font-semibold rounded-r-md'>
              Search
            </button>
          </form>
          <div className='flex gap-4 text-white'>
            Popular:{' '}
            <ul className='flex gap-5'>
              {categoriesLevel3.length > 0 &&
                categoriesLevel3.slice(0, 4).map((category, index) => (
                  <li key={category._id + index}>
                    <button
                      onClick={() => navigate(`/sub-category/${category.slug}`)}
                      className='px-3 py-1 text-sm transition-all duration-300 border rounded-full cursor-pointer hover:bg-white hover:text-black'
                      type='button'
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage

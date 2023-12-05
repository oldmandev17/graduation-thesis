/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
import { getAllCategory } from 'apis/api'
import { ICategory } from 'modules/category'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function NavigationBar() {
  const navigate = useNavigate()
  const [id, setId] = useState<string>('')
  const [categories, setCategories] = useState<Array<ICategory>>([])

  const getAllCategories = useCallback(async () => {
    await getAllCategory(null, null, null, '', 'createdAt', 'asc', null, null, '', 1, undefined)
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data.categories)
        }
      })
      .catch((error: any) => {
        toast.error(error.response.data.error.message)
      })
  }, [])

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  return (
    <div className='mega-menu'>
      <nav>
        <ul className='flex flex-row justify-between w-full list-none border border-gray-100 border-y-2 px-28'>
          {categories.length > 0 &&
            categories.map((category, index) => (
              <li key={index + category._id} className='mega-menu-item'>
                <button
                  onClick={() => navigate(`/category/${category?.slug}`)}
                  type='button'
                  className={`flex items-center h-10 ${
                    index === 0 ? 'pr-2' : index === categories.length - 1 ? 'pl-2' : 'px-2'
                  } text-lg font-semibold text-gray-600 border-b-4 border-white cursor-pointer hover:border-green-500 ${
                    id === category._id && 'border-green-500'
                  }`}
                >
                  {category?.name}
                </button>
                <div
                  onMouseEnter={() => setId(category._id)}
                  onMouseLeave={() => setId('')}
                  className={`py-5 mega-menu-content ${index + 1 < categories.length / 2 ? 'left-0' : 'right-0'}`}
                >
                  {category.subCategories.length > 0 &&
                    category.subCategories.map((subCategory, subIndex) => (
                      <div key={subIndex + subCategory._id} className='flex flex-col gap-4 px-10 w-max'>
                        <h3 className='text-lg font-semibold w-max'>{subCategory.name}</h3>
                        <ul className='flex flex-col gap-2'>
                          {subCategory.subCategories.length > 0 &&
                            subCategory.subCategories.map((subSubCategory, subSubIndex) => (
                              <li key={subSubCategory._id + subSubIndex}>
                                <button
                                  onClick={() => navigate(`/sub-category/${subCategory.slug}`)}
                                  className='text-base font-medium text-gray-600 w-max hover:text-gray-500'
                                  type='button'
                                >
                                  {subSubCategory.name}
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  )
}

export default NavigationBar

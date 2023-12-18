/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { getCategoryDetailBySlug } from 'apis/api'
import ModalCustom from 'components/common/ModalCustom'
import { ICategory } from 'modules/category'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AiOutlineStar } from 'react-icons/ai'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { LuMoveRight } from 'react-icons/lu'
import { MdExpandMore, MdSlowMotionVideo } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

function CategoryPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [category, setCategory] = useState<ICategory>()
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()

  const getCategoryDetails = useCallback(async () => {
    await getCategoryDetailBySlug(slug)
      .then((response) => {
        if (response.status === 200) {
          setCategory(response.data.category)
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

  const arrFAQs = [
    {
      question: 'What is graphic design?',
      answer:
        'Put simply, graphic design is the art and craft of creating visual content that communicates a concept, an idea or a brand message to the public. Logos, artworks, drawings, illustrations, cards, emails and a whole paraphernalia of designs are all around us. You can see them in print and digital media, in shops, restaurants and cafes, on billboards, books and magazines, in the apps we use, the sites we visit and the physical and digital products we buy. In fact, graphic design is a type of communication medium which uses visual means to convey a message. Designers use different types of physical materials or software to combine images, graphics and text as the main forms of expressing this message. Graphic design is used to sell, to build brand identity or to move people towards specific actions. It is also a form of art but ultimately, the different elements of the graphic representation influence our perceptions and emotions. There are different types of graphic design such as ‘visual identity’ which deals with the visual elements of the brand via shapes, colors and images (e.g. logo design, typography, brand style guides) and ‘marketing and advertising’ which is used directly to generate leads and sales via print (billboards, brochures, flyers, print ads) or digital (social media posts, banners, videos). There are many other types such as website design, industrial and product design, fashion design, book and illustrations, motion graphics design used for example by streamers or in gaming design and many others.'
    },
    {
      question: 'How to hire top graphic designers?',
      answer:
        'A captivating visual presence is very important whether you’re a business or a non-commercial entity. Your potential audiences are already forming an opinion and deciding whether to interact with you based on what they see, long before you’ve had a chance to say or write something. So it’s imperative to carefully select the right freelancer to meet your needs and keep you within budget. There are many different areas in which graphic designers specialize so if you want to hire the right talent to meet the requirements of your particular project, here are some easy to follow tips and tricks. - Always research their portfolio on Fiverr and ask for more examples if necessary; - Carefully think about what your style and preferences are so you know what you like, what you don’t like and what you actually want (colors, graphics, images, etc); - Write a clear brief - depending on the size of the project your brief can be very short or contain a lot of detail. What’s important is to be clear on the important points; - Define a budget and be clear to yourself and the freelancer how far you can stretch it; - Form a clear agreement on deadlines and revisions and respect the work of the designer - if you are clear on the above points then there shouldn’t be any surprises; - Think long-term - a good designer will be able to help you holistically and develop an evolving long-term vision for your product or service.'
    },
    {
      question: 'How much does it cost to hire a graphic designer',
      answer:
        'There is no simple answer to this question as graphic design is not a commodity or a product that has an exact way to be measured or priced. The great thing about Fiverr is that you can find a freelance graphic designer for any budget, starting from just $5 per gig and going up to hundreds or thousands of dollars for more complex and time and resource consuming requirements. However, there are a number of factors that will influence the final price of the project such as the level of experience of the seller (from novices to Top Rated and Pro Sellers), the number or service options included in the gig, delivery times, number of revisions and whether any extras might need to be added at some point. In fact, revisions can be a very tricky area for graphic design projects so it’s key for you to have very clear requirements to start with and also to agree with the seller what their output will be (e.g.how many initial versions they will offer) to avoid any misunderstandings or unwanted surprises on both sides. A more experienced designer will charge more, however, they can also help you define your requirements and save time (and money) in the long-run by keeping you on track for your goals. Alternatively, a new freelancer who’s perhaps less experienced or trying to build their reputation will be priced more competitively but might not have the skills or professional maturity of a seasoned creative director.'
    },
    {
      question: 'What makes graphic design so important?',
      answer:
        'We live in a visual society so images, packaging, signage, illustrations, websites, apps and social media all vie for our attention, making it very challenging to become noticeable let alone memorable amongst the overload of visual stimuli. In a nutshell, the most important mission that graphic design plays is communication. Communication of ideas and messages, with the ultimate objective of elicit, prompt or evoke an action or an emotion (which will become an action in the future). So a good graphic designer will build your logo, create your email campaign or company stationery, do everything possible (given the right brief) to set you apart from your competition and convey a message that exudes trust, credibility and builds a consistent brand and company reputation. A well executed design project will ensure that the final output, be it a flyer or your product packaging, or even the design of your office space or your frontline staff’s uniforms summarizes your mission and vision statements and communicates in a clear and simple manner the main ideas that are behind your company or organization and what it stands for. When you hire a good graphic design professional, preferably one you can trust on more than one project, they will ensure that all representations of your products and brand are visually consistent, recognizable and conveying a clear message. Ultimately, when you ask yourself ‘How important is it that my customers recognize me?’, if the answer is ‘very important’ then so should graphic design be for your brand!'
    }
  ]

  return (
    <>
      <Helmet>
        <title className='capitalize'>{`${category?.name} Service | Freelancer`}</title>
      </Helmet>
      <div className='flex flex-col gap-8 py-10 px-28'>
        <figure className='relative w-full'>
          <img
            className='w-full rounded-lg'
            src={`${process.env.REACT_APP_URL_SERVER}/${category?.image}`}
            alt={category?.name}
          />
          <figcaption className='absolute flex flex-col justify-center w-full gap-1 px-4 text-lg text-white top-10'>
            <h4 className='flex justify-center text-3xl font-bold'>{category?.name}</h4>
            <p className='flex justify-center text-xl'>{category?.description}</p>
            <div className='flex justify-center w-full mt-5'>
              <button
                onClick={() => setOpenModal(true)}
                type='button'
                className='flex items-center justify-center gap-2 p-2 px-4 border border-white rounded-md hover:bg-white hover:text-gray-600'
              >
                <MdSlowMotionVideo className='w-6 h-6' /> How Freelancer Works
              </button>
            </div>
            <ModalCustom onCancel={() => {}} open={openModal} setOpen={setOpenModal}>
              <video className='w-full' autoPlay muted controls>
                <source src='/how_fiverr_works.mp4' type='video/mp4' />
              </video>
            </ModalCustom>
          </figcaption>
        </figure>
        <div className='flex flex-col gap-4'>
          <h4 className='text-2xl font-bold text-gray-600'>Most Popular in {category?.name}</h4>
          <div className='w-full p-8 border border-gray-300 rounded-lg'>
            <Swiper
              slidesPerView={4}
              spaceBetween={20}
              freeMode
              pagination={{
                clickable: true
              }}
              modules={[FreeMode]}
              className='mySwiper'
            >
              {category &&
                category.subCategories.length > 0 &&
                category.subCategories.map((subCategory, subIndex) => (
                  <Fragment key={category._id + subIndex}>
                    {subCategory &&
                      subCategory.subCategories.length > 0 &&
                      subCategory.subCategories.map((subSubCategory, subSubIndex) => (
                        <SwiperSlide key={subSubCategory._id + subSubIndex} className='h-full rounded-lg'>
                          <div
                            onClick={() => navigate(`/sub-category/${subSubCategory.slug}`)}
                            className='flex flex-row items-center w-full h-full gap-4 p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer hover:border-black'
                          >
                            <img
                              className='w-10 h-10 rounded-lg'
                              src={`${process.env.REACT_APP_URL_SERVER}/${subSubCategory.image}`}
                              alt={subSubCategory.name}
                            />
                            <span className='text-lg font-medium'>{subSubCategory.name}</span>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Fragment>
                ))}
            </Swiper>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h4 className='text-2xl font-bold text-gray-600'>Explore {category?.name}</h4>
          <div className='grid grid-cols-4 gap-10'>
            {category &&
              category.subCategories.length > 0 &&
              category.subCategories.map((subCategory, subIndex) => (
                <div key={subCategory._id + subIndex} className='flex flex-col gap-4'>
                  <div className='grid grid-rows-6 gap-4'>
                    <img
                      src={`${process.env.REACT_APP_URL_SERVER}/${subCategory?.image}`}
                      alt={subCategory.name}
                      className='row-span-5 px-2'
                    />
                    <h5 className='px-2 text-xl font-semibold'>{subCategory.name}</h5>
                  </div>
                  <div>
                    {subCategory.subCategories.length > 0 &&
                      subCategory.subCategories.map((subSubCategory, subSubIndex) => (
                        <button
                          onClick={() => navigate(`/sub-category/${subSubCategory.slug}`)}
                          key={subSubCategory._id + subSubIndex}
                          type='button'
                          className='flex flex-row items-center justify-between w-full p-2 text-lg font-semibold text-gray-600 rounded-lg button-hover hover:bg-gray-100 hover:text-gray-900'
                        >
                          {subSubCategory.name} <LuMoveRight className='icon-move' />
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h4 className='text-2xl font-bold text-gray-600'>Gig of {category?.name}</h4>
          <div className='grid grid-cols-5 gap-10'>
            <div className='flex flex-col gap-2'>
              <div className='relative'>
                <img src='/images/thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />
                <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-pink-600 stroke-white top-3 right-3' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <img src='/images/roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
                <span className='text-sm font-bold'>Wispie_Clouda</span>
              </div>
              <span className='pt-2 text-base font-semibold text-gray-600 '>
                I will design or redesign a responsive wordpress website and ecommerce ...
              </span>
              <div className='flex flex-row gap-1'>
                <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
                <span className='text-base font-bold text-yellow-500'>4.9</span>
                <span className='text-base font-semibold text-gray-600'>(560)</span>
              </div>
              <span className='text-base font-bold text-black'>From $330</span>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='relative'>
                <img src='/images/thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />
                <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <img src='/images/roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
                <span className='text-sm font-bold'>Wispie_Clouda</span>
              </div>
              <span className='pt-2 text-base font-semibold text-gray-600 '>
                I will design or redesign a responsive wordpress website and ecommerce ...
              </span>
              <div className='flex flex-row gap-1'>
                <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
                <span className='text-base font-bold text-yellow-500'>4.9</span>
                <span className='text-base font-semibold text-gray-600'>(560)</span>
              </div>
              <span className='text-base font-bold text-black'>From $330</span>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='relative'>
                <img src='/images/thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

                <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <img src='/images/roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
                <span className='text-sm font-bold'>Wispie_Clouda</span>
              </div>
              <span className='pt-2 text-base font-semibold text-gray-600 '>
                I will design or redesign a responsive wordpress website and ecommerce ...
              </span>
              <div className='flex flex-row gap-1'>
                <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
                <span className='text-base font-bold text-yellow-500'>4.9</span>
                <span className='text-base font-semibold text-gray-600'>(560)</span>
              </div>
              <span className='text-base font-bold text-black'>From $330</span>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='relative'>
                <img src='/images/thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

                <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <img src='/images/roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
                <span className='text-sm font-bold'>Wispie_Clouda</span>
              </div>
              <span className='pt-2 text-base font-semibold text-gray-600 '>
                I will design or redesign a responsive wordpress website and ecommerce ...
              </span>
              <div className='flex flex-row gap-1'>
                <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
                <span className='text-base font-bold text-yellow-500'>4.9</span>
                <span className='text-base font-semibold text-gray-600'>(560)</span>
              </div>
              <span className='text-base font-bold text-black'>From $330</span>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='relative'>
                <img src='/images/thumbnail.webp' height='200' width='300px' alt='thumbnail' className='rounded-lg' />

                <BsFillSuitHeartFill className='absolute w-5 h-5 cursor-pointer stroke-1 fill-gray-600 stroke-white top-3 right-3 ' />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <img src='/images/roses.jpg' alt='avata' className='rounded-full h-9 w-9' />
                <span className='text-sm font-bold'>Wispie_Clouda</span>
              </div>
              <span className='pt-2 text-base font-semibold text-gray-600 '>
                I will design or redesign a responsive wordpress website and ecommerce ...
              </span>
              <div className='flex flex-row gap-1'>
                <AiOutlineStar className='w-6 h-6 fill-yellow-500 ' />
                <span className='text-base font-bold text-yellow-500'>4.9</span>
                <span className='text-base font-semibold text-gray-600'>(560)</span>
              </div>
              <span className='text-base font-bold text-black'>From $330</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 text-lg'>
          <h4 className='text-2xl font-bold text-center text-gray-600'>{category?.name} FAQs</h4>
          <div>
            {arrFAQs.length > 0 &&
              arrFAQs.map((FAQ, index) => (
                <Accordion key={index} sx={{ boxShadow: 'none' }}>
                  <AccordionSummary
                    expandIcon={<MdExpandMore className='w-7 h-7' />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    sx={{ padding: '0px' }}
                  >
                    <Typography>{FAQ?.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{FAQ?.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryPage

import { Fragment } from 'react'
import {
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
  PiNumberCircleFourFill,
  PiNumberCircleOneFill
} from 'react-icons/pi'
import { AiFillCheckCircle } from 'react-icons/ai'
import { MdNavigateNext } from 'react-icons/md'

const stepper = [
  {
    title: 'Overview',
    icon: <PiNumberCircleOneFill className='h-8 w-8 fill-gray-700' />
  },
  {
    title: 'Pricing',
    icon: <PiNumberCircleTwoFill className='h-8 w-8 fill-gray-700' />
  },
  {
    title: 'FAQ & Gallery',
    icon: <PiNumberCircleThreeFill className='h-8 w-8 fill-gray-700' />
  },
  {
    title: 'Publish',
    icon: <PiNumberCircleFourFill className='h-8 w-8 fill-gray-700' />
  }
]

function StepNavigate({ index }: { index: number }) {
  return (
    <div className=' w-full flex flex-col border-y-[1px] border-gray-300 bg-white  '>
      <div className=' flex flex-row align-middle justify-center items-center  py-2 gap-8'>
        {stepper.map((step, ind) => (
          <Fragment key={step.title}>
            <div className='flex flex-row items-center gap-1 text-base font-bold cursor-pointer'>
              {index === ind + 1 ? <AiFillCheckCircle className='h-8 w-8 fill-[#1dbf73]' /> : step.icon}
              <span className={`${index === ind + 1 ? 'text-black' : 'text-gray-500'}`}>{step.title}</span>
            </div>
            {stepper.length !== ind + 1 && <MdNavigateNext className='h-5 w-5 fill-gray-500' />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default StepNavigate

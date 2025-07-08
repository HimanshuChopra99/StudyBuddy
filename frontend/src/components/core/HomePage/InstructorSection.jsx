import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import Button from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-20 mx-auto w-10/12 '>
      <div className='flex flex-col md:flex-row gap-20 items-center'>
        <div className='w-[50%]'>
            <img
                src={Instructor}
                alt=""
                className='shadow-white shadow-[-1.3rem_-1rem_0_0]'
            />
        </div>

        <div className='flex flex-col items-center md:items-start gap-10 md:w-[50%]'>
            <div className='text-4xl font-semobold text-center md:text-start w-screen md:w-[50%]'>
                Become an
                <HighlightText text={"Instructor"} />
            </div>

            <p className='font-medium text-[16px] w-[80%] text-richblack-300 text-center md:text-start'>
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
                <Button active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Learning Today
                        <FaArrowRight />
                    </div>
                </Button>
            </div>


        </div>

      </div>
    </div>
  )
}

export default InstructorSection
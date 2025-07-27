
import { useSelector } from "react-redux"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)

  return (
    <>
  <h1 className="mb-14 text-3xl font-medium text-richblack-5">Cart</h1>
  <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
    {totalItems} Courses in Cart
  </p>
  {total > 0 ? (
    <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
      <RenderCartCourses />
      <RenderTotalAmount />
    </div>
  ) : (
    <div className="mt-24 flex flex-col items-center justify-center px-4 py-12 rounded-xl bg-richblack-700 shadow-lg mx-auto w-full max-w-lg">
      <span className="text-6xl mb-6">🛒</span>
      <p className="text-2xl font-semibold text-richblack-5 mb-2">Your cart is empty!</p>
      <p className="text-richblack-50 mb-6 text-center">
        Looks like you haven&apos;t added any courses yet.
      </p>
      <a
        href="/courses"
        className="inline-block px-6 py-3 bg-yellow-50 hover:bg-yellow-300 transition rounded-md font-bold text-richblack-900 shadow"
      >
        Browse Courses
      </a>
    </div>
  )}
</>

  )
}

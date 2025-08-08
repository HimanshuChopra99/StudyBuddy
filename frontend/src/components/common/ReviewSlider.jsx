  import React, { useEffect, useState } from "react";
  // import ReactStars from "react-rating-stars-component"
  import Rating from "react-rating";
  import { FaStar, FaRegStar } from "react-icons/fa";
  // Import Swiper React components
  import { Swiper, SwiperSlide } from "swiper/react";

  // Import Swiper styles
  import "swiper/css";
  import "swiper/css/free-mode";
  import "swiper/css/pagination";
  import "../../App.css";
  // Icons
  // Import required modules
  import { Autoplay, FreeMode, Pagination } from "swiper/modules";

  // Get apiFunction and the endpoint
  import { apiConnector } from "../../services/apiconnector";
  import { ratingsEndpoints } from "../../services/apis";

  function ReviewSlider() {
    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
      (async () => {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) {
          setReviews(data?.data);
        }
      })();
    }, []);


    return (
      <div className="text-white w-10/12 m-auto">
        <div className="my-12 w-full max-w-maxContentTab lg:max-w-maxContent">
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            speed={1000}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            modules={[FreeMode, Pagination, Autoplay]}
          >
            {reviews.map((review, i) => {
              return (
                <SwiperSlide key={i}>
                  <div className="flex flex-col gap-3 bg-richblack-800 p-6 text-[14px] text-richblack-25 rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-richblack-500/50">
                    {/* Top section: User image + name */}
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          review?.user?.image
                            ? review?.user?.image
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                        }
                        alt="Reviewer"
                        className="h-11 w-11 rounded-full object-cover border-2 border-richblack-700"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold text-richblack-5 text-[16px]">
                          {`${review?.user?.firstName} ${review?.user?.lastName}`}
                        </h1>
                        <h2 className="text-[12px] font-medium text-richblack-400 italic">
                          {review?.course?.courseName}
                        </h2>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="font-medium text-richblack-200 leading-6">
                      {review?.review.split(" ").length > truncateWords
                        ? `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review}`}
                    </p>

                    {/* Rating section */}
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="font-semibold text-yellow-100 text-[15px]">
                        {review.rating.toFixed(1)}
                      </h3>
                      <Rating
                        readonly
                        initialRating={review.rating}
                        fullSymbol={<FaStar size={18} color="#ffd700" />}
                        emptySymbol={<FaRegStar size={18} color="#555" />}
                        className="flex gap-1"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            {/* <SwiperSlide>Slide 1</SwiperSlide> */}
          </Swiper>
        </div>
      </div>
    );
  }

  export default ReviewSlider;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../data/countrycode.json";
import { contactusEndpoint } from "../../services/apis";
import { apiConnector } from "../../services/apiconnector.js";

function ContactUsForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    try {
      setLoading(true);
      const fullPhoneNumber = `${data.countrycode} ${data.phoneNumber}`;
      const contactData = {
        ...data,
        phoneNumber: fullPhoneNumber,
      };

      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        contactData
      );
      setLoading(false);
    } catch (error) {
      console.log("error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstName" className="lable-style">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter first name"
            className="form-style"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastName" className="lable-style">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter last name"
            className="form-style"
            {...register("lastName")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="form-style"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber" className="lable-style">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[90px] flex-col gap-2">
            <select
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="Enter first name"
              className="form-style"
              defaultValue="+91"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => {
                return (
                  <option key={i} value={ele.code}>
                    {ele.code} {ele.country}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type=""
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style"
              {...register("phoneNumber", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errors.phoneNumber.message}
          </span>
        )}
      </div>

      {/* message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="form-style"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 mb-4 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  );
}

export default ContactUsForm;

import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { logout } from "../../services/operations/authAPI";

export default function HamburgerDrawer({
  open,
  setOpen,
  subLinks,
  NavbarLinks,
  user,
  token,
  totalItems,
  matchRoute,
  dispatch,
}) {
  const drawerRef = useRef();
  const navigate = useNavigate();
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Close drawer when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end pointer-events-auto lg:hidden`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          open ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`relative h-full bg-richblack-900 p-6 w-[85vw] sm:w-[70vw] max-w-xs flex flex-col gap-4 
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          className="absolute top-5 right-5 text-3xl text-richblack-50 p-2"
          onClick={() => setOpen(false)}
        >
          <FiX />
        </button>

        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)}>
          <img src="/" alt="Study Buddy" className="mb-6 w-32" />
        </Link>

        {/* Main nav links */}
        <ul className="flex flex-col gap-2">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div className="ml-2">
                  <button
                    onClick={() => setCatalogOpen(!catalogOpen)}
                    className="flex items-center gap-1 cursor-pointer font-semibold text-richblack-25 py-2 w-full"
                  >
                    Catalog
                    <IoIosArrowDown
                      className={`text-xl transition-transform duration-300 ${
                        catalogOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Smooth Dropdown Animation */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col pl-3 ${
                      catalogOpen
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {subLinks && subLinks.length > 0 ? (
                      subLinks.map((data, idx) => (
                        <Link
                          to={`/catalog/${data.name
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          key={idx}
                          className="py-1 px-2 rounded text-richblack-100 hover:text-richblack-900 hover:bg-richblack-50"
                          onClick={() => setOpen(false)}
                        >
                          {data.name}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs py-1 px-2">
                        Oops! We couldn't find anything here.
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  to={link?.path}
                  className={`block py-2 px-2 rounded ${
                    matchRoute(link?.path)
                      ? "text-yellow-25 font-semibold"
                      : "text-richblack-25"
                  } hover:bg-richblack-800 transition`}
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Separator */}
        <hr className=" border-t border-richblack-700" />

        {/* Cart (only for students) */}
        {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
          <Link
            to={"/dashboard/cart"}
            className="relative ml-2 flex items-center gap-2 font-semibold text-richblack-100"
            onClick={() => setOpen(false)}
          >
            <FiShoppingCart />
            Cart
            {totalItems > 0 && (
              <span className="ml-1 text-yellow-50 font-bold flex justify-center items-center rounded-full text-xs h-4 w-4 bg-richblack-500">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {/* Auth Buttons */}
        {token === null ? (
          <div className="mt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="px-5 py-2 w-full rounded-md border border-richblack-700 text-richblack-25 hover:bg-richblack-700 hover:text-white transition"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 w-full rounded-md bg-yellow-50 text-black font-semibold hover:bg-yellow-100 transition"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pt-3">
            <Link
              to="/dashboard/my-profile"
              className="flex items-center gap-2 py-2 px-2 rounded text-richblack-100 hover:bg-richblack-800"
              onClick={() => setOpen(false)}
            >
              <VscDashboard /> Dashboard
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                dispatch(logout(navigate));
              }}
              className="flex items-center gap-2 py-2 px-2 rounded text-richblack-100 hover:bg-richblack-800"
            >
              <VscSignOut /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { FiShoppingCart } from "react-icons/fi";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="w-screen h-14 flex items-center justify-center border-b-2 border-richblue-700">
      <div className="flex w-10/12 lg:w-9/12 justify-between items-center ">
        <Link to={"/"}>
          <img
            src="/"
            alt="Studdy Buddy"
            className="text-white text-2xl font-semibold"
          />
        </Link>

        {/* nav link */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div> </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* login/signup */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to={"/dashboard/cart"} className="relative">
              <FiShoppingCart className="text-white" />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}

          {token === null && (
            <div className="flex gap-3">
              <Link to="/login">
                <button className="px-5 py-2 rounded-md border border-richblack-700 text-richblack-25 hover:bg-richblack-700 hover:text-white transition duration-200">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2 rounded-md bg-yellow-50 text-black font-semibold hover:bg-yellow-100 transition duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

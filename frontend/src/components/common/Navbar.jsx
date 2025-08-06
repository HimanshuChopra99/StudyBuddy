import React, { useEffect, useState, useRef } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector, useDispatch } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import HamburgerDrawer from "./Hamburger";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(result.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  // Close hamburger drawer when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    }
    if (drawerOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [drawerOpen]);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  // ========== MAIN NAVBAR ==========
  return (
    <div className="w-screen h-14 flex items-center justify-center border-b-2 border-richblue-700 bg-richblack-900 z-40">
      <div className="flex w-10/12 lg:w-9/12 justify-between items-center">
        {/* LOGO */}
        <Link to={"/"}>
          <h1 className="text-white text-2xl font-semibold">Studdy Buddy</h1>
        </Link>

        {/* Hamburger on mobile/tablet only */}
        {!drawerOpen && (
          <button
            className="lg:hidden block text-xl text-richblack-25"
            onClick={() => setDrawerOpen(true)}
          >
            <FiMenu />
          </button>
        )}

        {/* NAV LINKS, Cart, Login/SignUp, ProfileDropdown for desktop/laptop */}
        <nav className="hidden lg:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative group">
                    <div className="flex relative items-center cursor-pointer gap-1">
                      <p>{link.title}</p>
                      <IoIosArrowDown className="text-xl" />
                    </div>
                    <div className="invisible absolute left-[-100%] top-[40px] flex flex-col rounded-md bg-richblack-5 text-richblack-900 opacity-0 transition-all duration-200 -translate-y-5 group-hover:visible group-hover:opacity-100 w-[320px] z-1 group-hover:-translate-y-0 px-1">
                      <div className="absolute bg-richblack-5 h-6 w-6 left-[45%] rounded-sm rotate-45 invisible -translate-y-4 transition-all duration-200 opacity-0 group-hover:visible group-hover:opacity-100 -z-1 group-hover:-translate-y-2"></div>
                      {subLinks && subLinks.length > 0 ? (
                        subLinks.map((data, idx) => (
                          <Link
                            to={`/catalog/${data.name
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                            className="rounded-lg transition-all duration-200 hover:scale-102 bg-transparent py-2 pl-4 hover:bg-richblack-25"
                            key={idx}
                          >
                            <p>{data.name}</p>
                          </Link>
                        ))
                      ) : (
                        <div className="rounded-lg transition-all duration-200 hover:scale-102 bg-transparent py-2 pl-4">
                          Oops! We couldn't find anything here.
                        </div>
                      )}
                    </div>
                  </div>
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
            ))}
          </ul>
        </nav>

        {/* Desktop (laptop) right-side: Cart, Login/Signup, ProfileDropdown --- DO NOT CHANGE */}
        <div className="hidden lg:flex gap-x-4 items-center">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link
              to={"/dashboard/cart"}
              className="relative text-lg flex items-center"
            >
              <FiShoppingCart className="text-white" />
              {totalItems > 0 && (
                <span className="text-yellow-50 font-bold flex justify-center items-center absolute rounded-full -top-2 -right-2 text-[0.6rem] h-4 w-4 bg-richblack-500">
                  {totalItems}
                </span>
              )}
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

        {/* Hamburger Drawer appears on mobile/tablet */}
        {drawerOpen && (
          <div className="lg:hidden">
            <HamburgerDrawer
              open={drawerOpen}
              setOpen={setDrawerOpen}
              subLinks={subLinks}
              NavbarLinks={NavbarLinks}
              user={user}
              token={token}
              totalItems={totalItems}
              matchRoute={matchRoute}
              dispatch={dispatch}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

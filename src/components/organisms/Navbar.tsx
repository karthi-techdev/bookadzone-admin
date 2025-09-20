import React from "react";
import Logo from "../atoms/BAZ-Logo";
import Button from "../atoms/BAZ-Button";
import { FiSearch, FiMaximize } from "react-icons/fi";
import { RiCustomerServiceFill, RiNotification2Fill } from "react-icons/ri";
import { GoOrganization } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { motion } from "framer-motion";
import { useDropdown } from "../hooks/useDropdown";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const notifDropdown = useDropdown();
  const profileDropdown = useDropdown();

    return (
      <motion.nav 
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -70, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut",delay: 1.8 }}
      className="z-100000 fixed top-0 left-0 right-0 w-full shadow flex items-center justify-between px-6 py-3 bg-[var(--light-dark-color)] h-[60px] border-b-[1px] border-b-[var(--light-blur-grey-color)]">
        <div className="nav-enclose flex items-center justify-between w-full">
          <motion.div className="logo flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.97 }}>
            <Logo className="h-[20px]" />
          </motion.div>
          <div className="nav-content flex items-center w-[80vw] justify-between">
            <div className="search-box w-[35vw] flex items-center justify-between border-[1px] border-[var(--light-blur-grey-color)] p-1 rounded-bl-[20px] rounded-tr-[20px] rounded-tl-[5px] rounded-br-[5px] bg-[var(--light-dark-color)] backdrop-blur-md">
              <FiSearch className="text-[1.3rem] ml-2 text-[var(--light-grey-color)]" />
              <input type="search" placeholder="Search..." className="outline-none text-[var(--white-color)] placeholder:text-[var(--light-grey-color)] text-[.80rem] px-3 w-full"/>
              <Button
                className="bg-[var(--puprle-color)] text-[var(--white-color)] text-[.80rem] px-5 py-1.5 rounded-bl-[20px] rounded-tr-[20px] rounded-tl-[5px] rounded-br-[5px]"
                onClick={() => {/* TODO: handle search action */}}
              >
                Search
              </Button>
            </div>
  
            <div className="nav-actions flex items-center justify-between">
              <div className="quick-btns flex items-center justify-between gap-5 mr-4">
                <Link to="/support"><RiCustomerServiceFill className="text-[1.1rem] text-[var(--white-color)] h-[100%]" /></Link>
  
                <div className="relative flex items-center flex-col" ref={notifDropdown.ref}>
                  <Button className="relative focus:outline-none" onClick={notifDropdown.toggle}>
                    <RiNotification2Fill className="text-lg text-[var(--white-color)]" />
                    <span className="absolute -top-1 -right-1 text-[.50rem] text-white h-3 w-3 bg-[var(--puprle-color)] rounded-full flex items-center justify-center">3</span>
                  </Button>
                  {notifDropdown.open && (
                    <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute -right-2 mt-10 w-[350px] rounded-[7px] shadow-lg z-50 bg-[var(--light-dark-color)] border-[1px] border-[var(--light-blur-grey-color)] backdrop-blur-md">
                      <div className="m-3 pb-2 border-b-[1px] border-b-[var(--light-blur-grey-color)] flex items-center justify-between">
                         <span className="flex font-semibold text-[.75rem] text-[var(--white-color)]">Notifications</span>
                         <Button
                           className="text-[.60rem] bg-[var(--puprle-color)] text-[var(--white-color)] px-2.5 py-1 rounded-[2px] flex items-center gap-1"
                           onClick={() => {/* TODO: handle mark all as read */}}
                         >
                           <FaCheck />All Read
                         </Button>
                      </div>
                      <ul className="max-h-60 overflow-y-auto py-0.5 custom-scrollbar pr-[5px]">
                        <li className="py-2 px-3 hover:bg-[var(--light-purple-color)] transition-all duration-200">
                          <Link to="/" className="flex items-center item-center justify-between">
                            <div className="avatar-img h-[50px] w-[30px] flex items-start justify-left">
                              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Avatar" className="h-[30px] w-[30px] rounded-full object-cover" />
                            </div>
  
                            <div className="content w-[250px]">
                              <span className="text-[.70rem] text-[var(--white-color)] font-semibold flex items-center mb-1">Karthi Rajendhiran <span className="ml-2 text-[.50rem] font-normal text-[var(--light-grey-color)] flex">Skoda Motors</span></span>
                              <p className="text-[.60rem] text-[var(--light-grey-color)]">Submitted a new booking request for “Medavakkam Flyover” billboard.</p>
                              <span className="text-[.50rem] text-[var(--light-grey-color)] flex mt-0.5">2 hours ago</span>
                            </div>
  
                            <span className="not-read-point h-[8px] w-[8px] bg-[var(--puprle-color)] rounded-full flex"></span>
                          </Link>
                        </li>
                        
                        <li className="py-2 px-3 hover:bg-[var(--light-purple-color)] transition-all duration-200">
                          <Link to="/" className="flex items-center item-center justify-between">
                              <div className="avatar-img h-[50px] w-[30px] flex items-start justify-left">
                              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Avatar" className="h-[30px] w-[30px] rounded-full object-cover" />
                            </div>
  
                            <div className="content w-[250px]">
                               <span className="text-[.70rem] text-[var(--white-color)] font-semibold flex items-center mb-1">Rajesh Kumar<span className="ml-2 text-[.50rem] font-normal text-[var(--light-grey-color)] flex">Honda Motors</span></span>
                              <p className="text-[.60rem] text-[var(--light-grey-color)]">Uploaded the final ad design for campaign #BAZ4325.</p>
                              <span className="text-[.50rem] text-[var(--light-grey-color)] flex mt-0.5">3 hours ago</span>
                            </div>
  
                            <span className="not-read-point h-[8px] w-[8px] bg-[var(--puprle-color)] rounded-full flex"></span>
                          </Link>
                        </li>
  
                        <li className="py-2 px-3 hover:bg-[var(--light-purple-color)] transition-all duration-200">
                            <Link to="/" className="flex items-center item-center justify-between">
                            <div className="avatar-img h-[50px] w-[30px] flex items-start justify-left">
                              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Avatar" className="h-[30px] w-[30px] rounded-full object-cover" />
                            </div>
  
                            <div className="content w-[250px]">
                               <span className="text-[.70rem] text-[var(--white-color)] font-semibold flex items-center mb-1">Vijay Kumar<span className="ml-2 text-[.50rem] font-normal text-[var(--light-grey-color)] flex">Sony India Pvt Ltd</span></span>
                              <p className="text-[.60rem] text-[var(--light-grey-color)]">Completed KYC verification. Ready for property assignment.</p>
                              <span className="text-[.50rem] text-[var(--light-grey-color)] flex mt-0.5">5 hours ago</span>
                            </div>
  
                            <span className="read-point h-[8px] w-[8px] rounded-full flex"></span>
                          </Link>
                        </li>
  
                        <li className="py-2 px-3 hover:bg-[var(--light-purple-color)] transition-all duration-200">
                            <Link to="/" className="flex items-center item-center justify-between">
                            <div className="avatar-img h-[50px] w-[30px] flex items-start justify-left">
                              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Avatar" className="h-[30px] w-[30px] rounded-full object-cover" />
                            </div>
  
                            <div className="content w-[250px]">
                              <span className="text-[.70rem] text-[var(--white-color)] font-semibold flex items-center mb-1">Arun Kumar<span className="ml-2 text-[.50rem] font-normal text-[var(--light-grey-color)] flex">Nike Fashions</span></span>
                              <p className="text-[.60rem] text-[var(--light-grey-color)]">Ad payment of ₹1,50,000 received for campaign ID #BAZ3241.</p>
                              <span className="text-[.50rem] text-[var(--light-grey-color)] flex mt-0.5">5 hours ago</span>
                            </div>
  
                            <span className="read-point h-[8px] w-[8px] rounded-full flex"></span>
                          </Link>
                        </li>
  
                      </ul>
                      <div className="text-center m-3">
                        <Link to="/notification" className="text-[.70rem] bg-[var(--puprle-color)] text-[var(--white-color)] w-full h-full flex items-center justify-center py-1.5 rounded-[3px] mt-2">View all</Link>
                      </div>
                    </motion.div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center bg-transparent border-none outline-none cursor-pointer p-1"
                  style={{ boxShadow: 'none' }}
                  aria-label="Fullscreen"
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      if (document.exitFullscreen) {
                        document.exitFullscreen();
                      }
                    }
                  }}
                >
                  <FiMaximize className="text-[1.1rem] text-[var(--white-color)]" />
                </motion.button>
              </div>
  
              <div className="profile-dropdown relative" ref={profileDropdown.ref}>
                <Button className="flex items-center justify-center gap-2" onClick={profileDropdown.toggle}>
                  <div className="profile-img h-[30px] w-[30px] flex items-center justify-center rounded-full bg-[var(--white-glass-color)]">
                    <GoOrganization className="text-[1rem] text-[var(--white-color)]" />
                  </div>
                  <div className="profile-btn-content">
                    <span className="text-[.80rem] font-medium text-[var(--white-color)] flex">Focus Media</span>
                    <span className="text-[.50rem] text-[var(--light-grey-color)] flex">Admin</span>
                  </div>
                </Button>
                {profileDropdown.open && (
                  <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }} 
                  className="absolute -right-3 mt-4 w-40 bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded shadow-lg z-50 text-[.75rem] backdrop-blur-md">
                    <Link to="/profile" className="block px-4 py-2 text-[var(--white-color)] hover:bg-[var(--light-purple-color)] transition-all duration-200">Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-[var(--white-color)] hover:bg-[var(--light-purple-color)] transition-all duration-200">Settings</Link>
                    <Button
                      className="block w-full text-left px-4 py-2 text-[var(--white-color)] hover:bg-[var(--light-purple-color)] transition-all duration-200"
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>  
        </div>
      </motion.nav>
    );
};

export default Navbar;

import { Link, useLocation } from "react-router-dom";
import Button from "../atoms/Button";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { RiListIndefinite } from "react-icons/ri";
import { BsUiChecks } from "react-icons/bs";
import { TbMenu2 } from "react-icons/tb";
import { FaMoneyCheck, FaFileContract  } from "react-icons/fa6";
import { PiChatTeardropTextFill } from "react-icons/pi";
import { MdArticle } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const navItems = [
    { icon: <IoGrid />, text: "Dashboard", path: "/" },
    { icon: <RiListIndefinite />, text: "Listings", path: "/Listings" },
    { icon: <BsUiChecks />, text: "Bookings", path: "/Bookings" },
    { icon: <FaMoneyCheck  />, text: "Payments", path: "/Payments" },
    { icon: <FaFileContract  />, text: "Agreements", path: "/Agreements" },
    { icon: <PiChatTeardropTextFill  />, text: "Chat", path: "/Chat" },
    { icon: <MdArticle  />, text: "Blog", path: "/Blog" },
    { icon: <IoSettingsSharp  />, text: "Settings", path: "/Settings" }
  ];

  return (
    <motion.div 
    initial={{ x: -220, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -220, opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeOut",delay: 1.8 }}
    className={`overflow-hidden flex flex-col px-3 bg-[var(--light-dark-color)] h-[100dvh] fixed left-0 top-[60px] border-r border-r-[var(--light-blur-grey-color)] backdrop-blur-md transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[210px]"}`}>
      <Button className={`text-[.90rem] font-semibold flex items-center text-[var(--white-color)] w-full mt-4 ${collapsed ? "justify-center" : "justify-between"}`}
        onClick={() => setCollapsed(prev => !prev)}
      >
        {!collapsed && "Menu"}
        {collapsed ? <TbMenu2 className="text-[1.3rem]" /> : <HiOutlineMenuAlt1 className="text-[1.3rem]" />}
      </Button>

      <div className="nav-links-side">
        <ul className="text-[.90rem]">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={index}>
                {collapsed ? (
                  <Tippy content={item.text} placement="right" arrow={true}>
                    <Link
                      to={item.path}
                      className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-center
                        ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}`}
                    >
                      <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full group-hover:bg-[var(--puprle-color)]
                        ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`}
                      >
                        {item.icon}
                      </div>
                    </Link>
                  </Tippy>
                ) : (
                  <Link
                    to={item.path}
                    className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-start
                      ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}`}
                  >
                    <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full mr-3 group-hover:bg-[var(--puprle-color)]
                      ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`}
                    >
                      {item.icon}
                    </div>
                    {item.text}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </motion.div>
  )
}

export default Sidebar;

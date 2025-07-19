import { Link, useLocation } from "react-router-dom";
import Button from "../atoms/Button";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { RiListIndefinite } from "react-icons/ri";
import { BsUiChecks } from "react-icons/bs";
import { TbMenu2 } from "react-icons/tb";
import { FaMoneyCheck, FaFileContract, FaUser } from "react-icons/fa6";
import { PiChatTeardropTextFill } from "react-icons/pi";
import { MdArticle, MdOutlineSecurity } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const navItems = [
    { icon: <IoGrid />, text: "Dashboard", path: "/" },
    {
      icon: <RiListIndefinite />, text: "Listings", path: "/Listings",
      children: [
        { icon: <BsUiChecks />, text: "My Properties", path: "/Listings/properties" },
        { icon: <FaFileContract />, text: "Draft Listings", path: "/Listings/drafts" }
      ]
    },
    { icon: <BsUiChecks />, text: "Bookings", path: "/Bookings" },
    { icon: <FaMoneyCheck />, text: "Payments", path: "/Payments" },
    { icon: <FaFileContract />, text: "Agreements", path: "/Agreements" },
    { icon: <PiChatTeardropTextFill />, text: "Chat", path: "/Chat" },
    { icon: <MdArticle />, text: "Blog", path: "/Blog" },
    {
      icon: <IoSettingsSharp />, text: "Settings", path: "/Settings",
      children: [
        { icon: <FaUser />, text: "Profile", path: "/Settings/profile" },
        { icon: <MdOutlineSecurity />, text: "Security", path: "/Settings/security" }
      ]
    }
  ];

  // Handle expand/collapse for submenu
  const toggleMenu = idx => {
    setExpandedMenus(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <motion.div
      initial={{ x: -220, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -220, opacity: 0 }}
      style={{ overflowY: 'auto', height: '100%' }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 1.8 }}
      className={`custom-scroll pb-20 flex flex-col px-3 bg-[var(--light-dark-color)] h-[100dvh] fixed left-0 top-[60px] border-r border-r-[var(--light-blur-grey-color)] backdrop-blur-md transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[210px]"}`}>
      <Button
        className={`text-[.90rem] font-semibold flex items-center text-[var(--white-color)] w-full mt-4 ${collapsed ? "justify-center" : "justify-between"}`}
        onClick={() => setCollapsed(prev => !prev)}
      >
        {!collapsed && "Menu"}
        {collapsed ? <TbMenu2 className="text-[1.3rem]" /> : <HiOutlineMenuAlt1 className="text-[1.3rem]" />}
      </Button>

      <div className="nav-links-side" >
        <ul className="text-[.90rem]">
          {navItems.map((item, idx) => {
            const isActive =
              location.pathname === item.path ||
              (item.children && item.children.some(child => location.pathname === child.path));
            const hasChildren = !!item.children;
            const isExpanded = !!expandedMenus[idx];

            // SPECIAL CASE: Dashboard should always be just a link
            if (item.text === "Dashboard") {
              // Collapsed
              if (collapsed) {
                return (
                  <li key={idx} className="flex flex-col items-center">
                    <Tippy content={item.text} placement="right" arrow={true}>
                      <Link
                        to={item.path}
                        className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-center
                        ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}`}>
                        <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full group-hover:bg-[var(--puprle-color)]
                          ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`}>
                          {item.icon}
                        </div>
                      </Link>
                    </Tippy>
                  </li>
                );
              }
              // Expanded
              return (
                <li key={idx} className="flex flex-col">
                  <Link
                    to={item.path}
                    className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-start
                    ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}`}
                  >
                    <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full mr-3 group-hover:bg-[var(--puprle-color)]
                        ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`}>
                      {item.icon}
                    </div>
                    {item.text}
                  </Link>
                </li>
              );
            }

            // All other items (may have submenu)
            return (
              <li key={idx} className="flex flex-col justify-center items-center">
                {collapsed ? (
                  <Tippy content={item.text} placement="right" arrow={true}>
                    <div>
                      <div
                        className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-center
                        ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}`}
                        onClick={hasChildren ? () => toggleMenu(idx) : undefined}
                        style={{ cursor: hasChildren ? "pointer" : "auto" }}
                      >
                        <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full group-hover:bg-[var(--puprle-color)]
                        ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`} >
                          {item.icon}
                        </div>
                      </div>
                      {/* Render sub menu in tooltip if expanded */}
                      <AnimatePresence>
                        {hasChildren && isExpanded && (
                          <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col"
                          >
                            {item.children.map((sub, subidx) => (
                              <li key={subidx} className="mt-2 flex flex-col items-center justify-center">
                                <Tippy content={sub.text} placement="right" arrow={true}>
                                  <Link
                                    to={sub.path}
                                    className={`flex items-center justify-center h-[35px] w-[35px] rounded-full 
                                      text-[var(--white-color)]  ${location.pathname === sub.path ? "bg-[var(--puprle-color)]" : "bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]"} transition duration-300`}
                                  >{sub.icon}</Link>
                                </Tippy>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </Tippy>
                ) : (
                  <>
                    <div
                      className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-start
                      ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}
                      ${hasChildren && "cursor-pointer"}`}
                      onClick={hasChildren ? () => toggleMenu(idx) : undefined}
                    >
                      <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full mr-3 group-hover:bg-[var(--puprle-color)]
                        ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`}
                      >
                        {item.icon}
                      </div>
                      <span className="flex-1">{item.text}</span>
                      {hasChildren &&
                        <span className="mr-2">{isExpanded ? <FiChevronDown /> : <FiChevronRight />}</span>
                      }
                    </div>
                    {/* Submenu for expanded parent, not collapsed */}
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 w-full"
                        >
                          {item.children.map((sub, subidx) => (
                            <li key={subidx} className="mt-2 mr-2">
                              <Link
                                to={sub.path}
                                className={`flex items-center text-[.68rem] text-[var(--white-color)] p-2 pl-4 rounded-full font-medium
                                  ${location.pathname === sub.path ? "bg-[var(--puprle-color)]" : "hover:bg-[var(--puprle-color)]"} transition duration-300`}
                              >
                                {sub.text}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  )
};

export default Sidebar;

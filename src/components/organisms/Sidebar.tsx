import { Link, useLocation } from "react-router-dom";
import BAZButton from "../atoms/BAZ-Button";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { RiListIndefinite } from "react-icons/ri";
import { BsUiChecks } from "react-icons/bs";
import { TbMenu2 } from "react-icons/tb";
import { FaTrashCan } from "react-icons/fa6";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [expandedMenuIdx, setExpandedMenuIdx] = useState<number | null>(null);

  // Auto-expand submenu if route matches any child
  useEffect(() => {
    let matchedIdx: number | null = null;
    navItems.forEach((item, idx) => {
      if (item.children && item.children.some(child => location.pathname.startsWith(child.path))) {
        matchedIdx = idx;
      }
    });
    setExpandedMenuIdx(matchedIdx);
  }, [location.pathname]);

  const navItems = [
    { icon: <IoGrid />, text: "Dashboard", path: "/" },
    { icon: <BsUiChecks />, text: "Site Setting", path: "#",
      children: [
        { icon: <RiListIndefinite />, text: "FAQ", path: "/faq" },
      ]
     },

     { icon: <BsUiChecks />, text: "Manage Blog", path: "#",
      children: [
        { icon: <RiListIndefinite />, text: "Blog Category", path: "/blog" },
      ]
     },
     
     { icon: <FaTrashCan />, text: "Trash", path: "#",
      children: [
        { icon: <RiListIndefinite />, text: "FAQ", path: "/trash/faq" },
      ]
     },
     
  ];

  // Handle expand/collapse for submenu
  const toggleMenu = (idx: number) => {
    setExpandedMenuIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <motion.div
      initial={{ x: -220, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -220, opacity: 0 }}
      style={{ overflowY: 'auto', height: '100%' }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 1.8 }}
      className={`custom-scroll pb-20 flex flex-col px-3 bg-[var(--light-dark-color)] h-[100dvh] fixed left-0 top-[60px] border-r border-r-[var(--light-blur-grey-color)] backdrop-blur-md transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[210px]"}`}>
      <BAZButton
        className={`text-[.90rem] font-semibold flex items-center text-[var(--white-color)] w-full mt-4 ${collapsed ? "justify-center" : "justify-between"}`}
        onClick={() => setCollapsed(prev => !prev)}
      >
        {!collapsed && "Menu"}
        {collapsed ? <TbMenu2 className="text-[1.3rem]" /> : <HiOutlineMenuAlt1 className="text-[1.3rem]" />}
      </BAZButton>

      <div className="nav-links-side" >
        <ul className="text-[.90rem]">
          {navItems.map((item, idx) => {
            const isActive =
              (item.path !== '#' && location.pathname === item.path) ||
              (item.children && item.children.some(child => location.pathname.startsWith(child.path)));
            const hasChildren = !!item.children;
            const isExpanded = expandedMenuIdx === idx;

            if (item.text === "Dashboard") {
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
                                  ${location.pathname.startsWith(sub.path) ? "bg-[var(--puprle-color)]" : "hover:bg-[var(--puprle-color)]"} transition duration-300`}
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

import React from "react";
import { Link, useLocation } from "react-router-dom";
import Tippy from '@tippyjs/react';
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

export interface SidebarNavItemProps {
  item: {
    text: string;
    path: string;
    icon: React.ReactNode;
    children?: Array<{ text: string; path: string; icon?: React.ReactNode }>;
  };
  idx: number;
  collapsed: boolean;
  isActive: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  toggleMenu: (idx: number) => void;
  children?: React.ReactNode;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  idx,
  collapsed,
  isActive,
  hasChildren,
  isExpanded,
  toggleMenu,
  children
}) => {
  const location = useLocation();

  // Dashboard special case
  if (item.text === "Dashboard") {
    if (collapsed) {
      return (
        <li className="flex flex-col items-center">
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
      <li className="flex flex-col">
        <Link
          to={item.path}
          className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-start
          ${isActive ? 'bg-[var(--light-purple-color)]' : 'hover:bg-[var(--light-purple-color)]'}`}>
          <div className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full mr-3 group-hover:bg-[var(--puprle-color)]
              ${isActive ? 'bg-[var(--puprle-color)]' : 'bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]'} transition duration-300`}>
            {item.icon}
          </div>
          {item.text}
        </Link>
      </li>
    );
  }

  // All other items
  return (
    <li className="flex flex-col justify-center items-center">
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
                  {item.children && item.children.map((sub, subidx) => (
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
                {item.children && item.children.map((sub, subidx) => (
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
};

export default SidebarNavItem;

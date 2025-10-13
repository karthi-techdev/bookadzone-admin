import { Link, useLocation } from "react-router-dom";
import BAZButton from "../atoms/BAZ-Button";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { TbMenu2 } from "react-icons/tb";
import { RiListIndefinite } from "react-icons/ri";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { useAuthStore } from "../stores/AuthStore";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";


interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { menus } = useAuthStore();
  const [expandedMenuIdx, setExpandedMenuIdx] = useState<number | null>(null);

  const getIcon = (iconName?: string): JSX.Element => {
  if (!iconName) return <RiListIndefinite />;

  // Split library and component name (e.g., "BsUiChecks" → "Bs" + "UiChecks")
  const [library, ...componentParts] = iconName.split(/(?=[A-Z])/);
  const componentName = componentParts.join("");

  // Map supported libraries
  const libraryMap: { [key: string]: any } = {
    Bs: BsIcons,
    Md: MdIcons,
    Fa: FaIcons,
    Ri: RiIcons,
    Hi: { HiOutlineMenuAlt1 },
    Tb: { TbMenu2 },
    Fi: { FiChevronDown, FiChevronRight },
    Io: IoIcons,
    Io5: Io5Icons,
  };

  // If the icon exists, render it, else fallback to RiListIndefinite
  const IconComponent =
    libraryMap[library]?.[`${library}${componentName}`] ||
    libraryMap[library]?.[componentName] ||
    RiListIndefinite;

  return <IconComponent />;
};



  useEffect(() => {
    if (!menus) return;
    let matchedIdx: number | null = null;
    menus.forEach((item, idx) => {
      if (item.children && item.children.some((child) => location.pathname.startsWith(child.path))) {
        matchedIdx = idx;
      }
    });
    setExpandedMenuIdx(matchedIdx);
  }, [location.pathname, menus]);

  const toggleMenu = (idx: number) => {
    setExpandedMenuIdx((prev) => (prev === idx ? null : idx));
  };

  if (!menus) {
    return <div>Loading...</div>;
  }


  const sortedMenus = [...menus].sort((a, b) => {
    const orderA = a.sequenceOrder !== undefined ? a.sequenceOrder : Infinity;
    const orderB = b.sequenceOrder !== undefined ? b.sequenceOrder : Infinity;
    return orderA - orderB;
  });

  return (
    <motion.div
      initial={{ x: -220, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -220, opacity: 0 }}
      style={{ overflowY: "auto", height: "100%" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 1.8 }}
      className={`custom-scroll pb-20 flex flex-col px-3 bg-[var(--light-dark-color)] h-[100dvh] fixed left-0 top-[60px] border-r border-r-[var(--light-blur-grey-color)] backdrop-blur-md transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[210px]"
        }`}
    >
      <BAZButton
        className={`text-[.90rem] font-semibold flex items-center text-[var(--white-color)] w-full mt-4 ${collapsed ? "justify-center" : "justify-between"
          }`}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {!collapsed && "Menu"}
        {collapsed ? <TbMenu2 className="text-[1.3rem]" /> : <HiOutlineMenuAlt1 className="text-[1.3rem]" />}
      </BAZButton>

      <div className="nav-links-side">
        <ul className="text-[.90rem]">
          {sortedMenus.map((item, idx) => {
            const isActive =
              (item.path && location.pathname === item.path) ||
              (item.children && item.children.some((child) => location.pathname.startsWith(child.path)));
            const hasChildren = !!item.children && item.children.length > 0;
            const isExpanded = expandedMenuIdx === idx;

            if (item.special) {
              if (collapsed) {
                return (
                  <li key={idx} className="flex flex-col items-center">
                    <Tippy content={item.name} placement="right" arrow={true}>
                      <Link
                        to={item.path || "#"}
                        className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-center ${isActive ? "bg-[var(--light-purple-color)]" : "hover:bg-[var(--light-purple-color)]"
                          }`}
                      >
                        <div
                          className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full group-hover:bg-[var(--puprle-color)] ${isActive
                              ? "bg-[var(--puprle-color)]"
                              : "bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]"
                            } transition duration-300`}
                        >
                          {getIcon(item.icon)}
                        </div>
                      </Link>
                    </Tippy>
                  </li>
                );
              }
              return (
                <li key={idx} className="flex flex-col">
                  <Link
                    to={item.path || "#"}
                    className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-start ${isActive ? "bg-[var(--light-purple-color)]" : "hover:bg-[var(--light-purple-color)]"
                      }`}
                  >
                    <div
                      className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full mr-3 group-hover:bg-[var(--puprle-color)] ${isActive
                          ? "bg-[var(--puprle-color)]"
                          : "bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]"
                        } transition duration-300`}
                    >
                      {getIcon(item.icon)}
                    </div>
                    {item.name}
                  </Link>
                </li>
              );
            }
            return (
              <li key={idx} className="flex flex-col justify-center items-center">
                {collapsed ? (
                  <Tippy content={item.name} placement="right" arrow={true}>
                    <div>
                      <div
                        className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-center ${isActive ? "bg-[var(--light-purple-color)]" : "hover:bg-[var(--light-purple-color)]"
                          }`}
                        onClick={hasChildren ? () => toggleMenu(idx) : undefined}
                        style={{ cursor: hasChildren ? "pointer" : "auto" }}
                      >
                        <div
                          className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full group-hover:bg-[var(--puprle-color)] ${isActive
                              ? "bg-[var(--puprle-color)]"
                              : "bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]"
                            } transition duration-300`}
                        >
                          {getIcon(item.icon)}
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
                            {item.children!.map((sub, subidx) => (
                              <li key={subidx} className="mt-2 flex flex-col items-center justify-center">
                                <Tippy content={sub.name} placement="right" arrow={true}>
                                  <Link
                                    to={sub.path}
                                    className={`flex items-center justify-center h-[35px] w-[35px] rounded-full text-[var(--white-color)] ${location.pathname === sub.path
                                        ? "bg-[var(--puprle-color)]"
                                        : "bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]"
                                      } transition duration-300`}
                                  >
                                    <span className="text-[.68rem]">{sub.name[0]}</span>
                                  </Link>
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
                      className={`group flex items-center text-[.78rem] text-[var(--white-color)] w-full mt-3 p-1 font-medium rounded-full justify-start ${isActive ? "bg-[var(--light-purple-color)]" : "hover:bg-[var(--light-purple-color)]"
                        } ${hasChildren && "cursor-pointer"}`}
                      onClick={hasChildren ? () => toggleMenu(idx) : undefined}
                    >
                      <div
                        className={`flex items-center justify-center text-[.90rem] h-[35px] w-[35px] rounded-full mr-3 group-hover:bg-[var(--puprle-color)] ${isActive
                            ? "bg-[var(--puprle-color)]"
                            : "bg-[var(--white-glass-color)] hover:bg-[var(--puprle-color)]"
                          } transition duration-300`}
                      >
                        {getIcon(item.icon)}
                      </div>
                      <span className="flex-1">{item.name}</span>
                      {hasChildren && (
                        <span className="mr-2">{isExpanded ? <FiChevronDown /> : <FiChevronRight />}</span>
                      )}
                    </div>
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 w-full"
                        >
                          {item.children!.map((sub, subidx) => (
                            <li key={subidx} className="mt-2 mr-2">
                              <Link
                                to={sub.path}
                                className={`flex items-center text-[.68rem] text-[var(--white-color)] p-2 pl-4 rounded-full font-medium ${location.pathname.startsWith(sub.path)
                                    ? "bg-[var(--puprle-color)]"
                                    : "hover:bg-[var(--puprle-color)]"
                                  } transition duration-300`}
                              >
                                {sub.name}
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
  );
};

export default Sidebar;
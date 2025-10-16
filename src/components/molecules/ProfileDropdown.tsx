import React, { useRef, useState, useEffect } from "react";
import Button from "../atoms/BAZ-Button";
import { GoOrganization } from "react-icons/go";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProfileDropdown: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown relative" ref={profileRef}>
      <Button className="flex items-center justify-center gap-2" onClick={() => setProfileOpen((prev) => !prev)}>
        <div className="profile-img h-[30px] w-[30px] flex items-center justify-center rounded-full bg-[var(--white-glass-color)]">
          <GoOrganization className="text-[1rem] text-[var(--white-color)]" />
        </div>
        <div className="profile-btn-content">
          <span className="text-[.80rem] font-medium text-[var(--white-color)] flex">Focus Media</span>
          <span className="text-[.50rem] text-[var(--light-grey-color)] flex">Admin</span>
        </div>
      </Button>
      {profileOpen && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -right-3 mt-4 w-40 rounded-[0px_15px_0px_15px] bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded shadow-lg z-50 text-[.75rem] backdrop-blur-md"
        >
          <Link to="/profile" className="block px-4 py-2 text-[var(--white-color)] hover:bg-[var(--light-purple-color)] transition-all duration-200">Profile</Link>
          <Link to="/settings" className="block px-4 py-2 text-[var(--white-color)] hover:bg-[var(--light-purple-color)] transition-all duration-200">Settings</Link>
          <Button
            className="block w-full text-left px-4 py-2 text-[var(--white-color)] hover:bg-[var(--light-purple-color)] transition-all duration-200"
            onClick={() => {}}
          >
            Logout
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileDropdown;

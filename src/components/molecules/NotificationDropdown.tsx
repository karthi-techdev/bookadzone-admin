import React, { useRef, useState, useEffect } from "react";
import Button from "../atoms/BAZ-Button";
import BAZNotificationItem from "../atoms/BAZ-NotificationItem";
import { RiNotification2Fill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export interface Notification {
  to: string;
  avatar: string;
  name: string;
  org: string;
  message: string;
  time: string;
  unread: boolean;
}

const notifications: Notification[] = [
  {
    to: "/",
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    name: "Karthi Rajendhiran",
    org: "Skoda Motors",
    message: "Submitted a new booking request for “Medavakkam Flyover” billboard.",
    time: "2 hours ago",
    unread: true,
  },
  {
    to: "/",
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    name: "Rajesh Kumar",
    org: "Honda Motors",
    message: "Uploaded the final ad design for campaign #BAZ4325.",
    time: "3 hours ago",
    unread: true,
  },
  {
    to: "/",
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    name: "Vijay Kumar",
    org: "Sony India Pvt Ltd",
    message: "Completed KYC verification. Ready for property assignment.",
    time: "5 hours ago",
    unread: false,
  },
  {
    to: "/",
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    name: "Arun Kumar",
    org: "Nike Fashions",
    message: "Ad payment of ₹1,50,000 received for campaign ID #BAZ3241.",
    time: "5 hours ago",
    unread: false,
  },
];

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center flex-col" ref={notifRef}>
      <Button className="relative focus:outline-none" onClick={() => setOpen((prev) => !prev)}>
        <RiNotification2Fill className="text-lg text-[var(--white-color)]" />
        <span className="absolute -top-1 -right-1 text-[.50rem] text-white h-3 w-3 bg-[var(--puprle-color)] rounded-full flex items-center justify-center">
          {notifications.filter(n => n.unread).length}
        </span>
      </Button>
      {open && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute -right-2 mt-10 w-[350px] rounded-[7px] shadow-lg z-50 bg-[var(--light-dark-color)] border-[1px] border-[var(--light-blur-grey-color)] backdrop-blur-md"
        >
          <div className="m-3 pb-2 border-b-[1px] border-b-[var(--light-blur-grey-color)] flex items-center justify-between">
            <span className="flex font-semibold text-[.75rem] text-[var(--white-color)]">Notifications</span>
            <Button className="text-[.60rem] bg-[var(--puprle-color)] text-[var(--white-color)] px-2.5 py-1 rounded-[2px] flex items-center gap-1">
              <FaCheck />All Read
            </Button>
          </div>
          <ul className="max-h-60 overflow-y-auto py-0.5 custom-scrollbar pr-[5px]">
            {notifications.map((n, i) => (
              <BAZNotificationItem key={i} {...n} />
            ))}
          </ul>
          <div className="text-center m-3">
            <Link to="/notification" className="text-[.70rem] bg-[var(--puprle-color)] text-[var(--white-color)] w-full h-full flex items-center justify-center py-1.5 rounded-[3px] mt-2">
              View all
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationDropdown;

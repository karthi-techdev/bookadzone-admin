import type { ReactNode, FC } from "react";
import BAZDefultAvatar from "./BAZ-DefaultAvatar";
import { Link } from "react-router-dom";

// Define props interface for the NotificationItem component
interface NotificationItemProps {
  to: string;
  avatar: string;
  name: string;
  org: string;
  message: string;
  time: string;
  unread: boolean;
}

const BAZNotificationItem: FC<NotificationItemProps> = ({ to, avatar, name, org, message, time, unread }) => (
  <li className="py-2 px-3 hover:bg-[var(--light-purple-color)] transition-all duration-200">
    <Link to={to} className="flex items-center item-center justify-between">
      <div className="avatar-img h-[50px] w-[30px] flex items-start justify-left">
        <BAZDefultAvatar src={avatar} alt="Avatar" />
      </div>
      <div className="content w-[250px]">
        <span className="text-[.70rem] text-[var(--white-color)] font-semibold flex items-center mb-1">
          {name}
          <span className="ml-2 text-[.50rem] font-normal text-[var(--light-grey-color)] flex">{org}</span>
        </span>
        <p className="text-[.60rem] text-[var(--light-grey-color)]">{message}</p>
        <span className="text-[.50rem] text-[var(--light-grey-color)] flex mt-0.5">{time}</span>
      </div>
      <span className={`${unread ? "not-read-point bg-[var(--puprle-color)]" : "read-point"} h-[8px] w-[8px] rounded-full flex`}></span>
    </Link>
  </li>
);

export default BAZNotificationItem;
import type { ReactNode, FC } from "react";
import BAZButton from "./BAZ-Button";
import { FiSearch } from "react-icons/fi";

const BAZSearchBox: FC = () => (
  <div className="search-box w-[35vw] flex items-center justify-between border-[1px] border-[var(--light-blur-grey-color)] p-1 rounded-bl-[20px] rounded-tr-[20px] rounded-tl-[5px] rounded-br-[5px] bg-[var(--light-dark-color)] backdrop-blur-md">
    <FiSearch className="text-[1.3rem] ml-2 text-[var(--light-grey-color)]" />
    <input
      type="search"
      placeholder="Search..."
      className="outline-none text-[var(--white-color)] placeholder:text-[var(--light-grey-color)] text-[.80rem] px-3 w-full"
    />
    <BAZButton className="bg-[var(--puprle-color)] text-[var(--white-color)] text-[.80rem] px-5 py-1.5 rounded-bl-[20px] rounded-tr-[20px] rounded-tl-[5px] rounded-br-[5px]">
      Search
    </BAZButton>
  </div>
);

export default BAZSearchBox;
import  { useState  } from "react";
import  type {  FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../organisms/Navbar";
import Sidebar from "../organisms/Sidebar";

// Define props interface for the Layout component
interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const isLoginPage: boolean = location.pathname === "/login";

  return (
    <>
      <div className="fixed top-0 inset-0 bg-[url('/src/assets/image/background/blurry-hero-animated.svg')] h-[100dvh] w-full bg-cover bg-no-repeat bg-center blur-[185px] z-[-1000]"></div>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      {!isLoginPage && (
        <div className="h-[60px] backdrop-blur-md fixed top-0 left-0 right-0 -z-0"></div>
      )}
      <main
        className={`table-list w-[85%] transition-all duration-300  ${
          isLoginPage ? "mt-0 ml-0" : "mt-[70px] " + (collapsed ? "ml-[70px]" : "ml-[210px]")
        }`}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
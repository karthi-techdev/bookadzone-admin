import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../organisms/Navbar";
import Sidebar from "../organisms/Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/Login";

  return (
    <>
      <div className="fixed top-0 inset-0 bg-[url('/src/assets/image/background/blurry-hero-animated.svg')] h-[100dvh] w-full bg-cover bg-no-repeat bg-center blur-[185px] z-[-1000]"></div>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      {!isLoginPage && (
        <div className="h-[60px] backdrop-blur-md fixed top-0 left-0 right-0 -z-0"></div>
      )}
      <main
        className={`transition-all duration-300 px-4 ${
          isLoginPage ? "mt-0 ml-0" : "mt-[70px] " + (collapsed ? "ml-[70px]" : "ml-[210px]")
        }`}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
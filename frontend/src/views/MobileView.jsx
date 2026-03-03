import React from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import MobileHeader from "../components/layouts/MobileHeader";
import MobileFooter from "../components/layouts/MobileFooter";

export default function MobileView() {
  const location = useLocation();
  const isFullPageView = location.pathname.startsWith("/profile") || location.pathname === "/search" || location.pathname === "/settings";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header fijo */}
      {!isFullPageView && (
        <MobileHeader />
      )}
      
      <main className={`grow ${isFullPageView ? 'pt-0' : 'pt-[70px]'} pb-24 w-full overflow-y-auto`}>
        <Outlet />
      </main>

      <MobileFooter />
    </div>
  );
}
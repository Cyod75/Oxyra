import React from "react";
import { Outlet, useLocation } from "react-router-dom"; 
import MobileHeader from "../components/layouts/MobileHeader";
import MobileFooter from "../components/layouts/MobileFooter";

export default function MobileView() {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile") || location.pathname === "/search";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header fijo */}
      {!isProfilePage && (
        <div className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all">
          <MobileHeader />
        </div>
      )}
      
      <main className={`grow ${isProfilePage ? 'pt-0' : 'pt-[70px]'} pb-24 w-full overflow-y-auto`}>
        <Outlet />
      </main>

      <MobileFooter />
    </div>
  );
}
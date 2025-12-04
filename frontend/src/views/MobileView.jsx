import React from "react";
import ThemeController from "../components/ThemeController";
import MobileHeader from "../components/mobile/MobileHeader";
import MobileFooter from "../components/mobile/MobileFooter";

export default function MobileView() {
  return (
    <div className="pt-16 px-3">
      <MobileHeader />
      <ThemeController />
      <MobileFooter />
    </div>
  );
}

import React from "react";
import Header from "../../../components/Security_Officer/Layout/Header";
import ScannerComponent from "../../../components/Security_Officer/Scanner/Scanner";

const Scanner = () => {
  return (
    <div className="flex flex-col min-w-0 h-full">
      <Header title="QR Code Scanner" />
      <div className="flex-1 overflow-y-auto">
        <ScannerComponent />
      </div>
    </div>
  );
};

export default Scanner;

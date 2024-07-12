import React, { FC } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children?: React.ReactNode;
  name?: string;
}
const LayoutAdmin: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen" data-theme="light">
        <div className="flex flex-grow ">
          <div className="z-50 shadow-md">
            <Sidebar />
          </div>
          <div className="w-full bg-color-1">
            <div className="">
              <Navbar />
            </div>
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutAdmin;

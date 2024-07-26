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
      <div className="flex h-screen w-screen" data-theme="light">
        <div className=" flex flex-col ">
          <div className="z-10 shadow-md top-0 sticky h-screen">
            <Sidebar />
          </div>
        </div>
        <div className="flex-1 flex flex-col w-[70%]">
          <div className="sticky top-0 z-10">
            <Navbar />
          </div>
          <div className="flex-1 overflow-y-auto w bg-blue-300">{children}</div>
        </div>
      </div>
    </>
  );
};

export default LayoutAdmin;

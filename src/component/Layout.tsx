// LayoutAdmin.tsx
import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { LoginStore } from "../store/Store"; // Import your authentication store

interface Props {
  children?: React.ReactNode;
  name?: string;
}

const LayoutAdmin: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const { token } = LoginStore();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen" data-theme="light">
      <div className="flex flex-col">
        <div className="z-20 shadow-md top-0 sticky h-screen">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 flex flex-col w-[70%]">
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto bg-blue-300">{children}</div>
      </div>
    </div>
  );
};

export default LayoutAdmin;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import GridComponent from "../../components/GridComponent";
import Navbar from "../../components/Navbar";
import WorkspaceSidebar from "./WorkspaceSidebar";

export default function Workspace() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <GridComponent>
      <Navbar />

      <div className="flex min-h-screen pt-[72px]">
        <WorkspaceSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main
          className="flex-1 transition-all duration-300 p-8 text-white"
          style={{ marginLeft: collapsed ? "68px" : "240px" }}
        >
            
          <Outlet />
        </main>
      </div>
    </GridComponent>
  );
}

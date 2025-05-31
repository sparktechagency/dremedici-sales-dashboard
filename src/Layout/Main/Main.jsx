import React from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar fixed on left */}
        <div className="w-1/6 min-w-[250px] border-r-2 border-primary bg-baseBg fixed top-0 left-0 bottom-0 z-20">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 ml-[16.66%]">
          {/* Header fixed
          <div className="h-[68px] fixed top-0 left-[16.66%] right-0 bg-baseBg z-30 flex items-center border-b border-primary">
            <Header />
          </div> */}

          {/* Scrollable Outlet area */}
          <main
            className="flex-1 pt-[68px] overflow-auto bg-baseBg px-4 py-6 rounded-md lg:px-10"
            style={{ height: "calc(100vh - 68px)" }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    );
}

export default Main
import React, { Fragment, useRef } from 'react';
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Users from './pages/Users.jsx';
import Trash from './pages/Trash.jsx';
import TaskDetails from './pages/TaskDetails.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import { setOpenSidebar } from "./redux/slices/authSlice";
import UserDetails from './pages/UserDetails.jsx'; 
import DailyReport from './pages/DailyReport.jsx';
import UserReports from './pages/UserReports.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to='/log-in' state={{ from: location }} replace />;
  }

  // Role-based redirection for Super Admin
  if (user.isSuperAdmin && location.pathname !== "/SuperAdminDashboard") {
    return <Navigate to='/SuperAdminDashboard' replace />
  }

  return (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />
        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div
          ref={(node) => (mobileMenuRef.current = node)}
          className={clsx(
            "md:hidden w-full h-full bg-black/40 transition-transform duration-700 transform",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={closeSidebar}
        >
          <div className='bg-white w-3/4 h-full'>
            <div className='w-full flex justify-end px-5'>
              <button
                onClick={closeSidebar}
                className='flex justify-end items-end mt-5'
              >
                <IoClose size={25} />
              </button>
            </div>

            <div className='-mt-6'>
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

const App = () => {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
      <Routes>
        <Route element={<Layout />}>

          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/completed/:status' element={<Tasks />} />
          <Route path='/in-progress/:status' element={<Tasks />} />
          <Route path='/todo/:status' element={<Tasks />} />
          <Route path='/overdue/:status' element={<Tasks />} />
          <Route path='/team' element={<Users />} />
          <Route path='/dailyreport' element={<DailyReport />} />
          <Route path="/users/:userId/reports" element={<UserReports />} />
          <Route path="/users/:userId/tasks" element={<UserDetails />} />
          <Route path='/trashed' element={<Trash />} />
          <Route path='/task/:id' element={<TaskDetails />} />

          {/* Super Admin Routes */}
          <Route path='/SuperAdminDashboard' element={<SuperAdminDashboard />} />

        </Route>
        <Route path='/log-in' element={<Login />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
};

export default App;

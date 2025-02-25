import React from "react";
import { useSelector } from "react-redux";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FiEdit  } from "react-icons/fi";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import UserInfo from "../components/UserInfo";
import Loading from "../components/Loader";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    High: <MdKeyboardDoubleArrowUp />,
    Medium: <MdKeyboardArrowUp />,
    Low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 '>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Team</th>
        <th className='py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />

          <p className='text-base text-black'>{task.title}</p>
        </div>
      </td>

      <td className='py-2'>
        <div className='flex gap-1 items-center'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize'>{task.priority}</span>
        </div>
      </td>

      <td className='py-2'>
        <div className='flex'>
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className='py-2 hidden md:block'>
        <span className='text-base text-gray-600'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <>
      <div className='max-w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='border-b border-gray-300 '>
      <tr className='text-black  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200  text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-[#229ea6]'>
            <span className='text-center'>{getInitials(user?.name)}</span>
          </div>

          <div>
            <p> {user.name}</p>
            <span className='text-xs text-black'>{user?.role}</span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            "w-fit px-3 py-1 rounded-full text-sm",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>
      <td className='py-2 text-sm'>{moment(user?.createdAt).fromNow()}</td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <table className='w-full mb-5'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const user = useSelector((state) => state.auth);
  const tenantId = user?.tenantId;  // Extract tenantId from user state

  const { data, isLoading } = useGetDashboardStatsQuery({ tenantId });


  if (isLoading)
    return (
      <div className="py-10">
        <Loading />
      </div>
    );

  const totals = data?.tasks;

  const pieChartData = [
    { name: "Completed", total: totals?.completed || 0 },
    { name: "In Progress", total: totals?.["in progress"] || 0 },
    { name: "To Do", total: totals?.todo || 0 },
  ];

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-violet-600",
      textColor: "text-violet-600",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: totals?.completed || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: totals?.["in progress"] || 0,
      icon: <FiEdit />,
      bg: "bg-yellow-600",
      textColor: "text-yellow-600",
    },
    {
      _id: "4",
      label: "TO DO",
      total: totals?.todo || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-blue-600",
      textColor: "text-blue-600",
    },
  ];

  const Card = ({ label, count, bg, icon, textColor }) => {
    return (
      <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className={`text-base ${textColor}`}>{label}</p>
          <span className={`text-2xl font-semibold ${textColor}`}>{count}</span>
          <span className={`text-sm ${textColor}`}>{"110 last month"}</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className='h-full py-4'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats.map(({ icon, bg, label, total, textColor }, index) => (
          <Card
            key={index}
            icon={icon}
            bg={bg}
            label={label}
            count={total} 
            textColor={textColor}
          />
        ))}
      </div>

      <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
        <h4 className='text-xl text-gray-600 font-semibold'>
          Task Overview
        </h4>
        <div className="md:flex">
          {/* Pass different datasets to each Chart */}
          <div className="md:w-1/2 p-4">
            <Chart data={data?.graphData} />
          </div>

          <div className="md:w-1/2 p-4">
            <Chart data={pieChartData} />
          </div>
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
        {/* /left */}

        <TaskTable tasks={data?.last10Task} />

        {/* /right */}

        {user && data?.users && (
          <UserTable users={data?.users?.filter(user => user.tenantId === tenantId)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
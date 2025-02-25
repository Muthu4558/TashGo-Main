import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";
import { MdAssignment } from 'react-icons/md';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='w-full h-fit bg-white shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>

          {user && <TaskDialog task={task} />}
        </div>

        <>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center my-1">
                <MdAssignment style={{ marginRight: '10px' }} />
                <p className="text-blue-700">Task Tittle</p>
              </div>
              <div className='flex items-center gap-2 mt-1'>
                <div
                  className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}
                />
                <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
              </div>

            </div>
            <div className="flex flex-col">
              {/* <span className='text-sm text-gray-600'>
                Due Date  "{formatDate(new Date(task?.date))}"
              </span> */}
              <h4 className="text-red-600">Due Date</h4>
              <p>{formatDate(new Date(task?.date))}</p>
            </div>
          </div>
        </>

        <div className='w-full border-t border-gray-200 my-2' />
        <div className='flex items-center justify-between mb-2'>
          {/* <div className='flex items-center gap-3'>
            <div className='flex gap-1 items-center text-sm text-gray-600'>
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-sm text-gray-600 '>
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-sm text-gray-600 '>
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div> */}

          <div className='flex flex-row-reverse'>
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {task?.subTasks?.length > 0 ? (
          <div className='py-2 border-t border-gray-200'>
            <h5 className='text-base line-clamp-1 text-black'>
              {task?.subTasks[0].title}
            </h5>

            <div className='py-2 space-x-8'>
              <span className='text-sm text-gray-600'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className='bg-blue-600/10 px-3 py-1 rounded0full text-blue-700 font-medium'>
                {task?.subTasks[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className='py-4 border-t border-gray-200'>
              {/* <span className='text-gray-500'>No More Task</span> */}
            </div>
          </>
        )}

        <div className='w-full pb-2'>
          <button
            onClick={() => setOpen(true)}
            className='flex gap-2 px-4 items-center text-sm bg-[#229ea6] rounded-2xl text-white p-2 font-semibold disabled:cursor-not-allowed'
          >
            <IoMdAdd className='text-lg' />
            <span>ADD MORE TASK</span>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task?._id} />
    </>
  );

};

export default TaskCard;
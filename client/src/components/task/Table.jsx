import React, { useState, Suspense } from "react";
import { toast } from "sonner";
import { BGS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import UserInfo from "../UserInfo";
import ConfirmatioDialog from "../Dialogs";
import { useTrashTaskMutation, useUpdateTaskMutation } from "../../redux/slices/api/taskApiSlice";
import TaskDialog from "./TaskDialog";
import { MdCheckBoxOutlineBlank, MdAccessTime, MdCheckCircle, MdDownload } from "react-icons/md";
import { useSelector } from "react-redux";

// Dynamically import XLSX to avoid build issues in production
const XLSX = React.lazy(() => import("xlsx"));

const ICONS1 = {
  todo: <MdCheckBoxOutlineBlank />,
  "in progress": <MdAccessTime />,
  completed: <MdCheckCircle />,
};

const Table = ({ tasks = [] }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [taskStage, setTaskStage] = useState("");
  const [trashtask] = useTrashTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const deleteHandler = async () => {
    try {
      const result = await trashtask({ id: selected, isTrash: "trash" }).unwrap();
      toast.success(result?.message || "Task moved to trash successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while deleting the task.");
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const clearFilters1 = () => {
    setTaskStage("");
  };

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task?.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && taskDate < start) return false;
    if (end && taskDate > end) return false;
    if (taskStage && task.stage !== taskStage) return false;
    return true;
  });

  // Function to handle CSV download
  const downloadExcel = async () => {
    try {
      const excelData = filteredTasks.map((task) => ({
        "Task Title": task?.title || "No title",
        "Assigned Date": formatDate(new Date(task?.createdAt)),
        "Due Date": formatDate(new Date(task?.date)),
        Team: task?.team?.map((member) => member.name).join(", "),
        Status: task?.stage,
      }));

      // Dynamically load the XLSX library
      const { utils, writeFile } = await import("xlsx");

      // Create a new workbook and add a worksheet
      const worksheet = utils.json_to_sheet(excelData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Tasks");

      // Write the Excel file and trigger download
      writeFile(workbook, "task_list.xlsx");
    } catch (error) {
      console.error("Failed to generate Excel file:", error);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Assigned Date</th>
        <th className="py-2">Due Date</th>
        <th className="py-2">Team</th>
        <th className="py-2">Status</th>
        <th className="py-2 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage] || "bg-gray-400")} />
          <p className="line-clamp-2 text-base text-black">{task?.title || "No title"}</p>
        </div>
      </td>
      <td className="py-2 text-sm text-gray-600">{formatDate(new Date(task?.createdAt))}</td>
      <td className="py-2 text-sm text-gray-600">{formatDate(new Date(task?.date))}</td>
      <td className="py-2">
        <div className="flex">
          {task?.team?.map((member, index) => (
            <div
              key={member._id || index}
              className={clsx("w-7 h-7 rounded-full text-white flex items-center justify-center text-sm", BGS[index % BGS.length])}
            >
              <UserInfo user={member} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-2">
        <div className="flex gap-2 items-center">
          <div
            className={clsx(
              "w-7 h-7 flex items-center justify-center rounded-full",
              task.stage === "todo" ? "bg-blue-600" :
                task.stage === "in progress" ? "bg-yellow-600" :
                  task.stage === "completed" ? "bg-green-600" : "bg-gray-400"
            )}
          >
            <div className="text-white">
              {ICONS1[task.stage] || ICONS1["todo"]}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600 capitalize">{task.stage}</span>
          </div>
        </div>
      </td>
      <td className="py-2 flex gap-2 justify-end">
        {user && <TaskDialog task={task} />}
      </td>
    </tr>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="flex justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm text-gray-600">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm text-gray-600">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <button
              onClick={clearFilters}
              className="bg-[#229ea6] text-white font-semibold px-4 py-1 mt-5 rounded"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-1">
            <div>
              <label htmlFor="taskStage" className="block text-sm text-gray-600">Status Filter:</label>
              <select
                id="taskStage"
                value={taskStage}
                onChange={(e) => setTaskStage(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All</option>
                <option value="todo">To-Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <button
                onClick={clearFilters1}
                className="bg-[#229ea6] text-white font-semibold px-4 py-1 mt-5 rounded"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-5">
              <div>
                <button
                  onClick={downloadExcel}
                  className="bg-[#229ea6] text-white font-semibold px-4 py-1 rounded flex items-center gap-2"
                >
                  <MdDownload />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          {filteredTasks.length > 0 ? (
            <table className="w-full">
              <TableHeader />
              <tbody>
                {filteredTasks.map((task) => (
                  <TableRow key={task._id || task.title} task={task} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">No tasks found</div>
          )}
        </div>
      </div>

      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
    </Suspense>
  );
};

export default Table;

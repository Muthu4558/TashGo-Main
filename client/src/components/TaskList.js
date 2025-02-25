import React, { useState } from "react";
import TaskCard from "./TaskCard";
import AddTask from "./task/AddTask";
import Button from "./Button";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  // Function to handle adding a task
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <Button
        label="Add New Task"
        onClick={() => setOpen(true)}
        className="mb-4 bg-blue-600 text-white"
      />

      <div className="grid grid-cols-1 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p>No tasks available. Add a new task to get started!</p>
        )}
      </div>

      <AddTask open={open} setOpen={setOpen} onAddTask={handleAddTask} />
    </div>
  );

};

export default TaskList;

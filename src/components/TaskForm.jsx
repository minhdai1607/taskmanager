import React, { useState, useEffect } from "react";

function TaskForm({ onAddTask, initialTask }) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");

  useEffect(() => {
    if (initialTask) {
      setTaskName(initialTask.name || "");
      setTaskDescription(initialTask.description || "");
      setTaskStatus(initialTask.status || "To Do");
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (taskName.trim() && taskDescription.trim()) {
      const task = {
        name: taskName,
        description: taskDescription,
        status: taskStatus,
      };

      if (initialTask?.id) {
        task.id = initialTask.id;
      }

      onAddTask(task); // Gửi dữ liệu task về cho App xử lý (tạo mới hoặc cập nhật)
      
      // Reset form
      setTaskName("");
      setTaskDescription("");
      setTaskStatus("To Do");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {initialTask ? "Edit Task" : "Create New Task"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="taskName">
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="taskDescription">
          Task Description
        </label>
        <textarea
          id="taskDescription"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="taskStatus">
          Status
        </label>
        <select
          id="taskStatus"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Double-check">Double-check</option>
          <option value="Shipping">Shipping</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {initialTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;

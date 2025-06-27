import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import Column from "./components/Column"; 

import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable  } from "@hello-pangea/dnd";


const isMobile = window.innerWidth < 768;

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateType, setDateType] = useState("createdAt");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("To Do");
  const [taskToEdit, setTaskToEdit] = useState(null);

  //drag dop
  const onDragEnd = async (result) => {
  const { source, destination, draggableId } = result;

  if (!destination) return; // Không thả vào nơi hợp lệ

  const task = tasks.find((t) => t.id === draggableId);
  if (!task || task.status === destination.droppableId) return;

  try {
    const taskRef = doc(db, "tasks", draggableId);
    await updateDoc(taskRef, {
      status: destination.droppableId,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật task khi kéo:", error);
  }
};

  // Load task từ Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(data);
    });

    return () => unsubscribe();
  }, []);
  // delete task
  

  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, "tasks", confirmDeleteId));
      setConfirmDeleteId(null); // đóng modal
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Thêm task vào Firestore
  const saveTask = async (task) => {
  try {
    const now = new Date();

    if (taskToEdit && taskToEdit.id) {
      const taskRef = doc(db, "tasks", taskToEdit.id);
      await updateDoc(taskRef, {
        ...task,
        updatedAt: now,
      });
    } else {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...task,
        createdAt: now,
        updatedAt: now,
      });
      console.log("Tạo task thành công với ID:", docRef.id);
    }

    setTaskToEdit(null);
    setShowForm(false);
  } catch (err) {
    console.error("Lỗi khi lưu task:", err);
    alert("Không thể lưu task. Vui lòng thử lại.");
  }
};

  // Lọc task theo search + ngày
  const filteredTasks = tasks
    .filter((t) =>
      t.name.toLowerCase().includes(searchText.toLowerCase()) ||
      t.description.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((t) => {
      const value = t[dateType];
      if (!value) return false;

      const dateStr = new Date(value.seconds * 1000).toISOString().split("T")[0]; // Firestore timestamp
      const afterFrom = !fromDate || dateStr >= fromDate;
      const beforeTo = !toDate || dateStr <= toDate;

      return afterFrom && beforeTo;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Manager</h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Close Form" : "+ Create Task"}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or description"
          className="border p-2 rounded w-64"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
        >
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Updated Date</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <span>to</span>
        <input
          type="date"
          className="border p-2 rounded"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      {isMobile && (
  <div className="mb-4 flex justify-center">
    <select
      value={selectedColumn}
      onChange={(e) => setSelectedColumn(e.target.value)}
      className="border p-2 rounded w-64"
    >
      <option value="To Do">📝 To Do</option>
      <option value="In Progress">🚧 In Progress</option>
      <option value="Double-check">🔍 Double-check</option>
      <option value="Shipping">📦 Shipping</option>
      <option value="Done">✅ Done</option>
    </select>
  </div>
)}

      {showForm && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setShowForm(false)}
        />
      )}

      {showForm && (
        isMobile ? (
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-lg p-4 z-50 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowForm(false)} className="text-gray-600 font-bold text-lg">✖</button>
            </div>
            <TaskForm onAddTask={saveTask} initialTask={taskToEdit} />

          </div>
        ) : (
          <TaskForm onAddTask={saveTask} initialTask={taskToEdit} />
        )
      )}

      {isMobile ? (
  <div className="mt-6">
    <Column
      title={selectedColumn}
      tasks={filteredTasks.filter(t => t.status === selectedColumn)}
      onRequestDelete={(id) => setConfirmDeleteId(id)}
    />
  </div>
) : (
  <DragDropContext onDragEnd={onDragEnd}>
  <div className="flex gap-6 justify-start overflow-x-auto mt-6">
<Column
  title="📝 To Do"
  droppableId="To Do"
  tasks={filteredTasks.filter(t => t.status === "To Do")}
  onRequestDelete={setConfirmDeleteId}
  onEdit={(task) => {
    setTaskToEdit(task);
    setShowForm(true);
  }}
/>

<Column
  title="🚧 In Progress"
  droppableId="In Progress"
  tasks={filteredTasks.filter(t => t.status === "In Progress")}
  onRequestDelete={setConfirmDeleteId}
  onEdit={(task) => {
    setTaskToEdit(task);
    setShowForm(true);
  }}
/>

<Column
  title="🔍 Double-check"
  droppableId="Double-check"
  tasks={filteredTasks.filter(t => t.status === "Double-check")}
  onRequestDelete={setConfirmDeleteId}
  onEdit={(task) => {
    setTaskToEdit(task);
    setShowForm(true);
  }}
/>

<Column
  title="📦 Shipping"
  droppableId="Shipping"
  tasks={filteredTasks.filter(t => t.status === "Shipping")}
  onRequestDelete={setConfirmDeleteId}
  onEdit={(task) => {
    setTaskToEdit(task);
    setShowForm(true);
  }}
/>

<Column
  title="✅ Done"
  droppableId="Done"
  tasks={filteredTasks.filter(t => t.status === "Done")}
  onRequestDelete={setConfirmDeleteId}
/>
  </div>
  </DragDropContext>
)}

            {confirmDeleteId && (
        <DeleteConfirmModal
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={deleteTask}
        />
      )}

    </div>
  );
}

export default App;

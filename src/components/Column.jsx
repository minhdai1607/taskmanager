import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

function Column({ title, droppableId, tasks, onRequestDelete, onEdit }) {
  console.log("🔽 Droppable ID:", droppableId); // ✅ Debug droppable

  return (
    <div className="bg-gray-100 p-4 rounded-lg min-w-[250px]">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[50px]"
          >
            {tasks.map((task, index) => {
              if (!task.id) {
                console.warn("❌ Task thiếu ID:", task); // ⚠️ Warn nếu task thiếu id
                return null;
              }

              console.log("✅ Draggable ID:", task.id); // ✅ Debug id

              return (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white p-3 rounded shadow"
                    >
                      <h3 className="font-medium">{task.name}</h3>
                      <p className="text-sm">{task.description}</p>
                      <div className="flex justify-end gap-2 mt-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(task)}
                            className="text-blue-500 text-sm"
                          >
                            Edit
                          </button>
                        )}
                        {onRequestDelete && (
                          <button
                            onClick={() => onRequestDelete(task.id)}
                            className="text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {tasks.length === 0 && (
              <p className="text-gray-400 italic">No tasks</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;

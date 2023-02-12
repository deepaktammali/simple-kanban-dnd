import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRef } from "react";
import { TASK_STATUS } from "./constants";
import TaskForm from "./TaskForm";
import useStore from "./store";
import TaskContainer from "./TaskContainer";
import { nanoid } from "nanoid";

const containers = [
  { type: [TASK_STATUS.todo], heading: "Todo" },
  { type: [TASK_STATUS.inProgress], heading: "In Progress" },
  { type: [TASK_STATUS.completed], heading: "Completed" },
];

function App() {
  const moveTask = useStore((state) => state.moveTask);
  const addItem = useStore((state) => state.addItem);

  const newTaskDialogRef = useRef(null);

  const handleDragEnd = (event) => {
    if (event.over) {
      const { id: taskId, status: fromStatus } = event.active.data.current;
      const toStatus = event.over.id.split("-").at(-1);
      moveTask(taskId, fromStatus, toStatus);
    }
  };

  const closeDialog = () => {
    newTaskDialogRef.current.close();
  };

  const handleNewTask = (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const content = formData.get("content");
    const status = formData.get("status");

    const newTask = {
      content,
      status,
      id: nanoid(),
    };

    addItem(newTask, status);
    form.reset();
    closeDialog();
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <main>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <dialog
          ref={newTaskDialogRef}
          className="bg-black border border-zinc-500 max-w-xl w-full backdrop:opacity-40"
        >
          <TaskForm
            onSubmit={handleNewTask}
            closeDialog={closeDialog}
            title="New Task"
          />
        </dialog>
        <div className="gap-2 flex flex-col">
          <h1 className="text-white text-center text-xl">
            Simple Kanban With Drag and Drop
          </h1>
          <button
            className="px-2 py-1 text-white bg-zinc-900"
            onClick={(e) => {
              newTaskDialogRef.current?.showModal();
            }}
          >
            Add New Task
          </button>
          <div className="grid grid-cols-3 w-full gap-2">
            {containers.map((container) => {
              return (
                <TaskContainer
                  key={container.type}
                  type={container.type}
                  heading={container.heading}
                ></TaskContainer>
              );
            })}
          </div>
        </div>
      </DndContext>
    </main>
  );
}

export default App;

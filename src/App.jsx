import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRef } from "react";
import TaskForm from "./TaskForm";
import useStore from "./store";
import TaskContainer from "./TaskContainer";
import { nanoid } from "nanoid";

function App() {
  const taskStatuses = useStore((state) => state.status);
  const moveTask = useStore((state) => state.moveTask);
  const addTask = useStore((state) => state.addTask);

  const newTaskDialogRef = useRef(null);

  const handleDragEnd = (event) => {
    if (event.over) {
      const { id: taskId, status: fromStatus } = event.active.data.current;
      const toStatus = event.over.id.split("-").at(-1);
      moveTask(taskId, toStatus);
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

    addTask(newTask);
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
            {taskStatuses.map((taskStatus) => {
              return (
                <TaskContainer
                  key={taskStatus.id}
                  id={taskStatus.id}
                  heading={taskStatus.heading}
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

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";
import useStore from "./store";
import TaskForm from "./TaskForm";

const Task = ({ task }) => {
  const { listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      ...task,
    },
  });

  const editTaskDialogRef = useRef(null);

  const editTask = useStore((state) => state.editTask);
  const deleteTask = useStore((state) => state.deleteTask);

  const closeDialog = () => {
    editTaskDialogRef.current.close();
  };

  const handleEditTask = (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const content = formData.get("content");
    const status = formData.get("status");

    const updatedTask = {
      content,
      status,
      id: task.id,
    };

    editTask(task.id, task.status, updatedTask);
    form.reset();
    closeDialog();
  };

  return (
    <>
      <li
        className="text-center flex px-1 text-black py-1 bg-gray-200 hover:bg-gray-300 cursor-pointer"
        ref={setNodeRef}
        {...listeners}
        style={{
          transform: CSS.Translate.toString(transform),
        }}
        onClick={() => {
          editTaskDialogRef.current.showModal();
        }}
      >
        <span className="grow">{task.content}</span>
        <span
          className="text-red-400 hover:text-red-500 text-lg px-2"
          onClick={(event) => {
            event.preventDefault();
            deleteTask(task.id, task.status);
          }}
        >
          x
        </span>
      </li>
      <dialog
        className="bg-black border border-zinc-500 max-w-xl w-full backdrop:opacity-40"
        ref={editTaskDialogRef}
      >
        <TaskForm
          title="Edit Task"
          onSubmit={handleEditTask}
          closeDialog={closeDialog}
          task={task}
        />
      </dialog>
    </>
  );
};

export default Task;

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import useStore from "./store";
import Task from "./Task";

const TaskContainer = ({ id, heading, className }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `task-container-${id}`,
  });

  const tasks = useStore((state) => state.tasks);
  const currentTypeTasks = tasks.filter((task) => task.status === id);

  return (
    <div
      className={clsx(
        "w-full flex flex-col gap-1 h-full border border-zinc-500"
      )}
      ref={setNodeRef}
    >
      <h2 className="font-semibold text-center text-white ">
        {`${heading} (${currentTypeTasks.length})`}
      </h2>
      <ul
        className={clsx(
          "flex flex-col gap-1 grow",
          isOver ? "bg-zinc-700" : "bg-zinc-900"
        )}
      >
        {currentTypeTasks.map((task) => {
          return <Task key={task.id} task={task} />;
        })}
      </ul>
    </div>
  );
};

export default TaskContainer;

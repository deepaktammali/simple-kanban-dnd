import useStore from "./store";

const TaskForm = ({ title, task, closeDialog, onSubmit }) => {
  const taskStatuses = useStore((state) => state.status);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-white">{title}</h2>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="taskContent" className="text-white">
            Content
          </label>
          <textarea
            id="taskContent"
            name="content"
            placeholder="add content here..."
            className="text-black p-1"
            rows={2}
            defaultValue={task?.content ?? ""}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="taskStatus" className="text-white">
            Status
          </label>
          <select
            id="taskStatus"
            name="status"
            className="p-1 disabled:text-gray-400 text-black"
            defaultValue={task?.status ?? ""}
            required
          >
            <option value={""} disabled>
              Select Status
            </option>
            {taskStatuses.map((taskStatus) => {
              return (
                <option key={taskStatus.id} value={taskStatus.id}>
                  {taskStatus.heading}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex gap-2 w-full items-center justify-end">
          <button
            type="button"
            onClick={() => closeDialog()}
            className="text-white"
          >
            Cancel
          </button>
          <button
            value="submit"
            type="submit"
            className="text-white px-6 py-1 bg-zinc-700 hover:bg-zinc-600"
          >
            {!!task ? "Edit" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

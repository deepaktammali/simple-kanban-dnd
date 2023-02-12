import produce from "immer";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        status: [
          {
            id: "todo",
            heading: "Todo",
          },
          {
            id: "inProgress",
            heading: "In Progress",
          },
          {
            id: "completed",
            heading: "Completed",
          },
        ],
        addStatus: (id, heading) => {
          set(
            produce((state) => {
              state.status = [
                ...state.status,
                {
                  id,
                  heading,
                },
              ];
            })
          );
        },
        addTask: (task) => {
          set(
            produce((state) => {
              state.tasks = [...state.tasks, task];
            })
          );
        },
        moveTask: (taskId, toStatus) => {
          set(
            produce((state) => {
              const taskIdx = state.tasks.findIndex(
                (task) => task.id === taskId
              );
              const task = state.tasks[taskIdx];
              task.status = toStatus;
              state.tasks.splice(taskIdx, 1, task);
            })
          );
        },
        editTask: (taskId, updatedTask) => {
          set(
            produce((state) => {
              const taskIdx = state.tasks.findIndex(
                (task) => task.id === taskId
              );
              state.tasks.splice(taskIdx, 1, updatedTask);
            })
          );
        },
        deleteTask: (taskId) => {
          set(
            produce((state) => {
              const taskIdx = state.tasks.findIndex(
                (task) => task.id === taskId
              );
              state.tasks.splice(taskIdx, 1);
            })
          );
        },
      }),
      {
        name: "simple-kanban",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useStore;

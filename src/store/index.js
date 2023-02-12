import produce from "immer";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { TASK_STATUS } from "../constants";

const useStore = create(
  devtools(
    persist(
      (set) => ({
        [TASK_STATUS.todo]: [
          {
            id: "1",
            content: "Hello",
            status: "todo",
          },
          {
            id: "2",
            content: "Hello",
            status: "todo",
          },
          {
            id: "3",
            content: "Hello",
            status: "todo",
          },
        ],
        [TASK_STATUS.inProgress]: [],
        [TASK_STATUS.completed]: [],
        addItem: (task, status) => {
          // If the status is a valid status
          // add task to that status list
          if (Object.keys(TASK_STATUS).includes(status)) {
            set(
              produce((state) => {
                state[status] = [...state[status], task];
              })
            );
          }
        },
        moveTask: (taskId, fromStatus, toStatus) => {
          set(
            produce((state) => {
              const taskIdx = state[fromStatus].findIndex(
                (task) => task.id === taskId
              );
              const task = state[fromStatus][taskIdx];
              state[fromStatus].splice(taskIdx, 1);

              const updatedTask = { ...task, status: toStatus };
              state[toStatus].push(updatedTask);
            })
          );
        },
        editTask: (taskId, fromStatus, updatedTask) => {
          set(
            produce((state) => {
              const taskIdx = state[fromStatus].findIndex(
                (task) => task.id === taskId
              );

              const toStatus = updatedTask.status;

              if (toStatus === fromStatus) {
                state[fromStatus].splice(taskIdx, 1, updatedTask);
              } else {
                state[fromStatus].splice(taskIdx, 1);
                state[toStatus] = [...state[toStatus], updatedTask];
              }
            })
          );
        },
        deleteTask: (taskId, status) => {
          set(
            produce((state) => {
              const taskIdx = state[status].findIndex(
                (task) => task.id === taskId
              );
              state[status].splice(taskIdx, 1);
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

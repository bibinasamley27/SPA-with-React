import { useTasks as useTasksContext } from '../context/TaskContext';

export const useTasks = () => {
  return useTasksContext();
};

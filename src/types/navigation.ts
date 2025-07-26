import { Task } from '../store/tasksSlice';

export type RootStackParamList = {
  TaskList: undefined;
  TaskAddEdit: { task?: Task } | undefined;
  TaskDetail: { task: Task };
};
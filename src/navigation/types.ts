// Define the param list for your main stack navigator
export type MainStackParamList = {
  TaskList: undefined;                // No params passed to TaskList screen
  TaskAddEdit: {                     // Example screen with params
    taskId?: string;                 // `taskId` is optional (for add/edit)
  };
  TaskDetail: { taskId: string };
  Settings: undefined;               // Screen with no params
  // Add other screens as needed
};

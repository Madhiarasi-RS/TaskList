import { configureStore } from '@reduxjs/toolkit';
import { tasksSlice } from './tasksSlice';
import authReducer from './authSlice';
export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { create } from 'zustand';

interface TaskViewState {
   selectedTaskId: string | null;
   isOpen: boolean;
   openTask: (taskId: string) => void;
   closeTask: () => void;
}

export const useTaskViewStore = create<TaskViewState>((set) => ({
   selectedTaskId: null,
   isOpen: false,
   openTask: (taskId: string) => set({ selectedTaskId: taskId, isOpen: true }),
   closeTask: () => set({ selectedTaskId: null, isOpen: false }),
}));

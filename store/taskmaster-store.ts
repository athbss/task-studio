import { create } from 'zustand';
import { TaskmasterTask, UIState } from '@/types/taskmaster';

interface TaskmasterUIStore {
   // UI State
   viewMode: UIState['viewMode'];
   selectedTask: TaskmasterTask | null;
   filters: UIState['filters'];
   selectedTag: string | null;

   // Actions
   setViewMode: (mode: UIState['viewMode']) => void;
   setSelectedTask: (task: TaskmasterTask | null) => void;
   setFilters: (filters: Partial<UIState['filters']>) => void;
   setSelectedTag: (tag: string | null) => void;
   clearFilters: () => void;
}

export const useTaskmasterUIStore = create<TaskmasterUIStore>((set) => ({
   // Initial state
   viewMode: 'board',
   selectedTask: null,
   filters: {},
   selectedTag: null,

   // UI actions
   setViewMode: (mode) => set({ viewMode: mode }),
   setSelectedTask: (task) => set({ selectedTask: task }),
   setFilters: (filters) =>
      set((state) => ({
         filters: { ...state.filters, ...filters },
      })),
   setSelectedTag: (tag) => set({ selectedTag: tag }),
   clearFilters: () => set({ filters: {} }),
}));

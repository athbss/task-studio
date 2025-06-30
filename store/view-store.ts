import { create } from 'zustand';

export type ViewType = 'list' | 'board';

interface ViewState {
   viewType: ViewType;
   setViewType: (viewType: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
   viewType: 'list',
   setViewType: (viewType: ViewType) => set({ viewType }),
}));

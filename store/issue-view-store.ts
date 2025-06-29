import { create } from 'zustand';

interface IssueViewState {
   selectedIssueId: string | null;
   isOpen: boolean;
   openIssue: (issueId: string) => void;
   closeIssue: () => void;
}

export const useIssueViewStore = create<IssueViewState>((set) => ({
   selectedIssueId: null,
   isOpen: false,
   openIssue: (issueId: string) => set({ selectedIssueId: issueId, isOpen: true }),
   closeIssue: () => set({ selectedIssueId: null, isOpen: false }),
}));

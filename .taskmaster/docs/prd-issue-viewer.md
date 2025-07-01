# Task Studio - Issue Viewer Modal PRD

<context>
# Overview

The Issue Viewer Modal is a read-only overlay component that displays complete task details when users click on any task in the Task Studio interface. This feature enhances the task browsing experience by providing instant access to full task information without navigating away from the current view, maintaining context and improving workflow efficiency.

## Project Context

**Project Status: Pre-MVP**

- Read this file: `.taskmaster/docs/app-design-document.md` - App design document
- Read this file: `.taskmaster/docs/tech-stack.md` - Tech stack, architecture
- DO NOT care about breaking changes. We didn't deploy yet.
- DO NOT care about unit testing, accessibility, visual testing (Storybook), and performance optimization unless asked.
- Care about security, zod validation, authorization, rate limiting, and other production-level concerns. In general, you can see how it's done in the other features.

## Core Features

### **Quick Task Details Display**

- **What it does**: Shows all task information in a modal overlay when clicking on any task card or line
- **Why it's important**: Developers need to quickly view full task details without losing their place in the task list or board
- **How it works**: Reuses existing modal infrastructure and displays already-fetched task data without additional API calls

### **Modal Navigation**

- **What it does**: Provides standard modal interactions with keyboard support
- **Why it's important**: Ensures consistent UX patterns and accessibility for keyboard users
- **How it works**: Modal closes on ESC key, clicking outside, or X button; maintains focus management

### **Read-Only Task Information**

- **What it does**: Displays all available task fields in a structured, easy-to-read format
- **Why it's important**: Provides comprehensive task context while maintaining the MVP's read-only scope
- **How it works**: Maps TaskmasterTask data model to visual components with proper formatting

### **Action Placeholders**

- **What it does**: Shows action buttons (edit, delete, etc.) in disabled/noop state
- **Why it's important**: Sets up the UI structure for future write operations without implementing functionality
- **How it works**: Displays standard action buttons with onClick handlers that do nothing in the current MVP

## User Experience

### User Personas

#### The Task Browser

- Frequently clicks through multiple tasks to understand project state
- Values quick access to full details without losing context
- Needs to see all task metadata including descriptions and test strategies

#### The Dependency Tracker

- Reviews task relationships and dependencies
- Needs clear visualization of task connections
- Values being able to navigate between related tasks

### Key User Flows

#### View Task Details

1. User clicks on any task card in board view or task line in list view
2. Modal overlay appears with full task information
3. User reads through task details, including description, priority, status
4. User closes modal via ESC, X button, or clicking outside
5. User returns to exactly where they were in the task list

#### Browse Multiple Tasks

1. User opens task details modal for first task
2. Without closing modal, user could click another task (future enhancement)
3. Modal updates with new task information
4. User continues browsing tasks efficiently

### UI/UX Considerations

- **Instant Display**: No loading states needed since data is already fetched
- **Familiar Patterns**: Standard modal behavior matching existing UI patterns
- **Visual Hierarchy**: Most important information (title, status) displayed prominently
- **Readable Layout**: Proper spacing and typography for easy scanning
- **Responsive Design**: Modal adapts to different screen sizes

</context>
<PRD>

# Technical Architecture

## System Components

### Frontend Components

- **IssueViewModal**: Main modal component that wraps the task details
- **TaskDetailsView**: Content component displaying all task information
- **useIssueViewStore**: Zustand store managing modal open/close state and selected task
- **Integration**: Reuses existing Dialog component from shadcn/ui

### Data Flow

```
User clicks task → useIssueViewStore.openIssue(taskId) → Modal opens
                → Find task in existing data → Display in modal
                → User closes → useIssueViewStore.closeIssue() → Modal closes
```

### State Management

- Modal state (open/closed, selected task ID) managed by dedicated Zustand store
- Task data retrieved from existing task list - no additional fetching required
- UI state persists during modal interactions

## Data Models

### Existing Models (No Changes Needed)

```typescript
interface TaskmasterTask {
   id: number;
   title: string;
   description: string;
   status: 'pending' | 'in_progress' | 'done' | 'cancelled';
   priority: 'low' | 'medium' | 'high' | 'urgent';
   dependencies: number[];
   subtasks?: TaskmasterTask[];
   assignee?: string;
   labels?: string[];
   dueDate?: string;
   details?: string;
   testStrategy?: string;
}
```

### New Store Model

```typescript
interface IssueViewState {
   selectedIssueId: string | null;
   isOpen: boolean;
   openIssue: (issueId: string) => void;
   closeIssue: () => void;
}
```

## APIs and Integrations

### Internal Integrations

- **Issue Line Component**: Add onClick handler to open modal
- **Issue Card Component**: Add onClick handler to open modal
- **Existing Modal System**: Reuse Dialog components and patterns
- **Task Data Source**: Use already-fetched task data from list/board views

### No External APIs

- All data already available in memory
- No additional server calls needed
- Maintains read-only nature of MVP

## Infrastructure Requirements

### Development Environment

- No new requirements - uses existing Next.js and component setup
- Reuses existing shadcn/ui Dialog component
- Compatible with current Zustand state management

### Performance Considerations

- Minimal performance impact - no new data fetching
- Modal renders on-demand only
- Efficient re-renders using Zustand subscriptions

# Development Roadmap

## MVP Requirements (Phase 1)

### 1. Create Issue View Store

- Set up Zustand store for modal state management
- Implement openIssue and closeIssue actions
- Track selected issue ID

### 2. Build Issue View Modal Component

- Create modal wrapper using existing Dialog component
- Implement keyboard shortcuts (ESC to close)
- Add overlay click to close functionality

### 3. Design Task Details Layout

- Structure task information in logical sections
- Display all available task fields
- Format dates, priorities, and statuses appropriately

### 4. Add Click Handlers

- Modify IssueLine component to open modal on click
- Update IssueCard component (if applicable)
- Ensure proper event handling and propagation

### 5. Implement Action Buttons (Noop)

- Add standard action buttons (Edit, Delete, Copy, etc.)
- Style as disabled or with subtle indication they're inactive
- Prepare UI structure for future functionality

## Future Enhancements (Post-MVP)

### Phase 2: Enhanced Navigation

- Navigate between tasks without closing modal
- Keyboard shortcuts for next/previous task
- Breadcrumb navigation for subtasks

### Phase 3: Interactivity

- Copy task details to clipboard
- Copy CLI commands for task operations
- Enable actual edit/delete functionality

### Phase 4: Rich Content

- Markdown rendering for descriptions
- Syntax highlighting for code blocks
- File attachments preview

# Logical Dependency Chain

## Build Order (MVP)

1. **Issue View Store** (Required First)

   - Must exist before modal component can function
   - Provides state management foundation

2. **Modal Component Structure**

   - Basic modal wrapper with open/close functionality
   - Can be tested with dummy content initially

3. **Task Details Component**

   - Receives task data as props
   - Formats and displays all task fields

4. **Click Handler Integration**

   - Modify existing task display components
   - Connect clicks to store actions

5. **Polish and Actions**
   - Add noop action buttons
   - Implement keyboard shortcuts
   - Final styling adjustments

## Dependencies

- Existing Dialog/Modal components must be working
- Task data must be available in parent components
- No external dependencies or API changes required

# Risks and Mitigations

## Technical Challenges

### State Synchronization

- **Risk**: Modal showing stale data if tasks update while open
- **Mitigation**: Modal always reads from current task data; real-time updates will automatically reflect

### Click Handler Conflicts

- **Risk**: Existing click handlers on task components might interfere
- **Mitigation**: Use event.stopPropagation() carefully; test interaction with existing features

### Performance with Large Task Lists

- **Risk**: Finding selected task in large arrays could be slow
- **Mitigation**: Use Map or index for O(1) lookup if needed; start with simple find() for MVP

## MVP Scoping

### Feature Creep Prevention

- **Risk**: Adding too many features to the modal
- **Mitigation**: Strict focus on read-only display; defer all interactivity except basic modal controls

### Over-Engineering

- **Risk**: Building complex navigation or state management
- **Mitigation**: Keep it simple - one modal, one task, basic open/close

## Resource Constraints

### Development Time

- **Risk**: Custom layouts taking too long
- **Mitigation**: Reuse existing component patterns; simple vertical layout for MVP

### Testing Complexity

- **Risk**: Modal interactions hard to test
- **Mitigation**: Focus on manual testing for MVP; unit tests can come later

# Appendix

## UI Component Structure

```
IssueViewModal
├── Dialog (from shadcn/ui)
│   ├── DialogOverlay
│   ├── DialogContent
│   │   ├── DialogHeader
│   │   │   ├── Task Title
│   │   │   └── Close Button (X)
│   │   ├── TaskDetailsView
│   │   │   ├── Status & Priority Badge
│   │   │   ├── Description Section
│   │   │   ├── Details Section
│   │   │   ├── Test Strategy Section
│   │   │   ├── Metadata (dates, assignee)
│   │   │   └── Labels
│   │   └── DialogFooter
│   │       └── Action Buttons (disabled)
│   └── Click Outside Handler
```

## Example Task Display Layout

```
┌─────────────────────────────────────┐
│ [Task Title]                    [X] │
├─────────────────────────────────────┤
│ [TODO] [High Priority]              │
│                                     │
│ Description:                        │
│ [Task description text...]          │
│                                     │
│ Details:                            │
│ [Implementation details...]         │
│                                     │
│ Test Strategy:                      │
│ [Testing approach...]               │
│                                     │
│ Assignee: [Name]                    │
│ Labels: [Label1] [Label2]           │
│ Due Date: [Date]                    │
├─────────────────────────────────────┤
│ [Edit] [Delete] [Copy]    [Close]   │
└─────────────────────────────────────┘
```

## Success Criteria

- Users can click any task to view full details
- Modal displays all available task information
- Modal can be closed via multiple methods (ESC, X, outside click)
- No performance degradation with modal open
- UI prepared for future write operations

</PRD>

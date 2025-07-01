# Taskmaster UPDATE API - Product Requirements Document

<context>

## Overview

The Taskmaster UPDATE API enables users to modify task fields directly from the web UI, providing a seamless way to update task status, priority, and assignee without needing to use the CLI. This feature transforms the Task Studio UI from a read-only viewer into an interactive task management interface, similar to how Prisma Studio allows database modifications through a web interface.

The UPDATE API focuses exclusively on fields that are already displayed and editable in the UI, maintaining a clean separation between CLI-managed task structure and UI-managed task state.

## Project Context

**Current Stage**: Pre-MVP (highest velocity to ship)

### DO Care About (Production-Ready Foundation)

- **Core Taskmaster Integration**: Read-only visualization of .taskmaster JSON files
- **File System Access**: Local file reading and watching for changes
- **Real-time Updates**: Hot Module Replacement (HMR) style updates when files change
- **Data Mapping**: Correct mapping between Taskmaster data model and UI components
- **Basic Navigation**: Working sidebar, routing, and task views

### DO NOT Care About (Skip for Velocity)

- **Authentication**: Single-user local tool, no auth needed
- **Multi-user Features**: No collaboration, permissions, or sharing
- **Data Persistence**: Read-only for now, no database needed
- **Performance Optimization**: File watching is sufficient for local use
- **Comprehensive Testing**: Focus on working implementation
- **Accessibility**: Can be improved in future iterations
- **Breaking Changes**: Not deployed yet, refactor freely

## Core Features

### 1. Single Task Update Endpoint

**What**: A POST endpoint at `/api/taskmaster/tasks/update` that accepts task updates and writes them to the `.taskmaster/tasks/tasks.json` file.

**Why**: Users need to update task properties (status, priority, assignee) as they work without switching to the CLI.

**How**:

- Receives task ID, tag context, and fields to update
- Validates input against existing Zod schemas
- Reads current tasks.json, updates the specific task, writes back
- Returns the updated task data for UI synchronization

### 2. Field-Specific Updates

**What**: Updates limited to UI-editable fields: status, priority, and assignee.

**Why**: Maintains separation between structural task data (managed by CLI) and workflow state (managed by UI).

**How**:

- Only accepts updates for status, priority, and assignee fields
- Preserves all other task fields unchanged
- Validates status transitions and field values

### 3. Optimistic UI Updates

**What**: Immediate UI updates with Tanstack Query mutations, followed by server confirmation.

**Why**: Provides instant feedback for better user experience in a local development tool.

**How**:

- UI updates immediately on user action
- Tanstack Query handles optimistic updates
- Rollback on server error with toast notification
- WebSocket invalidation ensures eventual consistency

### 4. Business Logic Validation

**What**: Smart validation that prevents invalid state transitions, especially for tasks with subtasks.

**Why**: Ensures data integrity and prevents logical inconsistencies in task states.

**How**:

- Cannot mark task as "done" if it has pending subtasks
- Validates status values against allowed enum
- Checks priority values are valid
- Ensures dependencies are respected

## User Experience

### User Personas

1. **Local Developer**: Uses Task Studio as a visual interface for their .taskmaster tasks, similar to using Prisma Studio for database management.

2. **Project Manager**: Reviews task progress visually and updates status/priority without needing CLI knowledge.

### Key User Flows

1. **Update Task Status**

   - User clicks on task status badge in list/board view
   - Selects new status from dropdown
   - UI updates immediately (optimistic)
   - Server writes to tasks.json
   - WebSocket notifies all connected clients

2. **Change Task Priority**

   - User clicks priority indicator
   - Selects new priority level
   - Immediate visual feedback
   - Background save to file system

3. **Assign Task**
   - User clicks assignee field
   - Selects from assignee list or enters new name
   - Updates reflected across all views

### UI/UX Considerations

- **Instant Feedback**: All updates show immediately with subtle loading states
- **Error Recovery**: Failed updates show toast with clear error message
- **Consistency**: Updates maintain existing UI patterns and components
- **No New UI**: Uses only existing selectors and components

</context>

<PRD>

## Technical Architecture

### System Components

#### 1. API Layer

```typescript
// POST /api/taskmaster/tasks/update
interface UpdateTaskRequest {
   tag: string; // Tag context (e.g., "master", "user-auth")
   taskId: string; // Task ID (e.g., "1", "1.2", "1.2.1")
   updates: {
      status?: TaskStatus;
      priority?: Priority;
      assignee?: string;
   };
}

interface UpdateTaskResponse {
   success: boolean;
   data?: TaskmasterTask;
   error?: string;
   timestamp: string;
}
```

#### 2. File System Operations

- New write utilities in `/utils/filesystem.ts`:
   - `writeJsonFile()` - Atomic file writing with temporary files
   - `acquireFileLock()` - Simple file locking (last-write-wins)
   - `validateTaskUpdate()` - Ensure update data is valid

#### 3. Business Logic Layer

- Task update validation in `/lib/taskmaster-service.ts`:
   - `validateTaskUpdate()` - Check business rules
   - `findTaskInTag()` - Locate task within tag hierarchy
   - `updateTaskInPlace()` - Modify task preserving structure
   - `hasIncompletSubtasks()` - Check subtask completion

#### 4. Client Integration

- Tanstack Query mutations in `/hooks/use-taskmaster-queries.ts`:
   - `useUpdateTask()` - Mutation hook with optimistic updates
   - Cache invalidation on success
   - Error handling with toast notifications

### Data Models

No new data models needed. Uses existing:

- `TaskmasterTask` interface
- `TaskStatus` enum
- `Priority` enum
- `ApiResponse` wrapper

### APIs and Integrations

#### Internal APIs

1. **Update Task Endpoint**
   - Method: POST
   - Path: `/api/taskmaster/tasks/update`
   - Content-Type: application/json
   - Validation: Zod schemas
   - Response: Updated task or error

#### File System Integration

- Direct file system access via Node.js `fs` module
- Atomic writes to prevent corruption
- File watching triggers WebSocket updates

#### WebSocket Integration

- Existing WebSocket notifies on file changes
- No changes needed - file watcher detects updates

### Infrastructure Requirements

- **Local Development Only**: No cloud infrastructure
- **File System Access**: Read/write to `.taskmaster/` directory
- **Node.js Runtime**: For file operations
- **No Database**: All data in JSON files
- **No Authentication**: Local tool only

## Development Roadmap

### MVP Requirements (Phase 1)

1. **Core Update Functionality**

   - [ ] Create `/api/taskmaster/tasks/update` endpoint
   - [ ] Add write utilities to filesystem module
   - [ ] Implement task finding logic for nested subtasks
   - [ ] Add business logic validation

2. **Client Integration**

   - [ ] Create `useUpdateTask` mutation hook
   - [ ] Add optimistic update logic
   - [ ] Integrate with existing selectors
   - [ ] Add error toast notifications

3. **Testing & Validation**
   - [ ] Test concurrent updates
   - [ ] Verify file integrity after writes
   - [ ] Test validation rules
   - [ ] Ensure WebSocket sync works

### Future Enhancements (Post-MVP)

1. **Bulk Operations**

   - Update multiple tasks at once
   - Batch status changes

2. **Advanced Validation**

   - Dependency-aware status changes
   - Custom validation rules per tag

3. **Audit Trail**

   - Track who changed what and when
   - Change history in UI

4. **Conflict Resolution**
   - Optimistic locking with timestamps
   - Merge conflicts UI

## Logical Dependency Chain

### Development Order

1. **File System Utilities** (Prerequisite)

   - Write operations must be safe and atomic
   - Build on existing read utilities

2. **API Endpoint** (Core)

   - Receives and validates requests
   - Integrates file operations
   - Returns consistent responses

3. **Business Logic** (Critical)

   - Validates state transitions
   - Ensures data integrity
   - Handles edge cases

4. **Client Hooks** (Integration)

   - Wraps API calls
   - Manages optimistic updates
   - Handles errors gracefully

5. **UI Integration** (Final)
   - Connect to existing selectors
   - No new UI components needed
   - Test user workflows

### Quick Win Path

1. Start with status updates only
2. Add priority updates
3. Add assignee updates
4. Layer in validation rules

## Risks and Mitigations

### Technical Challenges

1. **File Corruption Risk**

   - **Risk**: Concurrent writes could corrupt tasks.json
   - **Mitigation**: Atomic writes with temp files, simple last-write-wins

2. **Lost Updates**

   - **Risk**: Two users updating same task
   - **Mitigation**: Accept for MVP (local tool), add locking later

3. **Invalid State**

   - **Risk**: Task in inconsistent state (done with pending subtasks)
   - **Mitigation**: Strong validation before write

4. **Performance**
   - **Risk**: Large tasks.json files slow to read/write
   - **Mitigation**: Not a concern for MVP, optimize later if needed

### MVP Simplifications

1. **No Optimistic Locking**: Last-write-wins is fine for local tool
2. **No Undo/Redo**: Can add later if needed
3. **No Batch Updates**: Single task updates only
4. **No Conflict UI**: File watcher handles sync

### Resource Constraints

- **Time**: 1-2 days for full implementation
- **Complexity**: Low - follows existing patterns
- **Testing**: Manual testing sufficient for MVP

## Appendix

### API Example Requests

```bash
# Update task status
curl -X POST http://localhost:3000/api/taskmaster/tasks/update \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "user-auth",
    "taskId": "1.2",
    "updates": {
      "status": "in_progress"
    }
  }'

# Update multiple fields
curl -X POST http://localhost:3000/api/taskmaster/tasks/update \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "master",
    "taskId": "3",
    "updates": {
      "status": "done",
      "priority": "low",
      "assignee": "john.doe"
    }
  }'
```

### Validation Rules

1. **Status Transitions**

   - Any status can transition to "cancelled"
   - Cannot transition to "done" with incomplete subtasks
   - Standard flow: pending → in_progress → done

2. **Priority Levels**

   - Must be one of: low, medium, high, urgent
   - No validation on transitions

3. **Assignee**
   - Can be any string or empty
   - No user validation (local tool)

### Error Response Examples

```json
{
  "success": false,
  "error": "Cannot mark task as done: subtask 1.2.1 is still pending",
  "timestamp": "2025-06-30T12:00:00.000Z"
}

{
  "success": false,
  "error": "Task not found: 99 in tag: user-auth",
  "timestamp": "2025-06-30T12:00:00.000Z"
}
```

### Technical Specifications

- **Framework**: Next.js 15 App Router
- **Validation**: Zod schemas
- **State Management**: Tanstack Query
- **UI Updates**: Optimistic with rollback
- **File Format**: JSON with atomic writes
- **Error Handling**: Consistent API responses with toast notifications

</PRD>

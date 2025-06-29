# Taskmaster Circle - Product Requirements Document (Read-Only MVP)

<context>
# Overview

# Project Context

**Project Status: Pre-MVP**

- Read this file: `.taskmaster/docs/app-design-document.md` - App design document
- Read this file: `.taskmaster/docs/tech-stack.md` - Tech stack, architecture
- DO NOT care about breaking changes. We didn't deploy yet.
- DO NOT care about unit testing, accessibility, visual testing (Storybook), and performance optimization unless asked.
- Care about security, zod validation, authorization, rate limiting, and other production-level concerns. In general, you can see how it's done in the other features.

# Overview

Taskmaster Circle is a read-only web visualization interface for the Taskmaster CLI task management system. It provides developers with an intuitive, visual way to browse and understand their Taskmaster tasks without leaving their development environment. Like Prisma Studio for databases, Taskmaster Circle offers a local-first, zero-configuration companion tool that complements the CLI workflow.

The initial MVP focuses exclusively on read-only operations: reading `.taskmaster/tasks/tasks.json` files, displaying tasks in an organized visual format, and automatically updating the UI when files change on disk.

# Core Features

## File System Integration (Read-Only)

- **What it does**: Reads `.taskmaster/tasks/tasks.json` files from the local filesystem
- **Why it's important**: Enables direct integration with existing Taskmaster projects without any configuration
- **How it works**: Local Node.js API server provides file access endpoints that the Next.js frontend consumes

## Real-Time File Watching

- **What it does**: Automatically updates the UI when `.taskmaster` files change on disk
- **Why it's important**: Provides seamless integration with CLI workflow - changes made via CLI instantly appear in the UI
- **How it works**: File system watcher detects changes and pushes updates to the frontend via WebSocket or SSE

## Task Visualization

- **What it does**: Displays tasks in both Kanban board and list views with full task details
- **Why it's important**: Visual representation helps developers quickly understand task status, priorities, and relationships
- **How it works**: Transforms Taskmaster JSON data into interactive UI components with drag-and-drop preview (no actual moves in read-only mode)

## Tag Context Navigation

- **What it does**: Shows Taskmaster tags as separate projects with isolated task lists
- **Why it's important**: Maintains Taskmaster's tag isolation concept where each tag has independent task numbering
- **How it works**: Sidebar navigation allows switching between tag contexts, each displaying its own set of tasks

## Search and Filtering

- **What it does**: Provides full-text search across tasks and multi-criteria filtering
- **Why it's important**: Helps developers quickly find specific tasks in large projects
- **How it works**: Client-side search and filtering with instant results, filter combinations can be bookmarked

# User Experience

## User Personas

### The CLI Developer

- Uses Taskmaster CLI as primary interface
- Opens Circle for visual overview during planning sessions
- Values quick task discovery and status overview
- Needs seamless integration with existing workflow

### The Visual Thinker

- Prefers visual task boards over CLI output
- Uses Circle to understand project structure
- Relies on search and filtering to navigate tasks
- Appreciates drag-and-drop preview to plan moves

## Key User Flows

### Initial Setup

1. Developer runs `taskmaster-circle` in project directory
2. Local server starts and opens browser to localhost:3000
3. UI automatically detects and loads `.taskmaster/tasks/tasks.json`
4. Tasks appear organized by current tag context

### Daily Task Review

1. Open Taskmaster Circle (bookmark or command)
2. View current tag's tasks in preferred view (board/list)
3. Filter by status to see in-progress work
4. Search for specific task by keyword
5. Click task to view full details in modal

### Context Switching

1. Use sidebar to see all available tags
2. Click different tag to switch context
3. Task board updates to show selected tag's tasks
4. URL updates to maintain context on refresh

## UI/UX Considerations

- **Instant Loading**: Local file access ensures fast initial load
- **Responsive Updates**: File changes reflect immediately without refresh
- **Familiar Patterns**: Board/list views match popular task tools
- **Non-Destructive**: Read-only mode prevents accidental changes
- **Keyboard Navigation**: Full keyboard support for efficiency

</context>
<PRD>

# Technical Architecture

## System Components

### Frontend (Next.js Application)

- Next.js 15 with App Router for modern React architecture
- Zustand for state management of tasks and UI state
- Real-time WebSocket/SSE client for file change notifications
- shadcn/ui components for consistent, accessible UI

### Local API Server

- Express/Fastify server running on separate port (3001)
- File system access endpoints for reading `.taskmaster` files
- File watcher (chokidar) for detecting changes
- WebSocket/SSE server for pushing updates to frontend

### Data Flow Architecture

```
Taskmaster CLI → .taskmaster/tasks/tasks.json → File Watcher
                                                      ↓
Frontend ← WebSocket/SSE ← API Server ← File System
```

## Data Models

### Task Model (from Taskmaster)

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

interface TagContext {
   name: string;
   tasks: TaskmasterTask[];
   metadata?: {
      description: string;
      createdAt: string;
   };
}
```

### UI State Models

```typescript
interface UIState {
   currentTag: string;
   viewMode: 'board' | 'list';
   filters: {
      status?: string[];
      priority?: string[];
      assignee?: string[];
      labels?: string[];
      search?: string;
   };
   selectedTask: number | null;
}
```

## APIs and Integrations

### File System API Endpoints

- `GET /api/taskmaster/tags` - List all available tags
- `GET /api/taskmaster/tags/:tagName` - Get tasks for specific tag
- `GET /api/taskmaster/current` - Get current tag context from state.json
- `WebSocket /ws` - Real-time updates stream

### Security Considerations

- API server only binds to localhost
- CORS configured for local development only
- File access restricted to `.taskmaster` directory
- No authentication needed (local single-user tool)

## Infrastructure Requirements

### Development Environment

- Node.js 18+ for running servers
- Modern browser with WebSocket support
- Local file system access (no sandboxing)
- Port 3000 (frontend) and 3001 (API) available

### Production Environment

- Not applicable for initial MVP (local-only tool)
- Future: Electron/Tauri for packaged desktop app

# Development Roadmap

## MVP Requirements (Read-Only)

### Phase 1: Core Infrastructure

- Set up Next.js project with TypeScript and Tailwind CSS
- Create local API server with file system access
- Implement basic file reading for `.taskmaster/tasks/tasks.json`
- Set up WebSocket/SSE connection between frontend and API

### Phase 2: Basic Task Display

- Create task card components with Taskmaster data model
- Implement board view with status columns
- Add list view with sortable columns
- Display task details in modal/sidebar

### Phase 3: Tag Context System

- Read available tags from tasks.json structure
- Implement tag switcher in sidebar
- Maintain current tag in URL for persistence
- Show tag metadata and task counts

### Phase 4: Real-Time Updates

- Implement file watcher on API server
- Push updates via WebSocket/SSE on file changes
- Update UI state without losing user context
- Show update indicators when data refreshes

### Phase 5: Search and Filtering

- Add full-text search across task titles/descriptions
- Implement multi-select filters for status/priority
- Create filter UI with active filter chips
- Persist filter state in URL parameters

### Phase 6: Polish and Launch

- Add loading states and error handling
- Implement keyboard shortcuts
- Create help documentation
- Package as npx-runnable tool

## Future Enhancements (Post-MVP)

### Write Operations via CLI

- Add buttons to copy Taskmaster CLI commands
- Implement command execution through API
- Show command output and status

### Advanced Visualizations

- Dependency graph view
- Progress charts and analytics
- Timeline/Gantt view for due dates

### Desktop Application

- Package as Electron/Tauri app
- Native file system integration
- System tray support

# Logical Dependency Chain

## Foundation (Must Build First)

1. **Local API Server**: Required for file system access from browser
2. **File Reading**: Core functionality depends on reading tasks.json
3. **Basic Data Models**: Transform Taskmaster data to UI models

## Core Features (Build in Order)

1. **Task Display Components**: Need before any visualization
2. **Board/List Views**: Primary user interface
3. **Tag Context Switching**: Enable multi-project support
4. **Task Details Modal**: Show complete task information

## Enhancement Features (Can Build in Parallel)

1. **File Watching**: Enhances but not required for basic use
2. **Search/Filtering**: Improves navigation but not critical
3. **Keyboard Shortcuts**: Quality of life improvement

## Progressive Enhancement

- Start with static file reading, add real-time updates
- Begin with basic cards, enhance with rich details
- Simple filtering first, advanced search later

# Risks and Mitigations

## Technical Challenges

### Cross-Platform File Access

- **Risk**: File paths and permissions vary across OS
- **Mitigation**: Use Node.js path module for cross-platform compatibility, handle permission errors gracefully

### Real-Time Performance

- **Risk**: Large task files could slow updates
- **Mitigation**: Implement debouncing, send only changed data, use efficient diff algorithms

### Browser Security Restrictions

- **Risk**: Browsers limit local file access
- **Mitigation**: Use local API server pattern, similar to successful tools like Prisma Studio

## MVP Scoping

### Feature Creep

- **Risk**: Adding write operations too early complicates MVP
- **Mitigation**: Strict read-only scope for initial release, clear roadmap for future features

### Complex UI Requirements

- **Risk**: Building overly complex visualizations
- **Mitigation**: Start with proven patterns (Kanban board), iterate based on user feedback

## Resource Constraints

### Development Time

- **Risk**: Building custom everything takes too long
- **Mitigation**: Use component libraries (shadcn/ui), focus on integration over innovation

### Maintenance Burden

- **Risk**: Supporting multiple platforms/environments
- **Mitigation**: Start with Node.js/npm ecosystem only, expand later

# Appendix

## Technical Specifications

### Taskmaster File Format

- Location: `.taskmaster/tasks/tasks.json`
- Format: JSON with tag-based task organization
- State file: `.taskmaster/state.json` for current context

### Similar Tools for Reference

- Prisma Studio: Local database GUI
- GitHub Desktop: Local git GUI
- MongoDB Compass: Local database browser

### Design Inspiration

- Linear: Modern task management UI
- Notion: Flexible views and filtering
- Jira: Comprehensive task details

</PRD>

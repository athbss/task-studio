# Task UI

AI task management UI compatible with [Task Master](https://github.com/eyaltoledano/claude-task-master).

## What is this?

A local web interface for visualizing and managing AI-generated development tasks.

- **Built for AI workflows** - Visualize tasks created by LLMs
- **Real-time updates** - Changes to `.taskmaster` files reflect instantly
- **Tagged task organization** - Visual separation of different feature contexts
- **Kanban board view** - Drag and drop tasks between status columns
- **Task dependencies** - See task relationships and subtasks clearly

## Getting Started

### Install in your project

```bash
# Clone into .taskmaster/ui directory
git clone https://github.com/yourusername/task-ui.git .taskmaster/ui
cd .taskmaster/ui
pnpm install
pnpm dev
```

This keeps the UI co-located with your task data.

### Open the UI

Navigate to [http://localhost:5565](http://localhost:5565)

## How it works

Task UI watches your `.taskmaster/tasks/tasks.json` file and displays:

- AI-generated tasks across different tags
- Current tag context from `.taskmaster/state.json`
- Task status, priority, and dependencies
- Subtask hierarchies
- Real-time updates as you modify task files

## Features

### Task Views

- **List view** - Compact task list with inline status controls
- **Board view** - Kanban-style columns for visual task management
- **Tag filtering** - Switch between different feature contexts
- **Search** - Find tasks by title or description
- **Filters** - By status, priority, assignee, or labels

### Task Details

Click any task to see:

- Full description and implementation details
- Test strategy
- Subtasks and dependencies
- Priority and status
- Quick actions for task management

### Real-time Sync

The UI uses file watchers to detect changes to:

- `.taskmaster/tasks/tasks.json` - Task data
- `.taskmaster/state.json` - Current tag context

## Development

### Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/), [Tanstack Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide](https://lucide.dev/)

### Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript type checking
```

## Roadmap

- [ ] Write operations
- [ ] Bulk operations

## Contributing

Contributions welcome! This is an early project focused on making AI tasks more visual and accessible.

## Credits

- [Circle](https://github.com/ln-dev7/circle) - The beautiful UI template this project is based on
- [Task Master](https://github.com/eyaltoledano/claude-task-master) - The JSON schema standard for task management

## License

MIT

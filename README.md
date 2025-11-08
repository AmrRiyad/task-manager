# Task Manager App

A modern React Native and Expo task manager with an intuitive interface, task prioritization, status tracking, and dark mode support.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:AmrRiyad/task-manager.git
   cd task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - Scan the QR code with Expo Go app on your physical device
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

### Available Scripts

```bash
npm start          # Start Expo development server
npm run lint       # Run ESLint
```

## Usage Guide

### Creating a Task

1. Tap the **pencil icon** in the top-right corner of the Tasks screen
2. Enter a **title** (required) and **description** (optional)
3. Select a **priority** level: Low, Medium, or High
4. Set the initial **status**: Todo, In Progress, or Done
5. Tap **Save Task** button

### Managing Tasks

- **Edit Task**: Tap on the task title to open the edit screen where you can:
  - Update the title and description
  - Change the priority level
  - Update the status
  - Delete the task
  
- **Quick Delete**: Use the trash icon on the task card for quick deletion

### Filtering Tasks

Use the tab bar at the top of the task list to filter:

- **All Tasks** - View all tasks grouped by status
- **Todo** - View only pending tasks
- **In Progress** - View tasks currently being worked on
- **Done** - View completed tasks

### Sorting Tasks

1. Tap the **three dots icon** (⋮) next to the add task button in the header
2. A bottom sheet will appear with sort options:
   - **Priority** - Sort tasks by priority (High → Medium → Low)
   - **Newest First** - Show most recently created tasks first
   - **Oldest First** - Show oldest tasks first

### Changing Theme

1. Navigate to the **Settings** tab
2. Select your preferred theme:
   - **Light** - Light color scheme
   - **Dark** - Dark color scheme
   - **System** - Follow device system settings

## Features

### Core Functionality

- ✅ **Add Tasks** - Create new tasks with title, description, priority, and status
- ✏️ **Edit Tasks** - Update task details through an intuitive modal interface
- ✓ **Mark Complete** - Toggle tasks through three states: Todo → In Progress → Done
- 🗑️ **Delete Tasks** - Remove tasks
- 📋 **View All Tasks** - See all tasks organized by status with filtering options
- 👁️ **View Details** - Tap any task to see full details in a dedicated screen

### User Experience

- 🌓 **Theme Support** - Light, Dark, and System theme modes with persistent preferences
- 🔍 **Smart Filtering** - Filter tasks by status (All, Todo, In Progress, Done)
- 📊 **Task Sorting** - Sort tasks by Priority, Newest First, or Oldest First with independent sorting per category
- 🎯 **Priority Levels** - Low, Medium, and High priority indicators
- 📊 **Status Tracking** - Visual indicators for task status (Todo, In Progress, Done)
- 🔔 **Toast Notifications** - Success, warning, and error feedback for all actions

## Tech Stack

### Core Dependencies

- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0.22) - Development platform and tooling
- **Expo Router** (~6.0.14) - File-based routing system
- **TypeScript** (~5.9.2) - Type safety and developer experience

### UI Libraries

- **Lucide React Native** (^0.552.0) - Beautiful icon library
- **React Navigation** (^7.1.8) - Navigation infrastructure

## Project Structure

```
task-manager/
├── app/                          # Application screens (file-based routing)
│   ├── (tabs)/                   # Tab-based navigation group
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Main task list screen (contains all task state)
│   │   └── settings.tsx          # Settings screen
│   ├── task/                     # Task-related screens
│   │   ├── [id].tsx             # Task edit screen (full CRUD capabilities)
│   │   └── new.tsx              # New task creation screen
│   └── _layout.tsx              # Root layout with theme provider
├── components/                   # Reusable components
│   ├── forms/                   # Form components
│   │   ├── form-header.tsx      # Reusable form header with back/save buttons
│   │   └── form-input.tsx       # Reusable form input with validation
│   ├── tasks/                   # Task-related components
│   │   ├── empty-state.tsx      # Empty state when no tasks
│   │   ├── grouped-task-list.tsx # Tasks grouped by status
│   │   ├── priority-selector.tsx # Priority dropdown selector
│   │   ├── status-selector.tsx  # Status dropdown selector
│   │   ├── task-card.tsx        # Individual task card component
│   │   ├── task-list.tsx        # Simple task list component
│   │   └── task-modal.tsx       # Task modal (legacy, may be unused)
│   ├── ui/                      # UI components
│   │   ├── confirm-dialog.tsx   # Confirmation dialog component
│   │   ├── dropdown-selector.tsx # Reusable dropdown selector
│   │   ├── save-button.tsx      # Sticky save button component
│   │   ├── sort-bottom-sheet.tsx # Sort options bottom sheet
│   │   ├── tabs.tsx             # Custom tab component
│   │   └── toast.tsx            # Toast notification system
│   ├── themed-text.tsx          # Theme-aware text component
│   └── themed-view.tsx          # Theme-aware view component
├── contexts/                     # React Context providers
│   └── theme-context.tsx        # Theme state management (persisted)
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Theme-aware color scheme
│   ├── use-color-scheme.web.ts  # Web-specific color scheme hook
│   ├── use-tasks.ts             # Task state management hook
│   └── use-theme-color.ts       # Theme color utilities
├── types/                        # TypeScript type definitions
│   └── task.ts                  # Task-related types and interfaces
├── utils/                        # Utility functions
│   ├── date-helpers.ts          # Date formatting utilities
│   ├── shared-styles.ts         # Shared style definitions
│   ├── task-callbacks.ts        # Task callback management
│   ├── task-helpers.ts          # Task-related helper functions
│   └── validation-helpers.ts    # Form validation utilities
├── constants/                    # App constants
│   └── theme.ts                 # Color definitions
└── package.json                  # Dependencies and scripts
```

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons by [Lucide](https://lucide.dev)

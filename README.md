
# Calendar and Task Manager

A user-friendly, interactive web-based calendar and task management tool. This project allows users to view a monthly calendar, add and manage tasks for specific dates, and track due times for tasks—all directly in the browser.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [File Structure](#file-structure)
- [Future Enhancements](#future-enhancements)

## Features

- **Interactive Calendar**: View a monthly calendar with clear indicators for current, past, and selected dates.
- **Task Management**: Add tasks to specific dates, with optional start and due times.
- **Persistent Storage**: Tasks are stored in the browser’s local storage, so they remain even if the page is refreshed.
- **User-Friendly Alerts**: Prevent adding tasks to past dates and ensure valid time entries.
- **Responsive UI**: Designed for optimal user experience on both desktop and mobile.

## Getting Started

### Prerequisites

To run this project locally, you only need a web browser.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/calendar-task-manager.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd calendar-task-manager
   ```
3. **Open `index.html`** in your browser:
   ```bash
   open index.html
   ```
   This will launch the project locally.

## Usage

1. **Navigate Months**: Use the arrow buttons to navigate through months.
2. **Select Dates**: Click on any date to view or add tasks for that specific date.
3. **Add Tasks**:
   - Click the “Add Task” button and enter task details, including an optional start time and due time.
   - Click “Add Task” or press Enter after entering due time to save.
4. **Delete Tasks**: Hover over a task in the list and click the `✖` button to delete it.

## Technologies Used

- **HTML5**: Structure and layout.
- **CSS3**: Styling, responsiveness, and visual indicators.
- **JavaScript**: Interactivity, task management, date handling, and validation.
- **Local Storage**: Persistence of tasks across page reloads.

## File Structure

```plaintext
calendar-task-manager/
│
├── index.html       # Main HTML file with calendar and task manager sections
├── style.css        # CSS file for styling the calendar and task manager
└── script.js        # JavaScript file for functionality and event handling
```

## Future Enhancements

- **Task Editing**: Allow users to edit existing tasks.
- **Notifications**: Integrate notifications for upcoming tasks.
- **Category Tags**: Enable tagging tasks for better organization.


Calendar and Task Manager
A user-friendly, interactive web-based calendar and task management tool. This project allows users to view a monthly calendar, add and manage tasks for specific dates, and track due times for tasks—all directly in the browser.

Table of Contents
Demo
Features
Getting Started
Usage
Technologies Used
File Structure
Future Enhancements

Features
Interactive Calendar: View a monthly calendar with a clear display of current, past, and selected dates.
Task Management: Add tasks to specific dates, complete with optional start and due times.
Persistent Storage: Tasks are stored in the browser’s local storage, so they remain even if the page is refreshed.
User-Friendly Alerts: Alerts and form behaviors prevent adding tasks to past dates and ensure valid time entries.
Responsive UI: Designed for an optimal user experience on both desktop and mobile.
Getting Started
Prerequisites
To run this project locally, you only need a web browser.

Installation
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/calendar-task-manager.git
Navigate to the project directory:
bash
Copy code
cd calendar-task-manager
Open index.html in your browser:
bash
Copy code
open index.html
This will launch the project locally.
Usage
Navigate Months: Use the arrow buttons to navigate through months.
Select Dates: Click on any date to view or add tasks for that specific date.
Add Tasks:
Click the “Add Task” button and enter task details, including an optional start time and due time.
Click “Add Task” or press Enter after entering due time to save.
Delete Tasks: Hover over a task in the list and click the ✖ button to delete it.
Technologies Used
HTML5: Structure and layout.
CSS3: Styling, responsiveness, and visual indicators.
JavaScript: Interactivity, task management, date handling, and validation.
Local Storage: Persistence of tasks across page reloads.
File Structure
plaintext
Copy code
calendar-task-manager/
│
├── index.html       # Main HTML file with calendar and task manager sections
├── style.css        # CSS file for styling the calendar and task manager
└── script.js        # JavaScript file for functionality and event handling
Future Enhancements
Task Editing: Allow users to edit existing tasks.
Notifications: Integrate notifications for upcoming tasks.
Category Tags: Enable tagging tasks for better organization.

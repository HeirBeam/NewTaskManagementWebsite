const monthYear = document.getElementById("month-year");
const daysGrid = document.getElementById("days-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");

let currentDate = new Date(); // Stores the fixed current date
let displayedDate = new Date(currentDate); // Tracks month/year being displayed
let selectedDate = new Date(currentDate); // Tracks the selected date for tasks
let tasks = loadTasksFromStorage(); // Load tasks from localStorage on startup
let selectedDateElement = null; // Track the currently selected date element

// Initialize Calendar
function initCalendar() {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();
    monthYear.textContent = `${displayedDate.toLocaleString("default", { month: "long" })} ${year}`;
    renderDays(year, month);

    // Automatically select and display tasks for today on load if it's the current month
    if (isCurrentMonth(year, month)) {
        selectDateByElement(currentDate); 
    }
}

// Render Days in Calendar
function renderDays(year, month) {
    daysGrid.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        daysGrid.innerHTML += `<div></div>`; // Empty cells for days before the first of the month
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);

        // Highlight today’s date only if viewing the current month
        if (
            year === currentDate.getFullYear() &&
            month === currentDate.getMonth() &&
            day === currentDate.getDate()
        ) {
            dayDiv.classList.add("current-date");
        }

        // Mark past dates with a "crossed-date" class and an "X"
        if (date < currentDate && !(date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear())) {
            dayDiv.classList.add("crossed-date");
            dayDiv.innerHTML = `<span class="cross-text"></span> ${day}`;
        } else {
            dayDiv.textContent = day; // For non-past dates, just show the day number
        }

        // Add a small dot indicator if there are tasks for this date
        if (tasks[dateKey]) {
            const taskIndicator = document.createElement("span");
            taskIndicator.classList.add("task-indicator");
            dayDiv.appendChild(taskIndicator);
        }

        // Highlight the selected date
        if (
            year === selectedDate.getFullYear() &&
            month === selectedDate.getMonth() &&
            day === selectedDate.getDate()
        ) {
            dayDiv.classList.add("selected");
            selectedDateElement = dayDiv;
        }

        // Add click event to select the date
        dayDiv.addEventListener("click", () => {
            selectDate(dayDiv, date);
        });

        daysGrid.appendChild(dayDiv);
    }
}

// Select a date and load tasks for that day
function selectDate(dayElement, date) {
    if (selectedDateElement) {
        selectedDateElement.classList.remove("selected");
    }

    dayElement.classList.add("selected");
    selectedDateElement = dayElement;
    selectedDate = date; // Update the selected date

    loadTasksForDay(getDateKey(selectedDate));
}

// Automatically select the current date element on initial load
function selectDateByElement(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Ensure the calendar is rendering the current month
    if (displayedDate.getMonth() !== month || displayedDate.getFullYear() !== year) {
        displayedDate = new Date(year, month);
        initCalendar();
    }

    // Find and select the date element in the current month view
    const dayElement = Array.from(daysGrid.children).find(
        (el) => el.textContent == day && el.classList.contains("day")
    );
    if (dayElement) {
        selectDate(dayElement, date);
    }
}

// Check if the displayed month is the current month
function isCurrentMonth(year, month) {
    return year === currentDate.getFullYear() && month === currentDate.getMonth();
}

// Change Month with displayedDate
prevMonthButton.addEventListener("click", () => {
    changeMonth(-1);
});
nextMonthButton.addEventListener("click", () => {
    changeMonth(1);
});

// Function to handle month change without affecting the current date
function changeMonth(offset) {
    displayedDate.setMonth(displayedDate.getMonth() + offset); // Change the displayed month
    initCalendar(); // Reinitialize calendar with the new displayed month
}

// Load Tasks for Selected Day
function loadTasksForDay(dateKey) {
    taskList.innerHTML = ""; // Clear previous tasks
    const dayTasks = tasks[dateKey] || [];

    dayTasks.forEach((task, index) => {
        const taskWrapper = document.createElement("div");
        taskWrapper.classList.add("task-wrapper");

        // Display the task text with optional start and due times
        const taskElement = document.createElement("span");
        taskElement.classList.add("task");

        let taskText = task.text;
        if (task.startTime || task.dueTime) {
            taskText += ` (${task.startTime || ""} - ${task.dueTime || ""})`.replace(/ - $|^\(\s*-\s*\)/, "");
        }
        taskElement.textContent = taskText;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✖";
        deleteButton.classList.add("delete-task");
        deleteButton.style.display = "none";

        // Show delete button on hover
        taskWrapper.addEventListener("mouseenter", () => {
            deleteButton.style.display = "inline";
        });
        taskWrapper.addEventListener("mouseleave", () => {
            deleteButton.style.display = "none";
        });

        deleteButton.addEventListener("click", () => {
            deleteTask(dateKey, index);
        });

        taskWrapper.appendChild(taskElement);
        taskWrapper.appendChild(deleteButton);
        taskList.appendChild(taskWrapper);
    });
}

// Add Task
document.getElementById("add-task").addEventListener("click", addTask);
document.getElementById("task-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskText = document.getElementById("task-input").value.trim();
    const startTime = document.getElementById("start-time").value;
    const dueTime = document.getElementById("due-time").value;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    // Prevent adding tasks to past dates
    if (selectedDate < today) {
        alert("You cannot add tasks for past dates.");
        return;
    }

    if (taskText) {
        const dateKey = getDateKey(selectedDate);
        tasks[dateKey] = tasks[dateKey] || [];

        // Add task with optional start and due times
        tasks[dateKey].push({
            text: taskText,
            startTime: startTime || null,
            dueTime: dueTime || null,
        });

        // Clear input fields after adding
        document.getElementById("task-input").value = "";
        document.getElementById("start-time").value = "";
        document.getElementById("due-time").value = "";

        // Save tasks to localStorage and refresh the calendar to update the task indicator
        saveTasksToStorage();
        initCalendar(); // Re-render the calendar to update task indicators
        loadTasksForDay(dateKey); // Reload tasks for the selected day
    } else {
        alert("Please enter a task description.");
    }
}



// Delete Task
function deleteTask(dateKey, index) {
    tasks[dateKey].splice(index, 1); // Remove the task
    if (tasks[dateKey].length === 0) delete tasks[dateKey]; // Remove empty date entries

    // Save updated tasks to localStorage
    saveTasksToStorage();

    // Re-render the calendar to update task indicators and reflect task deletion
    initCalendar();
    loadTasksForDay(dateKey); // Reload tasks for the selected day
}
// Load tasks from localStorage
function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : {};
}

// Save tasks to localStorage
function saveTasksToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Utility function to get a date key
function getDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", initCalendar);

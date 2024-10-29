const monthYear = document.getElementById("month-year");
const daysGrid = document.getElementById("days-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");

let currentDate = new Date();
let selectedDate = new Date(currentDate); // Initialize selected date as the current date
let tasks = loadTasksFromStorage(); // Load tasks from localStorage on startup
let selectedDateElement = null; // Track the currently selected date element

// Initialize Calendar
function initCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;
  renderDays(year, month);
  
  // Load tasks for today's date on initialization
  loadTasksForDay(getDateKey(selectedDate));
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
    const dateKey = `${year}-${month}-${day}`;
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    dayDiv.classList.add("day");

    // Set initial selection if it's the current date
    if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && day === selectedDate.getDate()) {
      dayDiv.classList.add("selected");
      selectedDateElement = dayDiv;
    }

    // Add click event to select the date
    dayDiv.addEventListener("click", () => {
      selectDate(dayDiv, new Date(year, month, day));
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

// Change Month
prevMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  initCalendar();
});
nextMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  initCalendar();
});

// Load Tasks for Selected Day
function loadTasksForDay(dateKey) {
  taskList.innerHTML = ""; // Clear previous tasks
  const dayTasks = tasks[dateKey] || []; // Retrieve tasks for the specific dateKey only

  dayTasks.forEach((task, index) => {
    // Create a wrapper div to hold the task and the delete button
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");

    // Create a task element
    const taskElement = document.createElement("span");
    taskElement.textContent = task;
    taskElement.classList.add("task");

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.classList.add("delete-task");
    deleteButton.style.display = "none"; // Initially hidden
    deleteButton.addEventListener("click", () => deleteTask(dateKey, index));

    // Append the task and delete button to the wrapper
    taskWrapper.appendChild(taskElement);
    taskWrapper.appendChild(deleteButton);
    
    // Show delete button on hover
    taskWrapper.addEventListener("mouseenter", () => {
      deleteButton.style.display = "inline"; // Show on hover
    });
    taskWrapper.addEventListener("mouseleave", () => {
      deleteButton.style.display = "none"; // Hide when not hovering
    });

    // Append the wrapper to the task list
    taskList.appendChild(taskWrapper);
  });
}

// Add Task
addTaskButton.addEventListener("click", () => {
  addTask();
});

taskInput.addEventListener("keydown", (event) => {
  if(event.key =="Enter"){
    addTask();
  }
});

function addTask(){
  const task = taskInput.value.trim();
  if (task) {
    const dateKey = getDateKey(selectedDate); // Use selectedDate for adding tasks
    tasks[dateKey] = tasks[dateKey] || [];
    tasks[dateKey].push(task);
    taskInput.value = "";

    // Save tasks to localStorage
    saveTasksToStorage();
    loadTasksForDay(dateKey); // Reload tasks for the selected day
  }
}

// Delete Task
function deleteTask(date, index) {
  tasks[date].splice(index, 1); // Remove the task
  if (tasks[date].length === 0) delete tasks[date]; // Remove empty date entries
  saveTasksToStorage(); // Save updated tasks to localStorage
  loadTasksForDay(date); // Reload tasks for the selected day
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
initCalendar();
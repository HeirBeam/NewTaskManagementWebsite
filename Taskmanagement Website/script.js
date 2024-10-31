// DOM Elements
const monthYear = document.getElementById("month-year");
const daysGrid = document.getElementById("days-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const startTimeInput = document.getElementById("start-time");
const dueTimeInput = document.getElementById("due-time");
const showAddTaskButton = document.getElementById("show-add-task");
const cancelAddTaskButton = document.getElementById("cancel-add-task");
const addTaskForm = document.getElementById("add-task-form");
const taskListContainer = document.getElementById("task-list-container");

// State Variables
let currentDate = new Date();
let displayedDate = new Date(currentDate);
let selectedDate = new Date(currentDate);
let tasks = loadTasksFromStorage();
let selectedDateElement = null;

// Initialize Calendar
document.addEventListener("DOMContentLoaded", () => {
    initCalendar();
    setupEventListeners();
});

function initCalendar() {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();
    monthYear.textContent = `${displayedDate.toLocaleString("default", { month: "long" })} ${year}`;
    renderDays(year, month);
    if (isCurrentMonth(year, month)) selectDateByElement(currentDate);
}

// Render Days
function renderDays(year, month) {
    daysGrid.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    addEmptyCells(firstDay);
    addDaysInMonth(year, month, daysInMonth);
}

function addEmptyCells(count) {
    for (let i = 0; i < count; i++) daysGrid.innerHTML += `<div></div>`;
}

function addDaysInMonth(year, month, daysInMonth) {
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayDiv = createDayDiv(day, date);
        daysGrid.appendChild(dayDiv);
    }
}

function createDayDiv(day, date) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;
    setDayClass(dayDiv, date);
    addTaskIndicator(dayDiv, date);
    addDateClickListener(dayDiv, date);
    return dayDiv;
}

function setDayClass(dayDiv, date) {
    if (isToday(date)) dayDiv.classList.add("current-date");
    if (isPastDate(date)) dayDiv.classList.add("crossed-date");
    if (isSelectedDate(date)) {
        dayDiv.classList.add("selected");
        selectedDateElement = dayDiv;
    }
}

function addTaskIndicator(dayDiv, date) {
    if (tasks[getDateKey(date)]) {
        const taskIndicator = document.createElement("span");
        taskIndicator.classList.add("task-indicator");
        dayDiv.appendChild(taskIndicator);
    }
}

function addDateClickListener(dayDiv, date) {
    dayDiv.addEventListener("click", () => selectDate(dayDiv, date));
}

// Utility: Check Date Conditions
function isToday(date) {
    return date.toDateString() === currentDate.toDateString();
}

function isPastDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

function isSelectedDate(date) {
    return date.toDateString() === selectedDate.toDateString();
}

function isCurrentMonth(year, month) {
    return year === currentDate.getFullYear() && month === currentDate.getMonth();
}

// Select Date
function selectDate(dayElement, date) {
    if (selectedDateElement) selectedDateElement.classList.remove("selected");
    dayElement.classList.add("selected");
    selectedDateElement = dayElement;
    selectedDate = date;
    loadTasksForDay(getDateKey(selectedDate));
}

function selectDateByElement(date) {
    const dayElement = Array.from(daysGrid.children).find(
        el => el.textContent == date.getDate() && el.classList.contains("day")
    );
    if (dayElement) selectDate(dayElement, date);
}

// Month Navigation
prevMonthButton.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));

function changeMonth(offset) {
    displayedDate.setMonth(displayedDate.getMonth() + offset);
    initCalendar();
}

// Task Management
function loadTasksForDay(dateKey) {
    taskList.innerHTML = "";
    (tasks[dateKey] || []).forEach((task, index) => addTaskElement(task, dateKey, index));
}

function addTaskElement(task, dateKey, index) {
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");
    taskWrapper.appendChild(createTaskTextElement(task));
    const deleteButton = createDeleteButton(dateKey, index);
    taskWrapper.appendChild(deleteButton);
    taskWrapper.addEventListener("mouseenter", () => (deleteButton.style.display = "inline"));
    taskWrapper.addEventListener("mouseleave", () => (deleteButton.style.display = "none"));
    taskList.appendChild(taskWrapper);
}

function createTaskTextElement(task) {
    const taskElement = document.createElement("span");
    taskElement.classList.add("task");
    taskElement.textContent = formatTaskText(task);
    return taskElement;
}

function formatTaskText({ text, startTime, dueTime }) {
    let taskText = text;
    if (startTime && dueTime) return `${taskText} (Start: ${startTime} - Due: ${dueTime})`;
    if (startTime) return `${taskText} (Start: ${startTime})`;
    if (dueTime) return `${taskText} (Due: ${dueTime})`;
    return taskText;
}

function createDeleteButton(dateKey, index) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.classList.add("delete-task");
    deleteButton.style.display = "none";
    deleteButton.addEventListener("click", () => deleteTask(dateKey, index));
    return deleteButton;
}

function deleteTask(dateKey, index) {
    tasks[dateKey].splice(index, 1);
    if (tasks[dateKey].length === 0) delete tasks[dateKey];
    saveTasksToStorage();
    initCalendar();
    loadTasksForDay(dateKey);
}

// Task Addition
function addTask() {
    const taskText = taskInput.value.trim();
    let startTime = formatTimeInput(startTimeInput.value);
    let dueTime = formatTimeInput(dueTimeInput.value);

    if (!taskText) return alert("Please enter a task description.");
    if (isPastDate(selectedDate)) return alert("You cannot add tasks for past dates.");

    if (!validateTimes(startTime, dueTime)) return;
    
    const dateKey = getDateKey(selectedDate);
    tasks[dateKey] = tasks[dateKey] || [];
    tasks[dateKey].push({ text: taskText, startTime, dueTime });

    clearTaskInputs();
    saveTasksToStorage();
    initCalendar();
    loadTasksForDay(dateKey);

    //close the add task form after adding a task
    toggleAddTaskForm(false);
}

function validateTimes(startTime, dueTime) {
    if (!startTime || !dueTime) return true;
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [dueHour, dueMinute] = dueTime.split(":").map(Number);
    if (dueHour < startHour || (dueHour === startHour && dueMinute < startMinute)) {
        alert("The due time cannot be earlier than the start time.");
        return false;
    }
    return true;
}

function clearTaskInputs() {
    taskInput.value = "";
    startTimeInput.value = "";
    dueTimeInput.value = "";
}

function formatTimeInput(time) {
    if (/^\d{1,2}$/.test(time)) return time + ":00";
    if (/^\d{4}$/.test(time)) return time.slice(0, 2) + ":" + time.slice(2, 4);
    if (/^\d{1,2}:\d{2}$/.test(time)) return time;
    return null;
}

// Storage
function loadTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || {};
}

function saveTasksToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Utility: Date Key
function getDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Event Listeners Setup
function setupEventListeners() {
    showAddTaskButton.addEventListener("click", () => {
        if (isPastDate(selectedDate)) alert("You cannot add tasks for past dates.");
        else toggleAddTaskForm(true);
    });
    
    cancelAddTaskButton.addEventListener("click", () => toggleAddTaskForm(false));
    
    addTaskButton.addEventListener("click", addTask);
    
    setupTimeInputListeners(startTimeInput);
    setupTimeInputListeners(dueTimeInput);
    
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && taskInput.value.trim()) addTask();
    });
}

function toggleAddTaskForm(show) {
    addTaskForm.style.display = show ? "block" : "none";
    taskListContainer.style.display = show ? "none" : "block";
}

function setupTimeInputListeners(input) {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9:]/g, ""); // Allow only numbers and colon
    });
    
    // Submit task on pressing Enter in dueTime input field
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission behavior
            addTask(); // Call addTask to submit the task
        }
    });
}
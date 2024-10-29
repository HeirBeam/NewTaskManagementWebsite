const monthYear = document.getElementById("month-year");
const daysGrid = document.getElementById("days-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");

let currentDate = new Date();
let tasks = loadTasksFromStorage(); // To store tasks by date

// Initialize Calendar
function initCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;
        renderDays(year, month);
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
      dayDiv.addEventListener("click", () => loadTasksForDay(dateKey));
      daysGrid.appendChild(dayDiv);
    }
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
  function loadTasksForDay(date) {
    taskList.innerHTML = "";
    const dayTasks = tasks[date] || [];
    dayTasks.forEach((task,index)=> {
      const li = document.createElement("li");
      li.textContent = task;
      li.classList.add("task");

      //Delete button for each task
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.classList.add("delete-task");
      deleteButton.addEventListener("click", () => deleteTask(date,index));
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }
  
  // Add Task
  addTaskButton.addEventListener("click", () => {
    const task = taskInput.value.trim();
    if (task) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      tasks[dateKey] = tasks[dateKey] || [];
      tasks[dateKey].push(task);
      taskInput.value = "";

      //Save tasks
      saveTasksToStorage();
      loadTasksForDay(dateKey);
    }
  });

  //Delete tasks
  function deleteTask(date,index){
    tasks[date].splice(index, 1);
    if(tasks[date].length ===0) delete tasks[date];
    saveTasksToStorage();
    loadTasksForDay(date);
  }
  
  //load tasks function 
  function loadTasksFromStorage(){
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : {};
  }

  //save tasks to local storage
  function saveTasksToStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks));

  }
  // Initialize
  initCalendar();
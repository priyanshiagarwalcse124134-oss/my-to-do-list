// Get the page elements that the program needs to update.
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const remainingCount = document.getElementById("remaining-count");

// Load saved tasks, or start with an empty list the first time.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save the current task list in this browser.
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Draw the tasks and update the number that are not completed.
function displayTasks() {
  taskList.innerHTML = "";

  let remaining = 0;

  tasks.forEach(function (task, index) {
    const row = document.createElement("li");
    row.className = "task-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark " + task.text + " as completed");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    // Checking the box changes the task's completed state.
    if (task.completed) {
      taskText.classList.add("completed");
    } else {
      remaining = remaining + 1;
    }

    checkbox.addEventListener("change", function () {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      displayTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete " + task.text);

    // Remove this task, then save and redraw the list.
    deleteButton.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    });

    row.appendChild(checkbox);
    row.appendChild(taskText);
    row.appendChild(deleteButton);
    taskList.appendChild(row);
  });

  remainingCount.textContent = remaining + (remaining === 1 ? " task remaining" : " tasks remaining");
}

// Add a task when the form is submitted. Trimmed empty text is ignored.
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();
  if (taskText === "") {
    return;
  }

  tasks.push({ text: taskText, completed: false });
  saveTasks();
  displayTasks();
  taskInput.value = "";
  taskInput.focus();
});

// Show saved tasks as soon as the page loads.
displayTasks();

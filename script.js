const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const taskCount = document.getElementById("taskCount");

const clearCompletedButton = document.getElementById("clearCompleted");
const currentDate = document.getElementById("currentDate");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function updateDate() {
    const date = new Date();

    currentDate.textContent = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        return;
    }

    task.text = updatedText;

    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
}

function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;

    taskCount.textContent =
        `${active} ${active === 1 ? "task" : "tasks"} remaining`;
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const content = document.createElement("div");
        content.classList.add("task-content");

        const text = document.createElement("span");
        text.classList.add("task-text");
        text.textContent = task.text;

        content.appendChild(text);

        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateStats();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

clearCompletedButton.addEventListener("click", clearCompleted);

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        filters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        currentFilter = filter.dataset.filter;

        renderTasks();
    });
});

updateDate();
renderTasks();
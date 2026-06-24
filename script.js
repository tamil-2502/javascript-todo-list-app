const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateTaskCount() {

    const remaining =
    tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
    `${remaining} Task(s) Remaining`;

}

function renderTasks(filter = currentFilter) {

    currentFilter = filter;

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (filter === "active") {

        filteredTasks =
        tasks.filter(
            task => !task.completed
        );

    }

    if (filter === "completed") {

        filteredTasks =
        tasks.filter(
            task => task.completed
        );

    }

    if (filteredTasks.length === 0) {

        taskList.innerHTML =
        `<li class="empty-state">
            No tasks available.
        </li>`;

        updateTaskCount();
        return;
    }

    filteredTasks.forEach(task => {

        const li =
        document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">

                <button
                    class="complete-btn"
                    data-id="${task.id}">
                    ✓
                </button>

                <button
                    class="edit-btn"
                    data-id="${task.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateTaskCount();

}

addBtn.addEventListener("click", () => {

    const text =
    taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();

});

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addBtn.click();
    }

});

taskList.addEventListener("click", (e) => {

    const id =
    Number(e.target.dataset.id);

    if (e.target.classList.contains("delete-btn")) {

        tasks =
        tasks.filter(
            task => task.id !== id
        );

    }

    if (e.target.classList.contains("complete-btn")) {

        tasks =
        tasks.map(task =>

            task.id === id
            ? {
                ...task,
                completed: !task.completed
            }
            : task

        );

    }

    if (e.target.classList.contains("edit-btn")) {

        const task =
        tasks.find(
            task => task.id === id
        );

        const newText =
        prompt(
            "Edit Task",
            task.text
        );

        if (
            newText &&
            newText.trim() !== ""
        ) {

            tasks =
            tasks.map(task =>

                task.id === id
                ? {
                    ...task,
                    text: newText.trim()
                }
                : task

            );

        }

    }

    saveTasks();
    renderTasks();

});

document
.querySelectorAll("[data-filter]")
.forEach(button => {

    button.addEventListener("click", () => {

        renderTasks(
            button.dataset.filter
        );

    });

});

clearCompleted.addEventListener("click", () => {

    tasks =
    tasks.filter(
        task => !task.completed
    );

    saveTasks();
    renderTasks();

});

renderTasks();
updateTaskCount();
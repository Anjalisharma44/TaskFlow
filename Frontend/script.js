
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const message = document.getElementById("message");

async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("Could not load tasks");

        const tasks = await response.json();
        list.replaceChildren();

        tasks.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.task;
            list.appendChild(li);
        });
    } catch (error) {
        message.textContent = "Unable to connect to the backend.";
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const task = input.value.trim();
    if (!task) return;

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task })
        });

        if (!response.ok) throw new Error("Could not add task");

        input.value = "";
        message.textContent = "Task added successfully!";
        await loadTasks();
    } catch (error) {
        message.textContent = "Could not add task. Check the backend.";
    }
});

loadTasks();
document.addEventListener("DOMContentLoaded", () => {
    initClock();
    initCounter();
    initClassToggles();
    initTaskList();
    initEventPlayground();
});

function initClock() {
    const timeEl = document.getElementById("clock-time");
    if (!timeEl) return;

    const render = () => {
        timeEl.textContent = new Date().toLocaleTimeString();
    };

    render();
    setInterval(render, 1000);
}

function initCounter() {
    const output = document.getElementById("count-value");
    const incBtn = document.getElementById("increment");
    const decBtn = document.getElementById("decrement");
    const resetBtn = document.getElementById("reset");

    let count = 0;

    const update = () => {
        output.textContent = String(count);
        output.classList.toggle("is-positive", count > 0);
        output.classList.toggle("is-negative", count < 0);
    };

    incBtn.addEventListener("click", () => {
        count += 1;
        update();
    });

    decBtn.addEventListener("click", () => {
        count -= 1;
        update();
    });

    resetBtn.addEventListener("click", () => {
        count = 0;
        update();
    });

    update();
}

function initClassToggles() {
    const box = document.getElementById("toggle-box");

    const themeClasses = ["is-highlight", "is-dark"];

    const setTheme = (className) => {
        const alreadyActive = box.classList.contains(className);
        themeClasses.forEach((cls) => box.classList.remove(cls));
        if (!alreadyActive) {
            box.classList.add(className);
        }
    };

    document
        .getElementById("toggle-highlight")
        .addEventListener("click", () => setTheme("is-highlight"));

    document
        .getElementById("toggle-dark")
        .addEventListener("click", () => setTheme("is-dark"));

    document
        .getElementById("toggle-round")
        .addEventListener("click", () => box.classList.toggle("is-round"));
}

function initTaskList() {
    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");
    const emptyHint = document.getElementById("task-empty");

    const refreshEmptyState = () => {
        emptyHint.hidden = list.children.length > 0;
    };

    const createTask = (text) => {
        const li = document.createElement("li");
        li.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.setAttribute("aria-label", `Mark "${text}" as done`);

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = text;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "task-remove";
        removeBtn.textContent = "\u00d7";
        removeBtn.setAttribute("aria-label", `Remove "${text}"`);

        li.append(checkbox, span, removeBtn);
        return li;
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        list.appendChild(createTask(text));
        input.value = "";
        input.focus();
        refreshEmptyState();
    });

    list.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("task-remove")) {
            target.closest(".task-item").remove();
            refreshEmptyState();
        }
    });

    list.addEventListener("change", (event) => {
        if (event.target.classList.contains("task-check")) {
            const item = event.target.closest(".task-item");
            item.classList.toggle("is-done", event.target.checked);
        }
    });

    refreshEmptyState();
}

function initEventPlayground() {
    const liveInput = document.getElementById("live-input");
    const liveOutput = document.getElementById("live-output");
    const charCount = document.getElementById("char-count");
    const pad = document.getElementById("hover-pad");
    const log = document.getElementById("event-log");

    const setLog = (message) => {
        log.textContent = message;
    };

    liveInput.addEventListener("input", () => {
        const value = liveInput.value;
        liveOutput.textContent = value === "" ? "nothing yet" : value;
        charCount.textContent = String(value.length);
    });

    pad.addEventListener("mouseenter", () => {
        pad.classList.add("is-hover");
        setLog("mouseenter");
    });

    pad.addEventListener("mouseleave", () => {
        pad.classList.remove("is-hover", "is-active");
        setLog("mouseleave");
    });

    pad.addEventListener("mousedown", () => {
        pad.classList.add("is-active");
        setLog("mousedown");
    });

    pad.addEventListener("mouseup", () => {
        pad.classList.remove("is-active");
        setLog("mouseup");
    });

    pad.addEventListener("click", () => {
        setLog("click");
    });

    pad.addEventListener("keydown", (event) => {
        setLog(`keydown: "${event.key}"`);
    });
}
